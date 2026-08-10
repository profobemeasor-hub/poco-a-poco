import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Home,Map,MessageCircle,Layers,BarChart3,ChevronRight,ChevronLeft,Volume2,Mic,Check,Flame,Target,Sparkles,Play,RotateCcw,Send,UserRound,BookOpen,Shuffle,Brain,AudioLines,Timer,Users,Drama,Wallet,CalendarDays,Trophy,MapPin} from 'lucide-react';
import {CHAPTERS,CHARACTERS,MISSIONS,SCENARIOS,CONFIDENCE_LABELS,PERSONAS,PERSONA_SCENES} from './data/living';
import {useLivingProgress} from './hooks/useLivingProgress';
import {useWorldState} from './hooks/useWorldState';
import {WORLD_LOCATIONS,WORLD_ACHIEVEMENTS,RELATIONSHIP_PEOPLE} from './data/world';

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

function clamp(n,min=0,max=100){return Math.max(min,Math.min(max,n))}
function tokens(s){return norm(s).split(/\s+/).filter(Boolean)}
function recognitionMatch(target,heard){
  const a=tokens(target), b=tokens(heard);
  if(!a.length||!b.length)return 0;
  const counts={};
  b.forEach(w=>counts[w]=(counts[w]||0)+1);
  let hits=0;
  a.forEach(w=>{if(counts[w]>0){hits++;counts[w]--}});
  const recall=hits/a.length;
  const precision=hits/b.length;
  const f1=(precision+recall)?2*precision*recall/(precision+recall):0;
  const orderHits=a.filter((w,i)=>b[i]===w).length/Math.max(a.length,b.length);
  return Math.round((f1*.78+orderHits*.22)*100);
}
function fluencyProxy(target,duration){
  const wc=Math.max(1,tokens(target).length);
  const ideal=Math.max(1.4,wc/2.15);
  const ratio=duration/ideal;
  if(ratio>=.72&&ratio<=1.65)return Math.round(96-Math.abs(1.08-ratio)*10);
  if(ratio<.72)return clamp(Math.round(78-(.72-ratio)*55));
  return clamp(Math.round(86-(ratio-1.65)*24));
}
const SPEAKING_DRILLS=[
  {id:'coffee',topic:'Coffee',level:'Easy',target:'Buenos días. ¿Me regala un café americano sin azúcar, por favor?',tip:'Keep “me regala” together and let the sentence flow.'},
  {id:'slow',topic:'Conversation',level:'Easy',target:'¿Puede hablar más despacio, por favor?',tip:'Stress des-PA-cio naturally.'},
  {id:'taxi',topic:'Taxi',level:'Easy',target:'Aquí está bien, muchas gracias. Que le vaya bien.',tip:'Say it as two smooth chunks.'},
  {id:'restaurant',topic:'Restaurant',level:'Medium',target:'¿Cuál me recomienda? Quisiera algo sin mucho picante.',tip:'Make “quisiera” light and connected.'},
  {id:'directions',topic:'Directions',level:'Medium',target:'Disculpe, ¿dónde queda la farmacia más cercana?',tip:'Keep the question rising naturally at the end.'},
  {id:'neighbour',topic:'Small talk',level:'Medium',target:'Buenos días, ¿cómo amaneció? ¿Todo tranquilo hoy?',tip:'Aim for a warm, relaxed rhythm.'},
  {id:'maintenance',topic:'Home',level:'Medium',target:'Fíjese que tengo un problema con el agua desde esta mañana.',tip:'Pause slightly after “fíjese que”.'},
  {id:'phone',topic:'Phone',level:'Medium',target:'Buenas tardes. Llamo para confirmar una cita para mañana.',tip:'Do not rush “confirmar una cita”.'},
  {id:'weekend',topic:'Social',level:'Medium',target:'El sábado fui a comer y después estuve en casa.',tip:'Keep fui and estuve clear.'},
  {id:'pharmacy',topic:'Health',level:'Hard',target:'¿Tiene algo para el dolor de cabeza que pueda tomar con comida?',tip:'Break it mentally after “dolor de cabeza”.'},
  {id:'bank',topic:'Bank',level:'Hard',target:'Mi tarjeta fue rechazada, pero tengo fondos disponibles en la cuenta.',tip:'Stay steady through “fondos disponibles”.'},
  {id:'story',topic:'Fluency',level:'Hard',target:'Estoy aprendiendo español poco a poco porque quiero sentirme más cómodo hablando todos los días.',tip:'Prioritize rhythm over perfection.'}
];

