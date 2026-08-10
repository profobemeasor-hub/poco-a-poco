import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Home,Map,MessageCircle,Layers,BarChart3,ChevronRight,ChevronLeft,Volume2,Mic,Check,Flame,Target,Sparkles,Play,RotateCcw,Send,UserRound,BookOpen,Shuffle,Brain} from 'lucide-react';
import {CHAPTERS,CHARACTERS,MISSIONS,SCENARIOS,CONFIDENCE_LABELS} from './data/living';
import {useLivingProgress} from './hooks/useLivingProgress';

const T={ground:'#0E2B2A',surface:'#143836',raised:'#1B4543',line:'#27544F',cream:'#F2E9DC',sand:'#BFAE97',marigold:'#E9A33C',jade:'#57B79A',rose:'#DB6A6A',violet:'#9B7BB8'};
const serif='Georgia,"Iowan Old Style","Times New Roman",serif'; const mono='ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
const today=()=>new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
function say(text,rate=.88){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-GT';u.rate=rate;speechSynthesis.speak(u)}catch{}}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/g,' ')}
function detectMistakes(text){
  const n=norm(text);
  const found=[];
  if(/\byo fue\b/.test(n)) found.push('past tense: yo fui');
  if(/\byo gusto\b/.test(n)) found.push('gustar: me gusta');
  if(/\bestoy de nigeria\b/.test(n)) found.push('origin: soy de');
  if(/\bsoy (cansado|enfermo|mareado)\b/.test(n)) found.push('state: use estar');
  if(/\btengo caliente\b/.test(n)) found.push('tener calor');
  return found;
}
function scoreAnswer(text,keys=[]){
  if(!text.trim())return {score:0,missing:keys,mistakes:[]};
  const n=norm(text);
  const words=text.trim().split(/\s+/).length;
  const hits=keys.filter(k=>n.includes(norm(k)));
  const missing=keys.filter(k=>!n.includes(norm(k)));
  let score=Math.min(45,Math.round(words*4));
  score+=keys.length?Math.round((hits.length/keys.length)*55):45;
  const mistakes=detectMistakes(text);
  score-=mistakes.length*6;
  return {score:Math.max(0,Math.min(100,score)),missing,mistakes};
}
function pick(v){
  if(Array.isArray(v)) return v[Math.floor(Math.random()*v.length)];
  return v;
}

function Shell({children}){return <div style={{minHeight:'100vh',background:T.ground,color:T.cream,fontFamily:'system-ui,-apple-system,Segoe UI,sans-serif'}}><div style={{maxWidth:520,margin:'0 auto',paddingBottom:94}}>{children}</div></div>}
function Header({title,sub,onBack}){return <div style={{display:'flex',gap:12,alignItems:'center',padding:'24px 20px 16px'}}>{onBack&&<button onClick={onBack} style={btnIcon}><ChevronLeft size={20}/></button>}<div><div style={{fontFamily:serif,fontSize:25}}>{title}</div>{sub&&<div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.11em',marginTop:3}}>{sub.toUpperCase()}</div>}</div></div>}
const card={background:T.surface,border:`1px solid ${T.line}`,borderRadius:20}; const btnIcon={width:40,height:40,borderRadius:12,background:T.surface,border:`1px solid ${T.line}`,color:T.cream,display:'grid',placeItems:'center'};
function ProgressBar({value,color=T.jade}){return <div style={{height:7,borderRadius:99,background:'rgba(242,233,220,.09)',overflow:'hidden'}}><div style={{width:`${value}%`,height:'100%',background:color,borderRadius:99}}/></div>}

function Dashboard({lp,onGo}){const {state,weakest}=lp; const mission=MISSIONS.find(m=>!state.missionDone[m.id])||MISSIONS[state.day%MISSIONS.length]; const weakLabel=CONFIDENCE_LABELS[weakest?.[0]]||'Daily life'; return <>
 <div style={{padding:'30px 20px 18px'}}><div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.14em'}}>{today().toUpperCase()} · LIVE GUATEMALA</div><h1 style={{fontFamily:serif,fontWeight:400,fontSize:38,lineHeight:1.05,margin:'10px 0 8px'}}>Poco a poco<span style={{color:T.marigold}}>.</span></h1><div style={{color:T.sand,fontSize:14}}>Speak more, hesitate less — everyday Guatemala first.</div></div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px 14px'}}><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em'}}>XP</div><div style={{fontFamily:serif,fontSize:27,marginTop:4}}>{state.xp}</div></div><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em'}}>ADAPTIVE FOCUS</div><div style={{fontFamily:serif,fontSize:20,color:T.marigold,marginTop:7}}>{weakLabel}</div></div></div>
 <div style={{padding:'0 20px 14px'}}><button onClick={()=>onGo('missions')} style={{...card,width:'100%',textAlign:'left',padding:18,color:T.cream,background:'linear-gradient(145deg,#1B4543,#143836)'}}><div style={{fontFamily:mono,fontSize:10,color:T.marigold,letterSpacing:'.13em'}}>TODAY'S REAL-WORLD MISSION</div><div style={{display:'flex',alignItems:'center',gap:13,marginTop:12}}><div style={{fontSize:34}}>{mission.icon}</div><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:22}}>{mission.title}</div><div style={{fontSize:13,color:T.sand,marginTop:3}}>{mission.place}</div></div><ChevronRight color={T.marigold}/></div></button></div>
 <div style={{padding:'0 20px'}}><div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.12em',margin:'10px 0'}}>CONTINUE YOUR JOURNEY</div>{CHAPTERS.slice(0,3).map(ch=><button key={ch.id} onClick={()=>onGo('journey',ch.id)} style={{...card,width:'100%',padding:15,marginBottom:9,color:T.cream,textAlign:'left',display:'flex',gap:13,alignItems:'center'}}><div style={{fontSize:28}}>{ch.icon}</div><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:19}}>{ch.n}. {ch.title}</div><div style={{fontSize:12.5,color:T.sand,margin:'3px 0 8px'}}>{ch.en}</div><ProgressBar value={state.confidence[ch.confidence]||0} color={ch.color}/></div><div style={{fontFamily:mono,fontSize:11,color:ch.color}}>{state.confidence[ch.confidence]||0}%</div></button>)}</div>
 </>}

