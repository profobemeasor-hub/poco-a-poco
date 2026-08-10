import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Home,Map,MessageCircle,Layers,BarChart3,ChevronRight,ChevronLeft,Volume2,Mic,Check,Flame,Target,Sparkles,Play,RotateCcw,Send,UserRound,BookOpen} from 'lucide-react';
import {CHAPTERS,CHARACTERS,MISSIONS,SCENARIOS,CONFIDENCE_LABELS} from './data/living';
import {useLivingProgress} from './hooks/useLivingProgress';

const T={ground:'#0E2B2A',surface:'#143836',raised:'#1B4543',line:'#27544F',cream:'#F2E9DC',sand:'#BFAE97',marigold:'#E9A33C',jade:'#57B79A',rose:'#DB6A6A',violet:'#9B7BB8'};
const serif='Georgia,"Iowan Old Style","Times New Roman",serif'; const mono='ui-monospace,SFMono-Regular,Menlo,Consolas,monospace';
const today=()=>new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'});
function say(text,rate=.88){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-GT';u.rate=rate;speechSynthesis.speak(u)}catch{}}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9ñ ]/g,' ')}
function scoreAnswer(text,keys=[]){if(!text.trim())return 0; const n=norm(text); let score=Math.min(45,Math.round(text.trim().split(/\s+/).length*4)); const hits=keys.filter(k=>n.includes(norm(k))).length; score+=keys.length?Math.round((hits/keys.length)*55):45; return Math.min(100,score)}

function Shell({children}){return <div style={{minHeight:'100vh',background:T.ground,color:T.cream,fontFamily:'system-ui,-apple-system,Segoe UI,sans-serif'}}><div style={{maxWidth:520,margin:'0 auto',paddingBottom:94}}>{children}</div></div>}
function Header({title,sub,onBack}){return <div style={{display:'flex',gap:12,alignItems:'center',padding:'24px 20px 16px'}}>{onBack&&<button onClick={onBack} style={btnIcon}><ChevronLeft size={20}/></button>}<div><div style={{fontFamily:serif,fontSize:25}}>{title}</div>{sub&&<div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.11em',marginTop:3}}>{sub.toUpperCase()}</div>}</div></div>}
const card={background:T.surface,border:`1px solid ${T.line}`,borderRadius:20}; const btnIcon={width:40,height:40,borderRadius:12,background:T.surface,border:`1px solid ${T.line}`,color:T.cream,display:'grid',placeItems:'center'};
function ProgressBar({value,color=T.jade}){return <div style={{height:7,borderRadius:99,background:'rgba(242,233,220,.09)',overflow:'hidden'}}><div style={{width:`${value}%`,height:'100%',background:color,borderRadius:99}}/></div>}

function Dashboard({lp,onGo}){const {state,weakest}=lp; const mission=MISSIONS.find(m=>!state.missionDone[m.id])||MISSIONS[state.day%MISSIONS.length]; const weakLabel=CONFIDENCE_LABELS[weakest?.[0]]||'Daily life'; return <>
 <div style={{padding:'30px 20px 18px'}}><div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.14em'}}>{today().toUpperCase()} · LIVE GUATEMALA</div><h1 style={{fontFamily:serif,fontWeight:400,fontSize:38,lineHeight:1.05,margin:'10px 0 8px'}}>Poco a poco<span style={{color:T.marigold}}>.</span></h1><div style={{color:T.sand,fontSize:14}}>Your Spanish should work outside the lesson.</div></div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,padding:'0 20px 14px'}}><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em'}}>XP</div><div style={{fontFamily:serif,fontSize:27,marginTop:4}}>{state.xp}</div></div><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em'}}>FOCUS NEXT</div><div style={{fontFamily:serif,fontSize:20,color:T.marigold,marginTop:7}}>{weakLabel}</div></div></div>
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

function Roleplay({lp}){const [id,setId]=useState(null);const [answer,setAnswer]=useState('');const [result,setResult]=useState(null);const [listening,setListening]=useState(false);const recognition=useRef(null);const s=SCENARIOS.find(x=>x.id===id);const character=s&&CHARACTERS.find(c=>c.id===s.character);
 const listen=()=>{const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){alert('Speech recognition is not available here. You can type your answer instead.');return} const r=new SR();r.lang='es-GT';r.interimResults=false;r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onresult=e=>setAnswer(e.results[0][0].transcript);r.start();recognition.current=r};
 if(!s)return <><Header title="Roleplay" sub="Speak before you need it"/><div style={{padding:'0 20px 28px'}}>{SCENARIOS.map(x=>{const ch=CHAPTERS.find(c=>c.id===x.chapter);const hist=lp.state.scenarioScores[x.id]||[];const last=hist.at(-1)?.score;return <button key={x.id} onClick={()=>{setId(x.id);setAnswer('');setResult(null)}} style={{...card,width:'100%',padding:16,marginBottom:9,color:T.cream,textAlign:'left',display:'flex',gap:12,alignItems:'center'}}><div style={{fontSize:27}}>{CHARACTERS.find(c=>c.id===x.character)?.avatar||ch?.icon}</div><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:18.5}}>{x.title}</div><div style={{fontSize:12.5,color:T.sand,marginTop:3}}>{x.en}</div></div>{last!=null?<div style={{fontFamily:mono,fontSize:12,color:last>=70?T.jade:T.marigold}}>{last}%</div>:<ChevronRight color={T.sand}/>}</button>})}</div></>;
 const submit=()=>{const score=scoreAnswer(answer,s.expected);setResult(score);lp.recordScenario(s.id,CHAPTERS.find(c=>c.id===s.chapter).confidence,score);say(s.model)};
 return <><Header title={s.title} sub={character?`${character.name} · ${character.role}`:'Everyday roleplay'} onBack={()=>setId(null)}/><div style={{padding:'0 20px 28px'}}><div style={{...card,padding:18,marginBottom:12}}><div style={{fontFamily:mono,fontSize:9,color:T.marigold,letterSpacing:'.12em'}}>THEY SAY</div><div style={{fontFamily:serif,fontSize:23,lineHeight:1.35,marginTop:10}}>{s.opener}</div><button onClick={()=>say(s.opener)} style={{...btnIcon,marginTop:12}}><Volume2 size={18}/></button></div><div style={{...card,padding:18,background:T.raised}}><div style={{fontFamily:mono,fontSize:9,color:T.jade,letterSpacing:'.12em'}}>YOUR TURN — ANSWER IN SPANISH</div><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Say it first, then type or use the microphone…" style={{width:'100%',boxSizing:'border-box',minHeight:100,marginTop:12,padding:13,borderRadius:13,border:`1px solid ${T.line}`,background:T.ground,color:T.cream,fontSize:16,resize:'vertical'}}/><div style={{display:'flex',gap:9,marginTop:10}}><button onClick={listen} style={{flex:1,padding:13,borderRadius:13,border:`1px solid ${listening?T.rose:T.line}`,background:'transparent',color:listening?T.rose:T.cream}}><Mic size={16} style={{verticalAlign:'middle',marginRight:6}}/>{listening?'Listening…':'Speak'}</button><button onClick={submit} disabled={!answer.trim()} style={{flex:1,padding:13,borderRadius:13,border:0,background:answer.trim()?T.jade:T.surface,color:answer.trim()?T.ground:T.sand,fontWeight:700}}><Send size={16} style={{verticalAlign:'middle',marginRight:6}}/>Check</button></div></div>{result!=null&&<div style={{...card,padding:18,marginTop:12,borderColor:result>=70?T.jade:T.marigold}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}><div style={{fontFamily:serif,fontSize:22}}>Communication score</div><div style={{fontFamily:serif,fontSize:34,color:result>=70?T.jade:T.marigold}}>{result}%</div></div><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>NATURAL MODEL</div><div style={{fontFamily:serif,fontSize:20,lineHeight:1.4,marginTop:7}}>{s.model}</div><div style={{marginTop:14}}>{s.tips.map(t=><div key={t} style={{fontSize:13.5,color:T.sand,lineHeight:1.5,marginTop:6}}>• {t}</div>)}</div><button onClick={()=>say(s.model,.82)} style={{...btnIcon,marginTop:14}}><Volume2 size={18}/></button></div>}</div></>}