function Shell({children}){return <div style={{minHeight:'100vh',background:T.ground,color:T.cream,fontFamily:'system-ui,-apple-system,Segoe UI,sans-serif'}}><div style={{maxWidth:520,margin:'0 auto',paddingBottom:94}}>{children}</div></div>}
function Header({title,sub,onBack}){return <div style={{display:'flex',gap:12,alignItems:'center',padding:'24px 20px 16px'}}>{onBack&&<button onClick={onBack} style={btnIcon}><ChevronLeft size={20}/></button>}<div><div style={{fontFamily:serif,fontSize:25}}>{title}</div>{sub&&<div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.11em',marginTop:3}}>{sub.toUpperCase()}</div>}</div></div>}
const card={background:T.surface,border:`1px solid ${T.line}`,borderRadius:20}; const btnIcon={width:40,height:40,borderRadius:12,background:T.surface,border:`1px solid ${T.line}`,color:T.cream,display:'grid',placeItems:'center'};
function ProgressBar({value,color=T.jade}){return <div style={{height:7,borderRadius:99,background:'rgba(242,233,220,.09)',overflow:'hidden'}}><div style={{width:`${value}%`,height:'100%',background:color,borderRadius:99}}/></div>}

function Dashboard({lp,world,onGo}){
 const {state,weakest}=lp;const weakLabel=CONFIDENCE_LABELS[weakest?.[0]]||'Daily life';const mission=MISSIONS.find(m=>!state.missionDone[m.id])||MISSIONS[state.day%MISSIONS.length];
 return <>
  <div style={{padding:'28px 20px 14px'}}><div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.15em'}}>POCO A POCO · V11</div><div style={{fontFamily:serif,fontSize:37,lineHeight:1.08,marginTop:8}}>Buenos días<span style={{color:T.marigold}}>.</span></div><div style={{fontSize:13.5,color:T.sand,marginTop:7}}>{today()} · Day {world.state.day} in your Spanish world</div></div>
  <div style={{padding:'0 20px 10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>WALLET</div><div style={{fontFamily:serif,fontSize:27,marginTop:4}}>Q {world.state.wallet.toLocaleString()}</div></div><div style={{...card,padding:14}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>WORLD TASKS</div><div style={{fontFamily:serif,fontSize:27,marginTop:4}}>{world.stats.tasks}</div></div></div>
  <div style={{padding:'0 20px 10px'}}><button onClick={()=>onGo('world')} style={{...card,width:'100%',padding:18,color:T.cream,textAlign:'left',borderColor:T.marigold}}><div style={{display:'flex',gap:11,alignItems:'center'}}><div style={{fontSize:34}}>🗺️</div><div style={{flex:1}}><div style={{fontFamily:mono,fontSize:9,color:T.marigold}}>LIVING WORLD</div><div style={{fontFamily:serif,fontSize:22,marginTop:3}}>Continue your day in Guatemala</div></div><ChevronRight color={T.marigold}/></div><div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:9}}>{world.state.currentEvent?`${world.state.currentEvent.icon} ${world.state.currentEvent.title} is waiting for you.`:'Visit places, spend virtual quetzales and build relationships through Spanish.'}</div></button></div>
  <div style={{padding:'0 20px 10px'}}><div style={{...card,padding:17,borderColor:T.jade}}><div style={{fontFamily:mono,fontSize:9,color:T.jade}}>TODAY'S REAL-WORLD MISSION</div><div style={{fontFamily:serif,fontSize:21,marginTop:7}}>{mission.icon} {mission.title}</div><div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:6}}>{mission.prompt}</div><button onClick={()=>onGo('missions')} style={{width:'100%',padding:11,marginTop:11,borderRadius:12,border:0,background:T.jade,color:T.ground,fontWeight:750}}>Open mission</button></div></div>
  <div style={{padding:'0 20px 4px'}}><button onClick={()=>onGo('coach')} style={{...card,width:'100%',padding:15,color:T.cream,textAlign:'left',display:'flex',alignItems:'center',gap:12}}><Brain size={21} color={T.violet}/><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:19}}>Smart Coach</div><div style={{fontSize:12.5,color:T.sand,marginTop:2}}>Adaptive offline conversation · focus: {weakLabel}</div></div><ChevronRight color={T.sand}/></button></div>
  <div style={{padding:'0 20px 4px'}}><button onClick={()=>onGo('personas')} style={{...card,width:'100%',padding:15,color:T.cream,textAlign:'left',display:'flex',alignItems:'center',gap:12}}><Users size={21} color={T.violet}/><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:19}}>People</div><div style={{fontSize:12.5,color:T.sand,marginTop:2}}>Recurring characters and real-life scenes</div></div><ChevronRight color={T.sand}/></button></div>
  <div style={{padding:'0 20px 20px'}}><button onClick={()=>onGo('speaking')} style={{...card,width:'100%',padding:15,color:T.cream,textAlign:'left',display:'flex',alignItems:'center',gap:12}}><AudioLines size={21} color={T.jade}/><div style={{flex:1}}><div style={{fontFamily:serif,fontSize:19}}>Speaking Lab</div><div style={{fontSize:12.5,color:T.sand,marginTop:2}}>Shadowing · fluency · recognition match</div></div><ChevronRight color={T.sand}/></button></div>
 </>;
}