function Journey({ lp, selected, setSelected }) {
  const ch = selected ? CHAPTERS.find((c) => c.id === selected) : null;

  if (ch) {
    const scenarios = SCENARIOS.filter((s) => s.chapter === ch.id);
    const confidence = lp.state.confidence[ch.confidence] || 0;

    return (
      <>
        <Header
          title={ch.title}
          sub={ch.en}
          onBack={() => setSelected(null)}
        />

        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ ...card, padding: 18, marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: 35 }}>{ch.icon}</div>
                <div
                  style={{
                    fontFamily: serif,
                    fontSize: 24,
                    marginTop: 6,
                  }}
                >
                  Confidence
                </div>
              </div>

              <div
                style={{
                  fontFamily: serif,
                  fontSize: 38,
                  color: ch.color,
                }}
              >
                {confidence}%
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <ProgressBar value={confidence} color={ch.color} />
            </div>
          </div>

          <div
            style={{
              fontFamily: mono,
              fontSize: 10,
              color: T.sand,
              letterSpacing: ".12em",
              marginBottom: 9,
            }}
          >
            REAL SITUATIONS
          </div>

          {ch.scenes.map((scene, index) => (
            <div
              key={scene}
              style={{
                ...card,
                padding: "13px 15px",
                marginBottom: 8,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 99,
                  background: T.raised,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: mono,
                  fontSize: 10,
                  color: ch.color,
                }}
              >
                {index + 1}
              </div>

              <div style={{ fontSize: 14 }}>{scene}</div>
            </div>
          ))}

          {scenarios.length > 0 && (
            <div style={{ marginTop: 18, color: T.sand, fontSize: 13 }}>
              Practice this chapter in the{" "}
              <b style={{ color: T.cream }}>Roleplay</b> tab.
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Living Journey"
        sub="Everyday Spanish before workplace Spanish"
      />

      <div style={{ padding: "0 20px 28px" }}>
        {CHAPTERS.map((chapter) => {
          const confidence =
            lp.state.confidence[chapter.confidence] || 0;

          return (
            <button
              key={chapter.id}
              onClick={() => setSelected(chapter.id)}
              style={{
                ...card,
                width: "100%",
                padding: 16,
                marginBottom: 10,
                color: T.cream,
                textAlign: "left",
                display: "flex",
                gap: 13,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 29 }}>{chapter.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: serif, fontSize: 19 }}>
                  {String(chapter.n).padStart(2, "0")} · {chapter.title}
                </div>

                <div
                  style={{
                    fontSize: 12.5,
                    color: T.sand,
                    margin: "3px 0 8px",
                  }}
                >
                  {chapter.en}
                </div>

                <ProgressBar
                  value={confidence}
                  color={chapter.color}
                />
              </div>

              <ChevronRight size={18} color={T.sand} />
            </button>
          );
        })}
      </div>
    </>
  );
}