function Progress({lp}){const [reflection,setReflection]=useState('');return <><Header title="Confidence" sub="Can you handle real life?"/><div style={{padding:'0 20px 28px'}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}}><div style={{...card,padding:15}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>XP</div><div style={{fontFamily:serif,fontSize:29,marginTop:4}}>{lp.state.xp}</div></div><div style={{...card,padding:15}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>MISSIONS DONE</div><div style={{fontFamily:serif,fontSize:29,marginTop:4}}>{Object.keys(lp.state.missionDone).length}</div></div></div><div style={{...card,padding:17,marginBottom:18}}>{Object.entries(lp.state.confidence).map(([k,v])=><div key={k} style={{marginBottom:13}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:6}}><span>{CONFIDENCE_LABELS[k]}</span><span style={{fontFamily:mono,color:v>=70?T.jade:v>=40?T.marigold:T.rose}}>{v}%</span></div><ProgressBar value={v} color={v>=70?T.jade:v>=40?T.marigold:T.rose}/></div>)}</div><div style={{...card,padding:17}}><div style={{fontFamily:serif,fontSize:20}}>Daily reflection</div><div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:5}}>What Spanish did you use today? Write one sentence. This keeps the app connected to your real life.</div><textarea value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Hoy hablé con…" style={{width:'100%',boxSizing:'border-box',minHeight:82,marginTop:12,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:T.ground,color:T.cream}}/><button onClick={()=>{lp.addReflection(reflection);setReflection('')}} disabled={!reflection.trim()} style={{width:'100%',padding:12,marginTop:8,borderRadius:12,border:0,background:reflection.trim()?T.marigold:T.surface,color:reflection.trim()?T.ground:T.sand,fontWeight:700}}>Save reflection</button>{lp.state.reflections.slice(0,3).map(r=><div key={r.at} style={{fontSize:13,color:T.sand,paddingTop:10,marginTop:10,borderTop:`1px solid ${T.line}`}}>{r.text}</div>)}</div></div></>}