function LivingWorld({lp,world,onGo}){
 const [locationId,setLocationId]=useState(null);const [view,setView]=useState('map');const location=WORLD_LOCATIONS.find(x=>x.id===locationId);const event=world.state.currentEvent;
 const daily=[WORLD_LOCATIONS[(world.state.day+1)%WORLD_LOCATIONS.length],WORLD_LOCATIONS[(world.state.day+4)%WORLD_LOCATIONS.length],WORLD_LOCATIONS[(world.state.day+7)%WORLD_LOCATIONS.length]];
 if(location)return <><Header title={`${location.icon} ${location.name}`} sub={location.en} onBack={()=>setLocationId(null)}/><div style={{padding:'0 20px 28px'}}>
  <div style={{...card,padding:18,borderColor:location.accent}}><div style={{fontSize:13.5,color:T.sand,lineHeight:1.55}}>{location.description}</div><div style={{display:'flex',justifyContent:'space-between',marginTop:14,paddingTop:12,borderTop:`1px solid ${T.line}`}}><span style={{fontFamily:mono,fontSize:9,color:T.sand}}>VISITS</span><span style={{fontFamily:serif,fontSize:24}}>{world.state.visited[location.id]||0}</span></div></div>
  {location.tasks.some(t=>t.relation)&&<div style={{...card,padding:16,marginTop:10}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>PEOPLE HERE</div>{[...new Set(location.tasks.map(t=>t.relation).filter(Boolean))].map(id=>{const p=RELATIONSHIP_PEOPLE[id],rel=world.state.relationships[id]||0;return <div key={id} style={{marginTop:11}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13}}><span>{p.icon} {p.name} · <span style={{color:T.sand}}>{p.role}</span></span><span style={{fontFamily:mono,color:rel>=50?T.jade:T.marigold}}>{rel}%</span></div><ProgressBar value={rel} color={rel>=50?T.jade:T.marigold}/></div>})}</div>}
  <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',margin:'16px 0 8px'}}>DO SOMETHING HERE</div>
  {location.tasks.map(task=>{const key=`${location.id}:${task.id}`,done=world.state.completed[key]||0;return <div key={task.id} style={{...card,padding:16,marginBottom:9}}><div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontFamily:serif,fontSize:18}}>{task.title}</div>{done>0&&<span style={{fontFamily:mono,fontSize:10,color:T.jade}}>×{done}</span>}</div><div style={{fontFamily:serif,fontSize:16.5,color:T.marigold,lineHeight:1.4,marginTop:8}}>{task.spanish}</div><div style={{display:'flex',gap:8,marginTop:11}}><button onClick={()=>say(task.spanish,.84)} style={btnIcon}><Volume2 size={17}/></button><button onClick={()=>{world.visit(location);world.completeTask(location,task)}} style={{flex:1,padding:12,borderRadius:12,border:0,background:T.jade,color:T.ground,fontWeight:750}}><Check size={16} style={{verticalAlign:'middle',marginRight:6}}/>Complete interaction</button></div>{location.cost>0&&done===0&&<div style={{fontSize:11.5,color:T.sand,marginTop:8}}>First completion simulates spending Q{location.cost}.</div>}</div>})}
  <button onClick={()=>onGo('personas')} style={{width:'100%',padding:13,borderRadius:13,border:`1px solid ${T.violet}`,background:'transparent',color:T.violet,fontWeight:700}}>Practice with a person here →</button>
 </div></>;

 return <><Header title="Mi Vida en Guatemala" sub={`Day ${world.state.day} · Living World`}/><div style={{padding:'0 20px 28px'}}>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:10}}><div style={{...card,padding:14}}><div style={{display:'flex',gap:7,alignItems:'center',fontFamily:mono,fontSize:9,color:T.sand}}><Wallet size={15}/>WALLET</div><div style={{fontFamily:serif,fontSize:27,marginTop:5}}>Q {world.state.wallet.toLocaleString()}</div></div><div style={{...card,padding:14}}><div style={{display:'flex',gap:7,alignItems:'center',fontFamily:mono,fontSize:9,color:T.sand}}><MapPin size={15}/>PLACES</div><div style={{fontFamily:serif,fontSize:27,marginTop:5}}>{world.stats.places}/{WORLD_LOCATIONS.length}</div></div></div>
  {event&&<div style={{...card,padding:16,marginBottom:10,borderColor:T.rose}}><div style={{display:'flex',gap:9,alignItems:'center'}}><span style={{fontSize:30}}>{event.icon}</span><div><div style={{fontFamily:mono,fontSize:9,color:T.rose}}>TODAY'S SURPRISE</div><div style={{fontFamily:serif,fontSize:20,marginTop:3}}>{event.title}</div></div></div><div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:8}}>{event.text}</div><div style={{fontFamily:serif,fontSize:16.5,color:T.marigold,lineHeight:1.4,marginTop:9}}>{event.phrase}</div><div style={{display:'flex',gap:8,marginTop:10}}><button onClick={()=>say(event.phrase,.84)} style={btnIcon}><Volume2 size={17}/></button><button onClick={world.resolveEvent} style={{flex:1,padding:11,borderRadius:12,border:0,background:T.rose,color:T.ground,fontWeight:750}}>Handled it</button></div></div>}
  <div style={{...card,padding:16,marginBottom:10,borderColor:T.marigold}}><div style={{display:'flex',gap:8,alignItems:'center'}}><CalendarDays size={18} color={T.marigold}/><div style={{fontFamily:serif,fontSize:20}}>Today's plan</div></div>{daily.map((loc,i)=><button key={loc.id} onClick={()=>{world.visit(loc);setLocationId(loc.id)}} style={{width:'100%',marginTop:9,padding:'10px 11px',borderRadius:12,border:`1px solid ${T.line}`,background:T.raised,color:T.cream,textAlign:'left',display:'flex',gap:9,alignItems:'center'}}><span style={{fontSize:22}}>{loc.icon}</span><span style={{flex:1,fontSize:13.5}}>{i+1}. {loc.name}</span><ChevronRight size={16} color={T.sand}/></button>)}<button onClick={world.advanceDay} style={{width:'100%',padding:11,marginTop:11,borderRadius:12,border:0,background:T.marigold,color:T.ground,fontWeight:750}}>Finish day & start tomorrow</button></div>
  <div style={{display:'flex',gap:6,marginBottom:10}}>{[['map','MAP'],['people','RELATIONSHIPS'],['story','STORY']].map(([id,label])=><button key={id} onClick={()=>setView(id)} style={{flex:1,padding:9,borderRadius:11,border:`1px solid ${view===id?T.jade:T.line}`,background:view===id?T.raised:'transparent',color:view===id?T.jade:T.sand,fontFamily:mono,fontSize:9}}>{label}</button>)}</div>
  {view==='map'&&<div style={{...card,padding:12,position:'relative',height:390,overflow:'hidden',background:'linear-gradient(180deg,#173E3A,#11312F)'}}>{WORLD_LOCATIONS.map(loc=><button key={loc.id} onClick={()=>{world.visit(loc);setLocationId(loc.id)}} style={{position:'absolute',left:`${loc.x}%`,top:`${loc.y}%`,transform:'translate(-50%,-50%)',width:68,minHeight:58,borderRadius:16,border:`1px solid ${world.state.visited[loc.id]?loc.accent:T.line}`,background:T.surface,color:T.cream,padding:6,textAlign:'center'}}><div style={{fontSize:22}}>{loc.icon}</div><div style={{fontSize:9.5,marginTop:3,lineHeight:1.1}}>{loc.name}</div></button>)}</div>}
  {view==='people'&&<div style={{...card,padding:16}}>{Object.entries(RELATIONSHIP_PEOPLE).map(([id,p])=>{const rel=world.state.relationships[id]||0;return <div key={id} style={{marginBottom:13}}><div style={{display:'flex',justifyContent:'space-between',fontSize:13.5,marginBottom:5}}><span>{p.icon} {p.name} <span style={{color:T.sand}}>· {p.role}</span></span><span style={{fontFamily:mono,color:rel>=60?T.jade:T.marigold}}>{rel}%</span></div><ProgressBar value={rel} color={rel>=60?T.jade:T.marigold}/></div>})}</div>}
  {view==='story'&&<><div style={{...card,padding:16,marginBottom:10}}><div style={{display:'flex',gap:8,alignItems:'center'}}><Trophy size={18} color={T.marigold}/><div style={{fontFamily:serif,fontSize:20}}>Achievements</div></div>{WORLD_ACHIEVEMENTS.map(a=><div key={a.id} style={{display:'flex',gap:10,alignItems:'center',padding:'10px 0',borderTop:`1px solid ${T.line}`,opacity:world.state.achievements[a.id]?1:.45}}><span style={{fontSize:23}}>{a.icon}</span><div style={{flex:1}}><div style={{fontSize:13.5}}>{a.title}</div><div style={{fontSize:11.5,color:T.sand,marginTop:2}}>{a.rule}</div></div>{world.state.achievements[a.id]&&<Check size={17} color={T.jade}/>}</div>)}</div><div style={{...card,padding:16}}><div style={{fontFamily:serif,fontSize:20,marginBottom:6}}>Your story</div>{[...world.state.timeline].reverse().slice(0,12).map(x=><div key={x.id} style={{display:'flex',gap:10,padding:'9px 0',borderTop:`1px solid ${T.line}`}}><span style={{fontSize:19}}>{x.icon}</span><div><div style={{fontSize:13.5}}>{x.title}</div><div style={{fontSize:10.5,color:T.sand,marginTop:2}}>{new Date(x.at).toLocaleDateString()}</div></div></div>)}</div></>}
 </div></>;
}

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


