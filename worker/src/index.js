const ALLOWED_ORIGINS = new Set([
  "https://profobemeasor-hub.github.io",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function cors(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://profobemeasor-hub.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type, X-Poco-Pin",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET, DELETE",
    "Vary": "Origin",
  };
}

function json(body, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) },
  });
}

function authorized(request, env) {
  return Boolean(env.APP_PIN && request.headers.get("X-Poco-Pin") === env.APP_PIN);
}

function extractText(data) {
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === "output_text" && content?.text) return content.text;
      if (content?.text) return content.text;
    }
  }
  return "";
}

function parseCoachPayload(text) {
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    const obj = JSON.parse(cleaned);
    return {
      reply: String(obj.reply || ""),
      correction: String(obj.correction || ""),
      tip: String(obj.tip || ""),
      vocabulary: Array.isArray(obj.vocabulary) ? obj.vocabulary.slice(0, 3).map(String) : [],
      score: Number.isFinite(Number(obj.score)) ? Math.max(0, Math.min(100, Number(obj.score))) : 75,
      topic: String(obj.topic || "daily life").slice(0, 80),
    };
  } catch {
    return { reply: text || "Sigamos hablando. ¿Qué pasó después?", correction: "", tip: "", vocabulary: [], score: 75, topic: "daily life" };
  }
}

async function recentMemory(env, limit = 40) {
  if (!env.MEMORY) return [];
  const result = await env.MEMORY.prepare(
    `SELECT created_at, mode, learner_text, topic, correction, tip, vocabulary_json, score
     FROM interactions ORDER BY id DESC LIMIT ?`
  ).bind(limit).all();
  return result.results || [];
}

function summarizeMemory(rows) {
  if (!rows.length) return {
    sessions: 0, averageScore: null, weakCorrections: [], vocabulary: [], topics: [], recent: []
  };

  const corr = new Map(), vocab = new Map(), topics = new Map();
  let total = 0;
  for (const row of rows) {
    total += Number(row.score) || 0;
    const c = String(row.correction || "").trim();
    if (c) corr.set(c, (corr.get(c) || 0) + 1);
    const t = String(row.topic || "").trim();
    if (t) topics.set(t, (topics.get(t) || 0) + 1);
    try {
      for (const v of JSON.parse(row.vocabulary_json || "[]")) {
        const word = String(v).trim();
        if (word) vocab.set(word, (vocab.get(word) || 0) + 1);
      }
    } catch {}
  }
  const top = (m, n) => [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,n).map(([text,count])=>({text,count}));
  return {
    sessions: rows.length,
    averageScore: Math.round(total / rows.length),
    weakCorrections: top(corr, 5),
    vocabulary: top(vocab, 8),
    topics: top(topics, 5),
    recent: rows.slice(0, 5).map(r => ({createdAt:r.created_at, mode:r.mode, topic:r.topic, score:r.score, learnerText:r.learner_text}))
  };
}

function memoryPrompt(profile) {
  if (!profile.sessions) return "No prior learner memory yet. Establish a baseline naturally.";
  const corrections = profile.weakCorrections.map(x=>x.text).join(" | ") || "none recorded";
  const vocab = profile.vocabulary.map(x=>x.text).join(", ") || "none recorded";
  const topics = profile.topics.map(x=>x.text).join(", ") || "general daily life";
  return `Persistent learner memory: ${profile.sessions} saved turns; average communication score ${profile.averageScore}/100. Recurring corrections: ${corrections}. Useful/recent vocabulary: ${vocab}. Common practice topics: ${topics}. Use this memory subtly: revisit weak areas when natural, but do not lecture or mention database/memory mechanics unless asked.`;
}