function Missions({lp}){const [open,setOpen]=useState(null);const m=MISSIONS.find(x=>x.id===open);if(m)return <><Header title={m.title} sub={m.place} onBack={()=>setOpen(null)}/><div style={{padding:'0 20px 28px'}}><div style={{...card,padding:22,textAlign:'center'}}><div style={{fontSize:54}}>{m.icon}</div><div style={{fontFamily:serif,fontSize:25,marginTop:10}}>{m.prompt}</div><div style={{fontSize:13.5,color:T.sand,lineHeight:1.6,marginTop:15,paddingTop:15,borderTop:`1px solid ${T.line}`}}>{m.coach}</div><button onClick={()=>{lp.completeMission(m.id,m.confidence);setOpen(null)}} style={{width:'100%',marginTop:20,padding:14,borderRadius:14,border:0,background:T.jade,color:T.ground,fontWeight:750}}><Check size={17} style={{verticalAlign:'middle',marginRight:7}}/>I did it in real life</button></div></div></>;
return <><Header title="Today's Missions" sub="Take Spanish outside the app"/><div style={{padding:'0 20px 28px'}}>{MISSIONS.map(m=>{const done=!!lp.state.missionDone[m.id];return <button key={m.id} onClick={()=>setOpen(m.id)} style={{...card,width:'100%',padding:16,marginBottom:9,color:T.cream,textAlign:'left',display:'flex',gap:13,alignItems:'center',opacity:done ? .68 : 1}}><div style={{fontSize:29}}>{m.icon}</div><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:18}}>{m.title}</div><div style={{fontSize:12.5,color:T.sand,marginTop:3}}>{m.place}</div></div>{done?<Check color={T.jade}/>:<ChevronRight color={T.sand}/>}</button>})}</div></>}