function Personas({lp}){
  const [personaId,setPersonaId]=useState(null);
  const [sceneId,setSceneId]=useState(null);
  const [turn,setTurn]=useState(0);
  const [answer,setAnswer]=useState('');
  const [feedback,setFeedback]=useState(null);
  const [listening,setListening]=useState(false);

  const persona=PERSONAS.find(p=>p.id===personaId);
  const scene=PERSONA_SCENES.find(s=>s.id===sceneId);
  const related=persona?PERSONA_SCENES.filter(s=>s.persona===persona.id):[];

  const cannedTurns = {
    'maria-morning':[
      ['¡Buenos días! ¿Qué le preparo hoy?',['me regala','por favor'],'Buenos días. ¿Me regala un americano grande, sin azúcar, por favor?'],
      ['Claro. ¿Lo quiere caliente o frío?',['caliente'],'Caliente, por favor.'],
      ['Perfecto. ¿Y qué tal su mañana?',['bien','y usted'],'Bien, gracias. Todo tranquilo. ¿Y usted?']
    ],
    'jose-ride':[
      ['Buenas, ¿prefiere la ruta rápida o evitar el tráfico?',['prefiero','tráfico'],'Prefiero evitar el tráfico, por favor.'],
      ['¿Lleva mucho tiempo viviendo aquí?',['vivo','aquí'],'Sí, vivo aquí desde hace un tiempo.'],
      ['Ya casi llegamos. ¿Dónde lo dejo?',['aquí está bien'],'Aquí está bien, muchas gracias.']
    ],
    'sofia-weekend':[
      ['¡Hola! ¿Qué hiciste el fin de semana?',['fui','estuve'],'El sábado fui a comer y después estuve en casa.'],
      ['¿Y te gustó el lugar?',['sí','me gustó'],'Sí, me gustó mucho. La comida estuvo muy buena.'],
      ['¿Qué vas a hacer el próximo sábado?',['voy a'],'Voy a descansar y después voy a salir.']
    ],
    'miguel-delivery':[
      ['Jefe, tiene una entrega en la garita.',['para mí'],'Sí, la entrega es para mí.'],
      ['¿Quiere que lo deje pasar?',['puede subir'],'Sí, puede subir, por favor.'],
      ['Perfecto. ¿Algo más?',['eso es todo','gracias'],'Eso es todo, muchas gracias.']
    ],
    'ana-visit':[
      ['¿Qué síntomas tiene y desde cuándo?',['me duele','desde'],'Me duele la cabeza desde ayer.'],
      ['¿Tiene fiebre?',['no tengo','fiebre'],'No tengo fiebre, pero estoy cansado.'],
      ['¿Ha tomado algo?',['tomé'],'Sí, tomé acetaminofén esta mañana.']
    ],
    'diego-card':[
      ['¿Qué problema tiene con la tarjeta?',['tarjeta','rechazada'],'Mi tarjeta fue rechazada ayer.'],
      ['¿Fue una compra local?',['compra','local'],'Sí, fue una compra local.'],
      ['Parece un bloqueo. ¿Desea que lo quite?',['sí','desbloquear'],'Sí, por favor. Quisiera desbloquear la tarjeta.']
    ],
    'lucia-dinner':[
      ['Buenas noches. ¿Mesa para cuántos?',['para dos'],'Para dos, por favor.'],
      ['¿Ya saben qué van a pedir?',['recomienda'],'¿Cuál me recomienda?'],
      ['¿Algo más?',['cuenta','por favor'],'No, gracias. La cuenta, por favor.']
    ],
    'market-buy':[
      ['Buenas, ¿qué busca?',['busco'],'Busco aguacates. ¿A cómo están?'],
      ['Tres por diez. ¿Cuántos quiere?',['llevo'],'Si llevo seis, ¿me hace un descuento?'],
      ['Está bien, se los dejo más baratos.',['gracias'],'Perfecto, muchas gracias.']
    ],
    'laura-maintenance':[
      ['Me dijeron que hay un problema. ¿Qué pasó?',['problema','desde'],'Tengo un problema con el agua desde esta mañana.'],
      ['¿Es en todo el apartamento?',['todo','apartamento'],'Sí, no hay agua en todo el apartamento.'],
      ['Mantenimiento puede ir esta tarde. ¿Puede estar?',['puedo estar'],'Sí, puedo estar aquí esta tarde.']
    ],
    'officer-entry':[
      ['¿Cuál es el motivo de su visita?',['vengo','trabajo'],'Vengo por trabajo.'],
      ['¿Cuánto tiempo va a estar en Guatemala?',['voy a estar'],'Voy a estar varios meses.'],
      ['¿Dónde se va a hospedar?',['voy a vivir'],'Voy a vivir en la Ciudad de Guatemala.']
    ]
  };

  const turns=scene?cannedTurns[scene.id]||[]:[];
  const current=turns[turn];

  const speakInput=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){alert('Speech recognition is not available here. Type your answer instead.');return}
    const r=new SR(); r.lang='es-GT'; r.interimResults=false; r.continuous=false;
    r.onstart=()=>setListening(true); r.onend=()=>setListening(false); r.onerror=()=>setListening(false);
    r.onresult=e=>setAnswer(e.results[0][0].transcript);
    r.start();
  };

  if(!persona){
    return <>
      <Header title="Personas" sub="Same people · different speaking styles"/>
      <div style={{padding:'0 20px 28px'}}>
        <div style={{...card,padding:16,marginBottom:12,borderColor:T.violet}}>
          <div style={{display:'flex',gap:9,alignItems:'center'}}><Drama size={19} color={T.violet}/><div style={{fontFamily:serif,fontSize:20}}>Practice with people, not menus</div></div>
          <div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:6}}>Each persona has a different tone, speed and conversational purpose. Repeat scenes until the style feels familiar.</div>
        </div>
        {PERSONAS.map(p=><button key={p.id} onClick={()=>setPersonaId(p.id)} style={{...card,width:'100%',padding:16,marginBottom:9,color:T.cream,textAlign:'left',display:'flex',gap:12,alignItems:'center'}}>
          <div style={{fontSize:31}}>{p.avatar}</div>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'baseline',gap:7}}><div style={{fontFamily:serif,fontSize:19}}>{p.name}</div><div style={{fontFamily:mono,fontSize:9,color:p.difficulty==='Easy'?T.jade:p.difficulty==='Medium'?T.marigold:T.rose}}>{p.difficulty.toUpperCase()}</div></div>
            <div style={{fontSize:12.5,color:T.sand,marginTop:2}}>{p.role} · {p.style}</div>
          </div><ChevronRight color={T.sand}/>
        </button>)}
      </div>
    </>;
  }

  if(!scene){
    return <>
      <Header title={persona.name} sub={`${persona.role} · ${persona.style}`} onBack={()=>setPersonaId(null)}/>
      <div style={{padding:'0 20px 28px'}}>
        <div style={{...card,padding:18,borderColor:T.violet}}>
          <div style={{fontSize:48}}>{persona.avatar}</div>
          <div style={{fontFamily:serif,fontSize:24,marginTop:8}}>{persona.description}</div>
          <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>HOW THIS PERSON SPEAKS</div>
          {persona.habits.map(h=><div key={h} style={{fontSize:13.5,color:T.sand,marginTop:6}}>• {h}</div>)}
          <button onClick={()=>say(persona.opener,.88)} style={{width:'100%',padding:12,marginTop:14,borderRadius:12,border:`1px solid ${T.line}`,background:T.raised,color:T.cream}}><Volume2 size={17} style={{verticalAlign:'middle',marginRight:7}}/>Hear their opening line</button>
        </div>
        <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',margin:'16px 0 8px'}}>SCENES</div>
        {related.map(sc=><button key={sc.id} onClick={()=>{setSceneId(sc.id);setTurn(0);setAnswer('');setFeedback(null)}} style={{...card,width:'100%',padding:15,marginBottom:8,color:T.cream,textAlign:'left'}}>
          <div style={{fontFamily:serif,fontSize:18}}>{sc.title}</div>
          <div style={{fontSize:12.5,color:T.sand,marginTop:3}}>{sc.goal}</div>
        </button>)}
      </div>
    </>;
  }

  if(turn>=turns.length){
    return <>
      <Header title={persona.name} sub="Scene complete" onBack={()=>{setSceneId(null);setTurn(0)}}/>
      <div style={{padding:'0 20px 28px'}}>
        <div style={{...card,padding:22,textAlign:'center',borderColor:T.jade}}>
          <div style={{fontSize:49}}>{persona.avatar}</div>
          <div style={{fontFamily:serif,fontSize:25,marginTop:8}}>Conversation complete</div>
          <div style={{fontSize:13.5,color:T.sand,lineHeight:1.55,marginTop:8}}>Run it again later. Familiarity with the person and situation is the point.</div>
          <button onClick={()=>{setTurn(0);setAnswer('');setFeedback(null)}} style={{width:'100%',padding:13,borderRadius:13,border:0,background:T.jade,color:T.ground,fontWeight:750,marginTop:14}}>Repeat scene</button>
          <button onClick={()=>{setSceneId(null);setTurn(0)}} style={{width:'100%',padding:13,borderRadius:13,border:`1px solid ${T.line}`,background:'transparent',color:T.cream,marginTop:8}}>Back to {persona.name}</button>
        </div>
      </div>
    </>;
  }

  const submit=()=>{
    const [theirLine,keys,model]=current;
    const detail=scoreAnswer(answer,keys);
    setFeedback({...detail,model});
    lp.recordCoachTurn({scenarioId:`persona:${scene.id}`,area:'social',score:detail.score,missing:detail.missing,mistakes:detail.mistakes});
    say(model,.84);
  };

  return <>
    <Header title={scene.title} sub={`${persona.name} · turn ${turn+1} of ${turns.length}`} onBack={()=>{setSceneId(null);setTurn(0)}}/>
    <div style={{padding:'0 20px 28px'}}>
      <div style={{...card,padding:17,marginBottom:10}}>
        <div style={{display:'flex',gap:10,alignItems:'center'}}><div style={{fontSize:30}}>{persona.avatar}</div><div><div style={{fontFamily:mono,fontSize:9,color:T.violet}}>{persona.name.toUpperCase()}</div><div style={{fontFamily:serif,fontSize:21,marginTop:3}}>{current[0]}</div></div></div>
        <button onClick={()=>say(current[0],.88)} style={{...btnIcon,marginTop:12}}><Volume2 size={17}/></button>
      </div>

      <div style={{...card,padding:17,background:T.raised}}>
        <div style={{fontFamily:mono,fontSize:9,color:T.jade}}>YOUR TURN</div>
        <textarea value={answer} onChange={e=>setAnswer(e.target.value)} disabled={!!feedback} placeholder="Answer naturally in Spanish…" style={{width:'100%',boxSizing:'border-box',minHeight:90,marginTop:10,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:T.ground,color:T.cream,fontSize:16}}/>
        <div style={{display:'flex',gap:8,marginTop:9}}>
          <button onClick={speakInput} disabled={!!feedback} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:'transparent',color:listening?T.rose:T.cream}}><Mic size={16} style={{verticalAlign:'middle',marginRight:6}}/>{listening?'Listening…':'Speak'}</button>
          <button onClick={submit} disabled={!answer.trim()||!!feedback} style={{flex:1,padding:12,borderRadius:12,border:0,background:answer.trim()&&!feedback?T.jade:T.surface,color:answer.trim()&&!feedback?T.ground:T.sand,fontWeight:700}}>Check</button>
        </div>
      </div>

      {feedback&&<div style={{...card,padding:17,marginTop:10,borderColor:feedback.score>=70?T.jade:T.marigold}}>
        <div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontFamily:serif,fontSize:20}}>Communication</div><div style={{fontFamily:serif,fontSize:31,color:feedback.score>=70?T.jade:T.marigold}}>{feedback.score}%</div></div>
        <div style={{fontFamily:mono,fontSize:9,color:T.sand,marginTop:12}}>NATURAL MODEL</div>
        <div style={{fontFamily:serif,fontSize:19,lineHeight:1.4,marginTop:6}}>{feedback.model}</div>
        <button onClick={()=>{setTurn(t=>t+1);setAnswer('');setFeedback(null)}} style={{width:'100%',padding:12,marginTop:12,borderRadius:12,border:0,background:T.marigold,color:T.ground,fontWeight:750}}>Continue <ChevronRight size={16} style={{verticalAlign:'middle'}}/></button>
      </div>}
    </div>
  </>;
}