async function saveInteraction(env, {mode, learnerText, payload}) {
  if (!env.MEMORY || !learnerText) return;
  await env.MEMORY.prepare(
    `INSERT INTO interactions (mode, learner_text, topic, correction, tip, vocabulary_json, score)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    mode,
    learnerText.slice(0, 1200),
    payload.topic.slice(0, 80),
    payload.correction.slice(0, 600),
    payload.tip.slice(0, 400),
    JSON.stringify(payload.vocabulary.slice(0, 3)),
    payload.score
  ).run();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (url.pathname === "/health") return json({ ok: true, service: "poco-a-poco-ai", memory: Boolean(env.MEMORY) }, 200, origin);

    if (["/chat", "/memory", "/memory/reset"].includes(url.pathname) && !authorized(request, env)) {
      return json({ error: "Incorrect AI PIN." }, 401, origin);
    }

    if (url.pathname === "/memory" && request.method === "GET") {
      try { return json({ memory: summarizeMemory(await recentMemory(env, 60)) }, 200, origin); }
      catch (e) { console.error("Memory read error", e); return json({ error: "Could not read tutor memory." }, 500, origin); }
    }

    if (url.pathname === "/memory/reset" && request.method === "POST") {
      try {
        if (!env.MEMORY) return json({ error: "Memory database is not configured." }, 503, origin);
        await env.MEMORY.prepare("DELETE FROM interactions").run();
        return json({ ok: true }, 200, origin);
      } catch (e) { console.error("Memory reset error", e); return json({ error: "Could not reset tutor memory." }, 500, origin); }
    }

    if (url.pathname !== "/chat" || request.method !== "POST") return json({ error: "Not found" }, 404, origin);
    if (!env.OPENAI_API_KEY || !env.APP_PIN) return json({ error: "AI gateway is not configured yet." }, 503, origin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid request." }, 400, origin); }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const mode = ["everyday", "social", "practical", "spanish"].includes(body.mode) ? body.mode : "everyday";
    if (!messages.length) return json({ error: "No conversation supplied." }, 400, origin);

    const modeGuide = {
      everyday: "Use ordinary daily-life Guatemala situations: cafés, restaurants, shopping, neighbours, errands, taxis/Uber, weekend plans, apartment life and casual conversation.",
      social: "Prioritize warm small talk, getting to know people, hobbies, weekend plans, travel, food, family and making friends. Keep boundaries natural and respectful.",
      practical: "Prioritize practical situations such as banking, pharmacy, doctor, apartment maintenance, directions, buying things, phone service and solving everyday problems.",
      spanish: "Speak almost entirely in Spanish. Use English only for a short correction when it materially helps learning.",
    }[mode];

    let profile;
    try { profile = summarizeMemory(await recentMemory(env, 60)); }
    catch (e) { console.error("Memory load error", e); profile = summarizeMemory([]); }

    const transcript = messages.map(m => `${m.role === "assistant" ? "Tutor" : "Learner"}: ${String(m.content || "").slice(0, 1200)}`).join("\n");
    const latestLearner = [...messages].reverse().find(m=>m.role === "user")?.content || "";

    const instructions = `You are Poco a Poco, a warm, practical Spanish conversation coach for an adult English speaker living in Guatemala.\n\n${modeGuide}\n\n${memoryPrompt(profile)}\n\nDo NOT make the conversation workplace-, port-, IT- or terminal-specific unless the learner explicitly asks. Use usted by default with strangers and explain informal Guatemala usage when helpful. Keep each conversational reply concise: normally 1-3 Spanish sentences plus at most one short correction. Continue the conversation naturally by asking one relevant question. Correct only errors that materially affect naturalness or meaning; do not interrupt fluency for every small mistake. Prefer Guatemalan/Latin American vocabulary.\n\nReturn ONLY valid JSON with this exact shape:\n{"reply":"natural response in Spanish","correction":"brief correction or empty string","tip":"one brief learning tip or empty string","vocabulary":["up to 3 useful words/phrases"],"score":0,"topic":"short everyday-life topic label"}\n\nscore is 0-100 for communicative effectiveness of the learner's latest Spanish response. If the latest learner message is an English instruction to start the conversation, use score 75 and do not correct it.`;

    const openai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", instructions, input: `Continue this conversation.\n\n${transcript}`, max_output_tokens: 500 }),
    });

    const data = await openai.json();
    if (!openai.ok) {
      console.error("OpenAI error", data?.error?.message || openai.status);
      return json({ error: "The AI service could not answer. Check your API account/billing and try again." }, 502, origin);
    }

    const text = extractText(data);
    if (!text) return json({ error: "The AI returned an empty response." }, 502, origin);
    const payload = parseCoachPayload(text);
    try { await saveInteraction(env, {mode, learnerText: latestLearner, payload}); }
    catch (e) { console.error("Memory save error", e); }

    let updatedMemory = profile;
    try { updatedMemory = summarizeMemory(await recentMemory(env, 60)); } catch {}
    return json({...payload, memory: updatedMemory}, 200, origin);
  }
};