function SmartCoach({lp}){
  const [id,setId]=useState(null);
  const [turn,setTurn]=useState(0);
  const [answer,setAnswer]=useState('');
  const [result,setResult]=useState(null);
  const [listening,setListening]=useState(false);
  const [sessionScores,setSessionScores]=useState([]);
  const [prompt,setPrompt]=useState('');
  const recognition=useRef(null);

  const s=SCENARIOS.find(x=>x.id===id);
  const chapter=s&&CHAPTERS.find(c=>c.id===s.chapter);
  const character=s&&CHARACTERS.find(c=>c.id===s.character);
  const current=s?.turns?.[turn];

  useEffect(()=>{
    if(current){
      const p=pick(current.prompt);
      setPrompt(p);
      setAnswer('');
      setResult(null);
      setTimeout(()=>say(p,.86),120);
    }
  },[id,turn]);

  const listen=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert('Speech recognition is not available here. You can type your answer instead.');return}
    const r=new SR();
    r.lang='es-GT';
    r.interimResults=false;
    r.continuous=false;
    r.onstart=()=>setListening(true);
    r.onend=()=>setListening(false);
    r.onerror=()=>setListening(false);
    r.onresult=e=>setAnswer(e.results[0][0].transcript);
    r.start();
    recognition.current=r;
  };

  const averages=(x)=>{
    const h=lp.state.scenarioScores[x.id]||[];
    return h.length?Math.round(h.reduce((a,b)=>a+b.score,0)/h.length):null;
  };
  const areaScore=x=>lp.state.confidence[CHAPTERS.find(c=>c.id===x.chapter)?.confidence]||0;
  const ordered=[...SCENARIOS].sort((a,b)=>{
    const aa=averages(a)??areaScore(a), bb=averages(b)??areaScore(b);
    return aa-bb;
  });

  const startScenario=(scenarioId)=>{
    setId(scenarioId); setTurn(0); setAnswer(''); setResult(null); setSessionScores([]);
  };

  if(!s){
    const weakArea=lp.weakest?.[0];
    const recommended=ordered.find(x=>CHAPTERS.find(c=>c.id===x.chapter)?.confidence===weakArea)||ordered[0];
    return <>
      <Header title="Smart Coach" sub="Adaptive · offline · voice-first"/>
      <div style={{padding:'0 20px 28px'}}>
        <div style={{...card,padding:17,marginBottom:12,borderColor:T.violet}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}><Brain size={20} color={T.violet}/><div style={{fontFamily:serif,fontSize:20}}>Recommended next</div></div>
          <div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:7}}>Based on your lowest confidence and recent scores.</div>
          <button onClick={()=>startScenario(recommended.id)} style={{width:'100%',marginTop:12,padding:13,borderRadius:13,border:0,background:T.violet,color:T.ground,fontWeight:750,textAlign:'left'}}>
            {recommended.title} → {recommended.en}
          </button>
          {lp.weakWords.length>0&&<div style={{fontSize:12.5,color:T.sand,marginTop:10}}>Words to recycle: <b style={{color:T.cream}}>{lp.weakWords.slice(0,4).map(([w])=>w).join(' · ')}</b></div>}
        </div>

        <button onClick={()=>startScenario(SCENARIOS[Math.floor(Math.random()*SCENARIOS.length)].id)} style={{width:'100%',padding:13,borderRadius:13,border:`1px solid ${T.marigold}`,background:'transparent',color:T.marigold,fontWeight:700,marginBottom:14}}>
          <Shuffle size={16} style={{verticalAlign:'middle',marginRight:7}}/> Surprise me
        </button>

        {ordered.map(x=>{
          const ch=CHAPTERS.find(c=>c.id===x.chapter);
          const avg=averages(x);
          return <button key={x.id} onClick={()=>startScenario(x.id)} style={{...card,width:'100%',padding:16,marginBottom:9,color:T.cream,textAlign:'left',display:'flex',gap:12,alignItems:'center'}}>
            <div style={{fontSize:27}}>{CHARACTERS.find(c=>c.id===x.character)?.avatar||ch?.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:serif,fontSize:18.5}}>{x.title}</div>
              <div style={{fontSize:12.5,color:T.sand,marginTop:3}}>{x.en} · {x.turns.length} turns</div>
            </div>
            {avg!=null?<div style={{fontFamily:mono,fontSize:12,color:avg>=75?T.jade:avg>=55?T.marigold:T.rose}}>{avg}%</div>:<ChevronRight color={T.sand}/>}
          </button>
        })}
      </div>
    </>;
  }

  if(turn>=s.turns.length){
    const avg=sessionScores.length?Math.round(sessionScores.reduce((a,b)=>a+b,0)/sessionScores.length):0;
    return <>
      <Header title={s.title} sub="Conversation complete" onBack={()=>setId(null)}/>
      <div style={{padding:'0 20px 28px'}}>
        <div style={{...card,padding:22,textAlign:'center',borderColor:avg>=70?T.jade:T.marigold}}>
          <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.12em'}}>SESSION SCORE</div>
          <div style={{fontFamily:serif,fontSize:58,color:avg>=70?T.jade:T.marigold,marginTop:8}}>{avg}%</div>
          <div style={{fontSize:14,color:T.sand,lineHeight:1.55,marginTop:8}}>
            {avg>=80?'Strong. Run it again later and answer faster.':avg>=60?'Communicative. Your weak words have been saved for recycling.':'Worth repeating. Smart Coach will bring this area back sooner.'}
          </div>
          <button onClick={()=>startScenario(s.id)} style={{width:'100%',padding:13,borderRadius:13,border:0,background:T.jade,color:T.ground,fontWeight:750,marginTop:16}}><RotateCcw size={16} style={{verticalAlign:'middle',marginRight:6}}/>Run it again</button>
          <button onClick={()=>setId(null)} style={{width:'100%',padding:13,borderRadius:13,border:`1px solid ${T.line}`,background:'transparent',color:T.cream,marginTop:8}}>Choose another situation</button>
        </div>
      </div>
    </>;
  }

  const submit=()=>{
    const detail=scoreAnswer(answer,current.expected);
    setResult(detail);
    setSessionScores(x=>[...x,detail.score]);
    lp.recordCoachTurn({
      scenarioId:s.id,
      area:chapter.confidence,
      score:detail.score,
      missing:detail.missing,
      mistakes:detail.mistakes
    });
    say(current.model,.82);
  };

  return <>
    <Header title={s.title} sub={`${character?`${character.name} · `:''}turn ${turn+1} of ${s.turns.length}`} onBack={()=>setId(null)}/>
    <div style={{padding:'0 20px 28px'}}>
      <div style={{height:4,borderRadius:99,background:'rgba(242,233,220,.08)',marginBottom:12}}><div style={{height:'100%',width:`${(turn/s.turns.length)*100}%`,background:T.marigold,borderRadius:99}}/></div>

      <div style={{...card,padding:18,marginBottom:12}}>
        <div style={{fontFamily:mono,fontSize:9,color:T.marigold,letterSpacing:'.12em'}}>THEY SAY</div>
        <div style={{fontFamily:serif,fontSize:23,lineHeight:1.35,marginTop:10}}>{prompt}</div>
        <button onClick={()=>say(prompt)} style={{...btnIcon,marginTop:12}}><Volume2 size={18}/></button>
      </div>

      <div style={{...card,padding:18,background:T.raised}}>
        <div style={{fontFamily:mono,fontSize:9,color:T.jade,letterSpacing:'.12em'}}>YOUR TURN — SAY IT BEFORE YOU THINK TOO MUCH</div>
        <textarea value={answer} onChange={e=>setAnswer(e.target.value)} disabled={!!result} placeholder="Speak first. The microphone will transcribe your answer…" style={{width:'100%',boxSizing:'border-box',minHeight:100,marginTop:12,padding:13,borderRadius:13,border:`1px solid ${T.line}`,background:T.ground,color:T.cream,fontSize:16,resize:'vertical'}}/>
        <div style={{display:'flex',gap:9,marginTop:10}}>
          <button onClick={listen} disabled={!!result} style={{flex:1,padding:13,borderRadius:13,border:`1px solid ${listening?T.rose:T.line}`,background:'transparent',color:listening?T.rose:T.cream}}><Mic size={16} style={{verticalAlign:'middle',marginRight:6}}/>{listening?'Listening…':'Speak'}</button>
          <button onClick={submit} disabled={!answer.trim()||!!result} style={{flex:1,padding:13,borderRadius:13,border:0,background:answer.trim()&&!result?T.jade:T.surface,color:answer.trim()&&!result?T.ground:T.sand,fontWeight:700}}><Check size={16} style={{verticalAlign:'middle',marginRight:6}}/>Check</button>
        </div>
      </div>

      {result&&<div style={{...card,padding:18,marginTop:12,borderColor:result.score>=70?T.jade:T.marigold}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <div style={{fontFamily:serif,fontSize:22}}>Communication</div>
          <div style={{fontFamily:serif,fontSize:34,color:result.score>=70?T.jade:T.marigold}}>{result.score}%</div>
        </div>

        {result.missing.length>0&&<div style={{marginTop:12}}>
          <div style={{fontFamily:mono,fontSize:9,color:T.rose,letterSpacing:'.1em'}}>USEFUL LANGUAGE TO RECYCLE</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:7}}>{result.missing.map(w=><span key={w} style={{padding:'6px 9px',borderRadius:99,background:'rgba(219,106,106,.12)',border:`1px solid ${T.rose}`,fontSize:12}}>{w}</span>)}</div>
        </div>}

        {result.mistakes.length>0&&<div style={{marginTop:12}}>
          <div style={{fontFamily:mono,fontSize:9,color:T.marigold,letterSpacing:'.1em'}}>PATTERN TO WATCH</div>
          {result.mistakes.map(m=><div key={m} style={{fontSize:13.5,color:T.sand,marginTop:5}}>• {m}</div>)}
        </div>}

        <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>NATURAL MODEL</div>
        <div style={{fontFamily:serif,fontSize:20,lineHeight:1.4,marginTop:7}}>{current.model}</div>
        {current.tips?.map(t=><div key={t} style={{fontSize:13.5,color:T.sand,lineHeight:1.5,marginTop:6}}>• {t}</div>)}

        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button onClick={()=>say(current.model,.82)} style={btnIcon}><Volume2 size={18}/></button>
          <button onClick={()=>{setTurn(t=>t+1);setResult(null)}} style={{flex:1,padding:13,borderRadius:13,border:0,background:T.marigold,color:T.ground,fontWeight:750}}>Continue conversation <ChevronRight size={16} style={{verticalAlign:'middle'}}/></button>
        </div>
      </div>}
    </div>
  </>;
}
function Progress({lp}){
  const [reflection,setReflection]=useState('');
  const totalRounds=Object.values(lp.state.scenarioScores).reduce((n,a)=>n+a.length,0);
  return <>
    <Header title="Confidence" sub="Adaptive memory stays on this device"/>
    <div style={{padding:'0 20px 28px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}>
        <div style={{...card,padding:15}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>XP</div><div style={{fontFamily:serif,fontSize:29,marginTop:4}}>{lp.state.xp}</div></div>
        <div style={{...card,padding:15}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>COACH TURNS</div><div style={{fontFamily:serif,fontSize:29,marginTop:4}}>{lp.state.coachMemory?.totalTurns||0}</div></div>
      </div>

      <div style={{...card,padding:17,marginBottom:18,borderColor:T.violet}}>
        <div style={{display:'flex',gap:9,alignItems:'center'}}><Brain size={19} color={T.violet}/><div style={{fontFamily:serif,fontSize:20}}>Adaptive memory</div></div>
        <div style={{fontSize:12.5,color:T.sand,lineHeight:1.5,marginTop:5}}>Smart Coach recycles language you missed and prioritizes situations where your scores are lowest. Everything stays in browser storage.</div>

        <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>WEAK WORDS / PHRASES</div>
        {lp.weakWords.length?<div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:8}}>{lp.weakWords.map(([w,n])=><span key={w} style={{padding:'6px 9px',borderRadius:99,background:T.raised,border:`1px solid ${T.line}`,fontSize:12}}>{w} <span style={{color:T.rose}}>×{Math.ceil(n)}</span></span>)}</div>:<div style={{fontSize:13,color:T.sand,marginTop:7}}>Nothing recurring yet. Complete a few Smart Coach rounds.</div>}

        <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>GRAMMAR PATTERNS</div>
        {lp.topMistakes.length?lp.topMistakes.map(([m,n])=><div key={m} style={{fontSize:13,color:T.sand,marginTop:6}}>• {m} <span style={{color:T.marigold}}>×{n}</span></div>):<div style={{fontSize:13,color:T.sand,marginTop:7}}>No recurring grammar pattern detected yet.</div>}

        {(lp.weakWords.length>0||lp.topMistakes.length>0)&&<button onClick={()=>{if(confirm('Clear only Smart Coach adaptive memory? Confidence and missions will remain.'))lp.clearCoachMemory()}} style={{width:'100%',marginTop:15,padding:11,borderRadius:12,border:`1px solid ${T.line}`,background:'transparent',color:T.sand}}>Clear adaptive memory</button>}
      </div>

      <div style={{...card,padding:17,marginBottom:18}}>
        {Object.entries(lp.state.confidence).map(([k,v])=><div key={k} style={{marginBottom:13}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}><span>{CONFIDENCE_LABELS[k]}</span><span style={{fontFamily:mono,color:v>=70?T.jade:v>=40?T.marigold:T.rose}}>{v}%</span></div>
          <ProgressBar value={v} color={v>=70?T.jade:v>=40?T.marigold:T.rose}/>
        </div>)}
      </div>

      <div style={{...card,padding:17}}>
        <div style={{fontFamily:serif,fontSize:20}}>Daily reflection</div>
        <div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:5}}>What Spanish did you use today? Write one sentence.</div>
        <textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Hoy hablé con…" style={{width:'100%',boxSizing:'border-box',minHeight:82,marginTop:12,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:T.ground,color:T.cream}}/>
        <button onClick={()=>{lp.addReflection(reflection);setReflection('')}} disabled={!reflection.trim()} style={{width:'100%',padding:12,marginTop:8,borderRadius:12,border:0,background:reflection.trim()?T.marigold:T.surface,color:reflection.trim()?T.ground:T.sand,fontWeight:700}}>Save reflection</button>
        {lp.state.reflections.slice(0,3).map(r=><div key={r.at} style={{fontSize:13,color:T.sand,paddingTop:10,marginTop:10,borderTop:`1px solid ${T.line}`}}>{r.text}</div>)}
      </div>
    </div>
  </>;
}
function Study(){const phrases=[['¿Me regala un café, por favor?','Could I have a coffee, please?'],['¿Dónde queda la entrada?','Where is the entrance?'],['Aquí está bien, gracias.','Here is fine, thank you.'],['¿Cuál me recomienda?','Which do you recommend?'],['Fíjese que tengo un problema.','The thing is, I have a problem.'],['¿Cómo amaneció?','How are you this morning?'],['Todavía no, pero ya casi.','Not yet, but almost.'],['¿Me puede ayudar?','Can you help me?']];const [i,setI]=useState(0);const [show,setShow]=useState(false);const p=phrases[i%phrases.length];return <><Header title="Quick Review" sub="Everyday phrases"/><div style={{padding:'0 20px'}}><div onClick={()=>setShow(true)} style={{...card,padding:24,minHeight:250,display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{fontFamily:serif,fontSize:31,lineHeight:1.25}}>{p[0]}</div><button onClick={e=>{e.stopPropagation();say(p[0])}} style={{...btnIcon,marginTop:16}}><Volume2 size={19}/></button>{show&&<div style={{fontSize:17,color:T.sand,marginTop:22,paddingTop:17,borderTop:`1px solid ${T.line}`}}>{p[1]}</div>}</div><button onClick={()=>{setI(i+1);setShow(false)}} style={{width:'100%',padding:14,borderRadius:14,border:0,background:T.marigold,color:T.ground,fontWeight:750,marginTop:12}}>Next phrase</button></div></>}

export default function App(){const lp=useLivingProgress();const [tab,setTab]=useState('home');const [journeySelected,setJourneySelected]=useState(null);const nav=[['home','Home',Home],['journey','Journey',Map],['missions','Missions',Target],['coach','Smart Coach',MessageCircle],['progress','Progress',BarChart3]]; const go=(t,id)=>{setTab(t);if(t==='journey')setJourneySelected(id||null)}; let body=tab==='home'?<Dashboard lp={lp} onGo={go}/>:tab==='journey'?<Journey lp={lp} selected={journeySelected} setSelected={setJourneySelected}/>:tab==='missions'?<Missions lp={lp}/>:tab==='coach'?<SmartCoach lp={lp}/>:tab==='progress'?<Progress lp={lp}/>:<Study/>;
 return <Shell><style>{`*{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:active{transform:scale(.99)}button:focus-visible,textarea:focus-visible{outline:2px solid ${T.marigold};outline-offset:2px}`}</style>{body}<nav style={{position:'fixed',left:0,right:0,bottom:0,background:'rgba(14,43,42,.96)',backdropFilter:'blur(12px)',borderTop:`1px solid ${T.line}`,zIndex:10}}><div style={{maxWidth:520,margin:'0 auto',display:'flex'}}>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} style={{flex:1,padding:'12px 3px 18px',border:0,background:'transparent',color:tab===id?T.marigold:T.sand,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><Icon size={18}/><span style={{fontFamily:mono,fontSize:8.5,letterSpacing:'.05em'}}>{label.toUpperCase()}</span></button>)}</div></nav></Shell>}