function SpeakingLab({lp}){
  const [idx,setIdx]=useState(0);
  const [heard,setHeard]=useState('');
  const [phase,setPhase]=useState('ready'); // ready | listening | result
  const [result,setResult]=useState(null);
  const [startedAt,setStartedAt]=useState(null);
  const [showTarget,setShowTarget]=useState(true);
  const recRef=useRef(null);
  const drill=SPEAKING_DRILLS[idx%SPEAKING_DRILLS.length];
  const history=lp.state.speaking?.byPhrase?.[drill.id]||[];
  const best=history.length?Math.max(...history.map(x=>x.overall)):null;

  const start=()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){
      alert('Speech recognition is not available in this browser. Try Safari on iPhone, or use Smart Coach with typing.');
      return;
    }
    const r=new SR();
    r.lang='es-GT';
    r.interimResults=true;
    r.continuous=false;
    setHeard('');
    setResult(null);
    setPhase('listening');
    const began=performance.now();
    setStartedAt(began);

    r.onresult=e=>{
      let finalText='';
      let interim='';
      for(let i=e.resultIndex;i<e.results.length;i++){
        const text=e.results[i][0].transcript;
        if(e.results[i].isFinal) finalText+=text+' ';
        else interim+=text+' ';
      }
      setHeard((finalText||interim).trim());
    };
    r.onerror=()=>setPhase('ready');
    r.onend=()=>{
      const seconds=Math.max(.5,(performance.now()-began)/1000);
      setPhase(current=>{
        setHeard(currentHeard=>{
          const transcript=currentHeard.trim();
          if(!transcript)return current;
          const match=recognitionMatch(drill.target,transcript);
          const fluency=fluencyProxy(drill.target,seconds);
          const overall=Math.round(match*.72+fluency*.28);
          const data={phraseId:drill.id,match,fluency,overall,duration:seconds,transcript};
          setResult(data);
          lp.recordSpeaking(data);
          return transcript;
        });
        return 'result';
      });
    };
    try{r.start();recRef.current=r}catch{setPhase('ready')}
  };

  const next=()=>{
    setIdx(i=>(i+1)%SPEAKING_DRILLS.length);
    setHeard('');
    setResult(null);
    setPhase('ready');
    setShowTarget(true);
  };
  const surprise=()=>{
    let n=Math.floor(Math.random()*SPEAKING_DRILLS.length);
    if(n===idx)n=(n+1)%SPEAKING_DRILLS.length;
    setIdx(n);setHeard('');setResult(null);setPhase('ready');setShowTarget(true);
  };

  return <>
    <Header title="Speaking Lab" sub="Shadowing · fluency · pronunciation proxy"/>
    <div style={{padding:'0 20px 28px'}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:12}}>
        <div style={{...card,padding:13}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>ATTEMPTS</div><div style={{fontFamily:serif,fontSize:25,marginTop:4}}>{history.length}</div></div>
        <div style={{...card,padding:13}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>BEST</div><div style={{fontFamily:serif,fontSize:25,color:best==null?T.sand:best>=80?T.jade:T.marigold,marginTop:4}}>{best==null?'—':`${best}%`}</div></div>
      </div>

      <div style={{...card,padding:18,borderColor:T.violet}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}>
          <div>
            <div style={{fontFamily:mono,fontSize:9,color:T.violet,letterSpacing:'.12em'}}>{drill.topic.toUpperCase()} · {drill.level.toUpperCase()}</div>
            <div style={{fontFamily:serif,fontSize:24,marginTop:7}}>Shadow this phrase</div>
          </div>
          <button onClick={surprise} style={btnIcon}><Shuffle size={18}/></button>
        </div>

        {showTarget?<div style={{fontFamily:serif,fontSize:22,lineHeight:1.42,marginTop:16}}>{drill.target}</div>:<div style={{height:64,display:'grid',placeItems:'center',color:T.sand,fontFamily:mono,fontSize:10,letterSpacing:'.1em'}}>TARGET HIDDEN — LISTEN AND REPEAT</div>}

        <div style={{display:'flex',gap:8,marginTop:14}}>
          <button onClick={()=>say(drill.target,.78)} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:T.raised,color:T.cream}}><Volume2 size={17} style={{verticalAlign:'middle',marginRight:7}}/>Hear slow</button>
          <button onClick={()=>say(drill.target,.93)} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:T.raised,color:T.cream}}><Play size={17} style={{verticalAlign:'middle',marginRight:7}}/>Natural</button>
        </div>
        <button onClick={()=>setShowTarget(v=>!v)} style={{width:'100%',marginTop:8,padding:10,borderRadius:12,border:`1px solid ${T.line}`,background:'transparent',color:T.sand}}>{showTarget?'Hide target for true shadowing':'Show target'}</button>
      </div>

      <div style={{...card,padding:18,marginTop:12,background:T.raised}}>
        <div style={{fontFamily:mono,fontSize:9,color:T.jade,letterSpacing:'.12em'}}>YOUR VOICE</div>
        <div style={{minHeight:62,fontSize:16,lineHeight:1.5,marginTop:10,color:heard?T.cream:T.sand}}>{heard||'Tap the microphone, then repeat the phrase naturally.'}</div>
        <button onClick={start} disabled={phase==='listening'} style={{width:'100%',marginTop:12,padding:14,borderRadius:14,border:0,background:phase==='listening'?T.rose:T.jade,color:T.ground,fontWeight:750}}>
          <Mic size={18} style={{verticalAlign:'middle',marginRight:7}}/>{phase==='listening'?'Listening…':'Start speaking'}
        </button>
      </div>

      {result&&<div style={{...card,padding:18,marginTop:12}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
          {[
            ['MATCH',result.match,T.violet],
            ['FLUENCY',result.fluency,T.marigold],
            ['OVERALL',result.overall,result.overall>=80?T.jade:T.marigold]
          ].map(([l,v,c])=><div key={l} style={{padding:11,borderRadius:14,background:T.raised,textAlign:'center'}}>
            <div style={{fontFamily:mono,fontSize:8,color:T.sand}}>{l}</div>
            <div style={{fontFamily:serif,fontSize:24,color:c,marginTop:4}}>{v}%</div>
          </div>)}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:7,color:T.sand,fontSize:12.5,marginTop:13}}>
          <Timer size={15}/>{result.duration.toFixed(1)} seconds
        </div>

        <div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em',marginTop:14}}>WHAT THE PHONE HEARD</div>
        <div style={{fontFamily:serif,fontSize:18,lineHeight:1.4,marginTop:6}}>{result.transcript}</div>

        <div style={{marginTop:14,paddingTop:13,borderTop:`1px solid ${T.line}`,fontSize:13.5,color:T.sand,lineHeight:1.55}}>
          <b style={{color:T.cream}}>Focus:</b> {result.match<78?'Repeat more clearly and keep every key word. ':''}{result.fluency<72?'Try a smoother rhythm with less hesitation. ':''}{result.match>=78&&result.fluency>=72?'Good control. Repeat once more and aim for an effortless rhythm. ':''}{drill.tip}
        </div>

        <div style={{fontSize:11.5,color:T.sand,lineHeight:1.45,marginTop:12,padding:10,borderRadius:11,background:'rgba(155,123,184,.08)',border:`1px solid ${T.violet}`}}>
          Pronunciation is a <b style={{color:T.cream}}>proxy</b>: it measures how closely browser speech recognition heard your words, not phoneme-level accent quality.
        </div>

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={start} style={{flex:1,padding:12,borderRadius:12,border:`1px solid ${T.line}`,background:'transparent',color:T.cream}}><RotateCcw size={16} style={{verticalAlign:'middle',marginRight:6}}/>Repeat</button>
          <button onClick={next} style={{flex:1,padding:12,borderRadius:12,border:0,background:T.marigold,color:T.ground,fontWeight:750}}>Next <ChevronRight size={16} style={{verticalAlign:'middle'}}/></button>
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


      <div style={{...card,padding:17,marginBottom:18,borderColor:T.jade}}>
        <div style={{display:'flex',gap:9,alignItems:'center'}}><AudioLines size={19} color={T.jade}/><div style={{fontFamily:serif,fontSize:20}}>Speaking trend</div></div>
        <div style={{fontSize:12.5,color:T.sand,lineHeight:1.5,marginTop:5}}>Local shadowing history from Speaking Lab.</div>
        {lp.state.speaking?.attempts?.length?
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:12}}>
            {[
              ['ATTEMPTS',lp.state.speaking.attempts.length],
              ['AVG',`${Math.round(lp.state.speaking.attempts.reduce((a,b)=>a+b.overall,0)/lp.state.speaking.attempts.length)}%`],
              ['MINUTES',(lp.state.speaking.totalSeconds/60).toFixed(1)]
            ].map(([l,v])=><div key={l} style={{padding:10,borderRadius:12,background:T.raised,textAlign:'center'}}><div style={{fontFamily:mono,fontSize:8,color:T.sand}}>{l}</div><div style={{fontFamily:serif,fontSize:21,marginTop:4}}>{v}</div></div>)}
          </div>:
          <div style={{fontSize:13,color:T.sand,marginTop:9}}>No speaking attempts yet. Open Speaking Lab and shadow your first phrase.</div>}
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

