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
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Vary": "Origin",
  };
}

function json(body, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors(origin) },
  });
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
      vocabulary: Array.isArray(obj.vocabulary) ? obj.vocabulary.slice(0, 3) : [],
      score: Number.isFinite(Number(obj.score)) ? Math.max(0, Math.min(100, Number(obj.score))) : 75,
    };
  } catch {
    return { reply: text || "Sigamos hablando. ¿Qué pasó después?", correction: "", tip: "", vocabulary: [], score: 75 };
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
    if (url.pathname === "/health") return json({ ok: true, service: "poco-a-poco-ai" }, 200, origin);
    if (url.pathname !== "/chat" || request.method !== "POST") return json({ error: "Not found" }, 404, origin);

    if (!env.OPENAI_API_KEY || !env.APP_PIN) return json({ error: "AI gateway is not configured yet." }, 503, origin);
    if (request.headers.get("X-Poco-Pin") !== env.APP_PIN) return json({ error: "Incorrect AI PIN." }, 401, origin);

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

    const transcript = messages.map(m => `${m.role === "assistant" ? "Tutor" : "Learner"}: ${String(m.content || "").slice(0, 1200)}`).join("\n");
    const instructions = `You are Poco a Poco, a warm, practical Spanish conversation coach for an adult English speaker living in Guatemala.\n\n${modeGuide}\n\nDo NOT make the conversation workplace-, port-, IT- or terminal-specific unless the learner explicitly asks. Use usted by default with strangers and explain informal Guatemala usage when helpful. Keep each conversational reply concise: normally 1-3 Spanish sentences plus at most one short correction. Continue the conversation naturally by asking one relevant question. Correct only errors that materially affect naturalness or meaning; do not interrupt fluency for every small mistake. Prefer Guatemalan/Latin American vocabulary.\n\nReturn ONLY valid JSON with this exact shape:\n{"reply":"natural response in Spanish","correction":"brief correction or empty string","tip":"one brief learning tip or empty string","vocabulary":["up to 3 useful words/phrases"],"score":0}\n\nscore is 0-100 for communicative effectiveness of the learner's latest Spanish response. If the latest learner message is an English instruction to start the conversation, use score 75 and do not correct it.`;

    const openai = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions,
        input: `Continue this conversation.\n\n${transcript}`,
        max_output_tokens: 500,
      }),
    });

    const data = await openai.json();
    if (!openai.ok) {
      console.error("OpenAI error", data?.error?.message || openai.status);
      return json({ error: "The AI service could not answer. Check your API account/billing and try again." }, 502, origin);
    }

    const text = extractText(data);
    if (!text) return json({ error: "The AI returned an empty response." }, 502, origin);
    return json(parseCoachPayload(text), 200, origin);
  }
};