function Study(){const phrases=[['¿Me regala un café, por favor?','Could I have a coffee, please?'],['¿Dónde queda la entrada?','Where is the entrance?'],['Aquí está bien, gracias.','Here is fine, thank you.'],['¿Cuál me recomienda?','Which do you recommend?'],['Fíjese que tengo un problema.','The thing is, I have a problem.'],['¿Cómo amaneció?','How are you this morning?'],['Todavía no, pero ya casi.','Not yet, but almost.'],['¿Me puede ayudar?','Can you help me?']];const [i,setI]=useState(0);const [show,setShow]=useState(false);const p=phrases[i%phrases.length];return <><Header title="Quick Review" sub="Everyday phrases"/><div style={{padding:'0 20px'}}><div onClick={()=>setShow(true)} style={{...card,padding:24,minHeight:250,display:'flex',flexDirection:'column',justifyContent:'center'}}><div style={{fontFamily:serif,fontSize:31,lineHeight:1.25}}>{p[0]}</div><button onClick={e=>{e.stopPropagation();say(p[0])}} style={{...btnIcon,marginTop:16}}><Volume2 size={19}/></button>{show&&<div style={{fontSize:17,color:T.sand,marginTop:22,paddingTop:17,borderTop:`1px solid ${T.line}`}}>{p[1]}</div>}</div><button onClick={()=>{setI(i+1);setShow(false)}} style={{width:'100%',padding:14,borderRadius:14,border:0,background:T.marigold,color:T.ground,fontWeight:750,marginTop:12}}>Next phrase</button></div></>}

export default function App(){const lp=useLivingProgress();const [tab,setTab]=useState('home');const [journeySelected,setJourneySelected]=useState(null);const nav=[['home','Home',Home],['journey','Journey',Map],['missions','Missions',Target],['roleplay','Roleplay',MessageCircle],['progress','Progress',BarChart3]]; const go=(t,id)=>{setTab(t);if(t==='journey')setJourneySelected(id||null)}; let body=tab==='home'?<Dashboard lp={lp} onGo={go}/>:tab==='journey'?<Journey lp={lp} selected={journeySelected} setSelected={setJourneySelected}/>:tab==='missions'?<Missions lp={lp}/>:tab==='roleplay'?<Roleplay lp={lp}/>:tab==='progress'?<Progress lp={lp}/>:<Study/>;
 return <Shell><style>{`*{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:active{transform:scale(.99)}button:focus-visible,textarea:focus-visible{outline:2px solid ${T.marigold};outline-offset:2px}`}</style>{body}<nav style={{position:'fixed',left:0,right:0,bottom:0,background:'rgba(14,43,42,.96)',backdropFilter:'blur(12px)',borderTop:`1px solid ${T.line}`,zIndex:10}}><div style={{maxWidth:520,margin:'0 auto',display:'flex'}}>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} style={{flex:1,padding:'12px 3px 18px',border:0,background:'transparent',color:tab===id?T.marigold:T.sand,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><Icon size={18}/><span style={{fontFamily:mono,fontSize:8.5,letterSpacing:'.05em'}}>{label.toUpperCase()}</span></button>)}</div></nav></Shell>}