export default function App(){const lp=useLivingProgress();const world=useWorldState();const [tab,setTab]=useState('home');const [journeySelected,setJourneySelected]=useState(null);const nav=[['home','Home',Home],['world','World',Map],['coach','Coach',MessageCircle],['personas','People',Users],['speaking','Speak',AudioLines],['progress','Progress',BarChart3]]; const go=(t,id)=>{setTab(t);if(t==='journey')setJourneySelected(id||null)}; let body=tab==='home'?<Dashboard lp={lp} world={world} onGo={go}/>:tab==='world'?<LivingWorld lp={lp} world={world} onGo={go}/>:tab==='journey'?<Journey lp={lp} selected={journeySelected} setSelected={setJourneySelected}/>:tab==='missions'?<Missions lp={lp}/>:tab==='coach'?<SmartCoach lp={lp}/>:tab==='personas'?<Personas lp={lp}/>:tab==='speaking'?<SpeakingLab lp={lp}/>:tab==='progress'?<Progress lp={lp}/>:<Study/>;
 return <Shell><style>{`*{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:active{transform:scale(.99)}button:focus-visible,textarea:focus-visible{outline:2px solid ${T.marigold};outline-offset:2px}`}</style>{body}<nav style={{position:'fixed',left:0,right:0,bottom:0,background:'rgba(14,43,42,.96)',backdropFilter:'blur(12px)',borderTop:`1px solid ${T.line}`,zIndex:10}}><div style={{maxWidth:520,margin:'0 auto',display:'flex'}}>{nav.map(([id,label,Icon])=><button key={id} onClick={()=>go(id)} style={{flex:1,padding:'12px 3px 18px',border:0,background:'transparent',color:tab===id?T.marigold:T.sand,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}><Icon size={18}/><span style={{fontFamily:mono,fontSize:7.5,letterSpacing:'.03em'}}>{label.toUpperCase()}</span></button>)}</div></nav></Shell>}
