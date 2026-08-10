import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Volume2, ChevronLeft, Layers, Target, BarChart3, Flame, RotateCcw,
  Check, X, Sparkles, BookOpen, Mic, Shuffle, Headphones, Eye, Timer
} from 'lucide-react';

const T = {
  ground: '#0E2B2A', surface: '#143836', raised: '#1B4543', line: '#27544F',
  cream: '#F2E9DC', sand: '#BFAE97', marigold: '#E9A33C', jade: '#57B79A',
  rose: '#DB6A6A', violet: '#9B7BB8',
};
const BAND = [T.rose, T.marigold, T.jade, T.violet, T.cream];
const serif = 'Georgia, "Iowan Old Style", "Times New Roman", serif';
const sans = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const mono = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const DECKS = [
  {
    id: 'cortesia', group: 'base', name: 'Cortesía', en: 'Greetings & courtesy', accent: T.marigold,
    cards: [
      ['Buenos días', 'Good morning', 'Until about noon.'],
      ['Buenas tardes', 'Good afternoon', 'From noon until dark.'],
      ['Buenas noches', 'Good evening / Good night', 'Greeting and farewell both.'],
      ['¿Cómo está usted?', 'How are you?', 'Formal. Your default with strangers.'],
      ['Mucho gusto', 'Nice to meet you', 'Reply: el gusto es mío.'],
      ['Con permiso', 'Excuse me', 'Squeezing past, or leaving a room.'],
      ['Disculpe', 'Excuse me / Sorry', "To get someone's attention."],
      ['Por favor', 'Please', ''],
      ['Muchas gracias', 'Thank you very much', ''],
      ['Con mucho gusto', "You're welcome", 'A very common Guatemalan reply to gracias.'],
      ['No entiendo', "I don't understand", ''],
      ['¿Puede repetir, por favor?', 'Can you repeat that, please?', ''],
      ['Más despacio, por favor', 'Slower, please', 'One of your most useful early sentences.'],
      ['¿Cómo se dice…?', 'How do you say…?', ''],
      ['Hasta luego', 'See you later', ''],
      ['Que le vaya bien', 'Take care / All the best', 'Warm, formal farewell.'],
    ]
  },
  {
    id: 'frases', group: 'base', name: 'Frases clave', en: 'Sentence builders', accent: T.sand,
    cards: [
      ['Necesito…', 'I need…', ''], ['Me gustaría…', 'I would like…', ''],
      ['¿Podría…?', 'Could you…?', 'A polite request.'], ['Tengo que…', 'I have to…', ''],
      ['Voy a…', "I'm going to…", 'Useful future pattern.'], ['Acabo de…', "I've just…", ''],
      ['Hace falta', "It's needed / missing", ''], ['Ya está listo', "It's ready", ''],
      ['Todavía no', 'Not yet', ''], ['Está pendiente', "It's pending", ''],
      ['Estamos trabajando en eso', "We're working on it", ''], ['Déjeme ver', 'Let me check', ''],
      ['Ya le aviso', "I'll let you know", ''], ['Estoy de acuerdo', 'I agree', ''],
      ['No estoy seguro', "I'm not sure", ''], ['Depende', 'It depends', ''],
    ]
  },
  {
    id: 'diario', group: 'fuera', name: 'Día a día', en: 'Everyday Guatemala', accent: T.jade,
    cards: [
      ['el carro', 'the car', "Not 'coche' here."], ['la gasolinera', 'gas station', ''],
      ['Lleno, por favor', 'Fill it up, please', ''], ['¿Cuánto cuesta?', 'How much does it cost?', ''],
      ['¿Me da la factura?', 'Could I have the invoice?', 'Ask before paying.'], ['el NIT', 'tax ID number', ''],
      ['efectivo o tarjeta', 'cash or card', ''], ['el quetzal', 'the quetzal', 'Currency and bird.'],
      ['La cuenta, por favor', 'The check, please', ''], ['para llevar', 'to go / takeaway', ''],
      ['El tráfico está pesado', 'Traffic is heavy', ''], ['la garita', 'the guard booth / gate', ''],
      ['la zona', 'the zone', 'Guatemala City addresses run on zones.'], ['¡Qué chilero!', 'How cool!', 'Guatemalan slang.'],
      ['¿Me regala…?', 'Could I have…?', 'Very natural soft request in Guatemala.'], ['No le hace', "It doesn't matter", ''],
    ]
  },
  {
    id: 'calle', group: 'fuera', name: 'En la calle', en: 'Getting around, eating, buying', accent: T.marigold,
    cards: [
      ['¿Cuánto cobra hasta…?', 'How much do you charge to…?', 'Agree the fare before you get in.'],
      ['¿Me lleva a…?', 'Can you take me to…?', ''], ['Aquí está bien', 'Here is fine', 'Tell a driver to stop.'],
      ['¿Está lejos?', 'Is it far?', ''], ['Siga derecho', 'Go straight on', 'derecho = straight, derecha = right.'],
      ['a la derecha', 'to the right', ''], ['a la izquierda', 'to the left', ''],
      ['¿Dónde queda…?', 'Where is … located?', 'Natural for fixed places.'], ['¿A cómo?', 'How much each?', 'Market phrasing.'],
      ['¿Me hace un descuento?', 'Can you give me a discount?', ''], ['¿Cuál me recomienda?', 'Which do you recommend?', ''],
      ['Sin picante, por favor', 'No chilli, please', ''], ['¿Qué lleva este plato?', "What's in this dish?", ''],
      ['¿Aceptan tarjeta?', 'Do you take card?', ''], ['¿Dónde está el baño?', "Where's the bathroom?", ''],
      ['¿Hay wifi?', 'Is there wifi?', ''],
    ]
  },
  {
    id: 'gente', group: 'fuera', name: 'Con la gente', en: 'Small talk & warmth', accent: T.rose,
    cards: [
      ['¿Cómo amaneció?', 'How are you this morning?', 'Literally: how did you wake up?'],
      ['Bien, gracias a Dios', 'Well, thank God', 'A common reply.'], ['Aquí, luchando', 'Getting by', ''],
      ['¿De dónde es usted?', 'Where are you from?', ''], ['Trabajo en el puerto', 'I work at the port', ''],
      ['Estoy aprendiendo español', "I'm learning Spanish", 'Say this early; people often slow down.'],
      ['Disculpe mi español', 'Excuse my Spanish', ''], ['Poco a poco', 'Little by little', ''],
      ['¿Cómo se llama esto?', "What's this called?", ''], ['¿Cómo está la familia?', "How's the family?", ''],
      ['Fíjese que…', 'The thing is…', 'Very Guatemalan softener.'], ['Igualmente', 'Likewise', ''],
      ['Provecho', 'Enjoy your meal', 'Often said when passing someone eating.'],
    ]
  },
  {
    id: 'oficina', group: 'trabajo', name: 'Oficina', en: 'Office & meetings', accent: T.marigold,
    cards: [
      ['la reunión', 'the meeting', ''], ['agendar una reunión', 'to schedule a meeting', ''],
      ['el correo', 'the email', ''], ['adjuntar', 'to attach', 'Adjunto el archivo.'],
      ['el informe', 'the report', ''], ['la fecha límite', 'the deadline', ''],
      ['el presupuesto', 'the budget', ''], ['el proveedor', 'the supplier / vendor', ''],
      ['la propuesta', 'the proposal', ''], ['aprobar', 'to approve', ''],
      ['dar seguimiento', 'to follow up', 'Le doy seguimiento.'], ['los pendientes', 'the open items', ''],
      ['la orden de compra', 'the purchase order', ''], ['¿Quedamos así?', 'Are we agreed?', ''],
      ['Quedo pendiente', "I'll await your reply", 'Common email closing.'], ['la meta', 'the target', ''],
    ]
  },
  {
    id: 'ti', group: 'trabajo', name: 'TI', en: 'IT & systems', accent: T.violet,
    cards: [
      ['la computadora', 'the computer', ''], ['la red', 'the network', ''], ['el servidor', 'the server', ''],
      ['el respaldo', 'the backup', ''], ['respaldar', 'to back up', ''], ['la contraseña', 'the password', ''],
      ['el usuario', 'the user / username', ''], ['Se cayó el sistema', 'The system went down', ''],
      ['El correo no funciona', "Email isn't working", ''], ['el corte de energía', 'the power outage', ''],
      ['la planta eléctrica', 'the generator', ''], ['el cableado', 'the cabling', ''], ['el enlace', 'the link / circuit', ''],
      ['el ancho de banda', 'the bandwidth', ''], ['la actualización', 'the update', ''], ['reiniciar', 'to restart', ''],
      ['la incidencia', 'the incident / ticket', ''], ['el soporte técnico', 'technical support', ''],
      ['los permisos', 'the permissions', ''], ['la falla', 'the fault / failure', ''], ['probar', 'to test', ''],
    ]
  },
  {
    id: 'puerto', group: 'trabajo', name: 'Puerto', en: 'Port & logistics', accent: T.jade,
    cards: [
      ['el muelle', 'the dock / wharf', ''], ['el contenedor', 'the container', ''], ['la grúa', 'the crane', ''],
      ['el buque', 'the vessel', ''], ['la carga', 'the cargo', ''], ['descargar', 'to unload', 'Also: to download.'],
      ['cargar', 'to load', ''], ['el patio', 'the yard', ''], ['el camión', 'the truck', ''], ['la aduana', 'customs', ''],
      ['el manifiesto', 'the manifest', ''], ['el turno', 'the shift', ''], ['la báscula', 'the weighbridge', ''],
      ['el chasis', 'the chassis', ''], ['la naviera', 'the shipping line', ''], ['la bodega', 'the warehouse', ''],
      ['el precinto', 'the seal', ''], ['el peso bruto', 'the gross weight', ''], ['el atraque', 'the berthing', ''],
      ['la faena', 'the vessel operation', ''], ['el estibador', 'the stevedore', ''],
    ]
  },
  {
    id: 'seguridad', group: 'trabajo', name: 'Seguridad', en: 'Safety on site', accent: T.rose,
    cards: [
      ['¡Cuidado!', 'Careful! / Watch out!', ''], ['el casco', 'the helmet', ''], ['el chaleco', 'the vest', ''],
      ['las botas', 'the boots', ''], ['la salida de emergencia', 'the emergency exit', ''], ['el simulacro', 'the drill', ''],
      ['el riesgo', 'the risk', ''], ['reportar', 'to report', ''], ['el accidente', 'the accident', ''],
      ['Prohibido el paso', 'No entry', ''], ['el punto de reunión', 'the assembly point', ''],
      ['Detenga la operación', 'Stop the operation', ''], ['Área restringida', 'Restricted area', ''],
    ]
  }
];

const GROUPS = [
  { id: 'base', label: 'LA BASE', note: 'Say these without thinking' },
  { id: 'fuera', label: 'FUERA DE LA OFICINA', note: 'Street, market, taxi, neighbours' },
  { id: 'trabajo', label: 'EN EL TRABAJO', note: 'Terminal, office, systems' },
];

const ALL_CARDS = DECKS.flatMap(d => d.cards.map((c, i) => ({
  id: `${d.id}-${i}`, deck: d.id, deckName: d.name, accent: d.accent,
  es: c[0], en: c[1], note: c[2] || ''
})));
const CARD_BY_ID = Object.fromEntries(ALL_CARDS.map(c => [c.id, c]));

const LESSONS = [
  { id:'orden', n:'01', title:'El orden de las palabras', en:'Word order', rule:'Spanish is generally subject–verb–object like English, but the subject is often dropped because the verb ending already tells you who.', pattern:'(subject) + VERB + object + when/where', ex:[['Necesito el informe hoy.','I need the report today.'],['El contenedor rojo está en el patio.','The red container is in the yard.'],['Mandé el correo ayer.','I sent the email yesterday.']], watch:"There is no English-style 'do/does' helper for normal questions." },
  { id:'serestar', n:'02', title:'Ser y estar', en:"The two 'to be' verbs", rule:'Ser describes identity or what something is. Estar describes state, condition, mood and location.', pattern:'SER = identity/origin/profession · ESTAR = state/mood/location', ex:[['Soy el jefe de TI.','I am the head of IT.'],['Estoy en el muelle.','I am at the dock.'],['El sistema está lento hoy.','The system is slow today.']], watch:'Events normally use ser for location: La reunión es en la sala.' },
  { id:'presente', n:'03', title:'El presente', en:'Present tense', rule:'For many verbs, remove -ar, -er or -ir and add the matching ending.', pattern:'hablar → hablo/habla · comer → como/come · vivir → vivo/vive', ex:[['Trabajo en la terminal.','I work at the terminal.'],['¿Usted habla inglés?','Do you speak English?'],['Necesitamos más tiempo.','We need more time.']], watch:'The usted form is the same as he/she.' },
  { id:'futuro', n:'04', title:'Hablar del futuro', en:'Talking about the future', rule:"Use ir a + infinitive for most everyday future plans. It is natural and easy.", pattern:'voy / va / vamos / van + a + INFINITIVE', ex:[['Voy a revisar el enlace.','I am going to check the link.'],['Vamos a empezar a las ocho.','We are going to start at eight.'],['¿Va a venir mañana?','Are you coming tomorrow?']], watch:'For fixed near-future plans Spanish often uses the present too.' },
  { id:'pasado', n:'05', title:'Hablar del pasado', en:'Talking about the past', rule:'Use the preterite for completed actions.', pattern:'-ar → hablé/habló · -er/-ir → comí/comió', ex:[['Llegué tarde por el tráfico.','I arrived late because of traffic.'],['El buque atracó anoche.','The vessel berthed last night.'],['Acabo de hablar con el proveedor.','I have just spoken to the supplier.']], watch:'High-value irregulars: fui, tuve, hice.' },
  { id:'cortesia', n:'06', title:'Pedir con cortesía', en:'Asking politely', rule:'Use usted by default and turn requests into questions.', pattern:'¿Me + verb…? · ¿Podría + infinitive? · ¿Me regala…?', ex:[['¿Podría revisarlo hoy?','Could you check it today?'],['¿Me regala un vaso de agua?','Could I have a glass of water?'],['Mándeme el archivo cuando pueda.','Send me the file when you can.']], watch:'Bare commands can sound hard; a question softens them immediately.' },
  { id:'muletillas', n:'07', title:'Muletillas', en:'Buying yourself time', rule:'Native speakers pause too. Pausing in Spanish helps you stay in Spanish.', pattern:'este… · o sea… · fíjese que… · la verdad… · pues…', ex:[['Este… déjeme ver.','Um… let me check.'],['Fíjese que no me llegó el correo.','The thing is, the email did not reach me.'],['La verdad, no estoy seguro.','Honestly, I am not sure.']], watch:"Replace English 'uhh' with 'este…' during practice." },
];

const SENTENCES = [
  { en:'I need help.', es:['Necesito','ayuda'] },
  { en:'Where is the bathroom?', es:['¿Dónde','está','el','baño?'] },
  { en:"The system isn't working today.", es:['El','sistema','no','funciona','hoy'] },
  { en:'Can you take me to the port?', es:['¿Me','lleva','al','puerto?'] },
  { en:"I'm going to call you tomorrow.", es:['Lo','voy','a','llamar','mañana'] },
  { en:'We need to finish before Friday.', es:['Necesitamos','terminar','antes','del','viernes'] },
  { en:'Could you repeat that more slowly?', es:['¿Podría','repetirlo','más','despacio?'] },
  { en:"I've just arrived at the office.", es:['Acabo','de','llegar','a','la','oficina'] },
  { en:"I'm learning Spanish little by little.", es:['Estoy','aprendiendo','español','poco','a','poco'] },
  { en:'The truck arrives at eight in the morning.', es:['El','camión','llega','a','las','ocho','de','la','mañana'] },
  { en:'Send me the report when you can.', es:['Mándeme','el','informe','cuando','pueda'] },
  { en:'I arrived late because there was a lot of traffic.', es:['Llegué','tarde','porque','había','mucho','tráfico'] },
];

const SAY_IT = [
  ['Ask how much it costs to get to the port.','¿Cuánto cobra hasta el puerto?'],
  ["Tell someone you're learning Spanish.",'Estoy aprendiendo español.'],
  ['Ask them to speak more slowly.','¿Puede hablar más despacio?'],
  ['Say the system went down at six.','Se cayó el sistema a las seis.'],
  ['Ask where the nearest pharmacy is.','¿Dónde queda la farmacia más cercana?'],
  ["Say you'll follow up and let them know.",'Le doy seguimiento y le aviso.'],
  ['Ask for the bill.','La cuenta, por favor.'],
  ["Say you're going to check it today.",'Lo voy a revisar hoy.'],
  ['Ask if they take card.','¿Aceptan tarjeta?'],
  ['Say the truck has not arrived yet.','Todavía no ha llegado el camión.'],
  ['Ask what this is called.','¿Cómo se llama esto?'],
  ['Say it is high priority.','Es prioridad alta.'],
];

const CONVOS = [
  { id:'taxi', title:'En el taxi', en:'Agreeing a fare', accent:T.marigold, turns:[
    ['them','Buenas tardes, ¿para dónde va?','Good afternoon, where to?'],
    ['you','Buenas, ¿me lleva al puerto, por favor?','Hello, can you take me to the port, please?'],
    ['them','Claro. Son ochenta quetzales.','Sure. That is eighty quetzales.'],
    ['you','¿No me hace un descuento?','Can you give me a discount?'],
    ['them','Está bien, setenta.','Alright, seventy.'],
    ['you','Perfecto. ¿Cuánto nos tardamos?','Perfect. How long will it take us?']
  ]},
  { id:'equipo', title:'Con el equipo', en:'A fault on the shift', accent:T.jade, turns:[
    ['them','Jefe, se cayó el enlace de la garita.','Boss, the gate link went down.'],
    ['you','¿Desde cuándo? ¿Ya revisaron el switch?','Since when? Have you checked the switch?'],
    ['them','Desde las seis. El switch está bien.','Since six. The switch is fine.'],
    ['you','Entonces levanten ticket con el proveedor.','Then raise a ticket with the supplier.'],
    ['them','¿Le pongo prioridad alta?','Shall I set it to high priority?'],
    ['you','Sí, es crítico. Necesito una actualización cada hora.','Yes, it is critical. I need an update every hour.']
  ]},
  { id:'comedor', title:'En el comedor', en:'Ordering a meal', accent:T.rose, turns:[
    ['them','Buenas, ¿mesa para cuántos?','Hi, table for how many?'],
    ['you','Para dos, por favor.','For two, please.'],
    ['them','¿Les traigo algo de tomar?','Can I bring you something to drink?'],
    ['you','Dos aguas puras. ¿Qué me recomienda?','Two waters. What do you recommend?'],
    ['them','El pepián está muy bueno hoy.','The pepián is very good today.'],
    ['you','Entonces tráigame uno, sin mucho picante.','Then bring me one, not too spicy.']
  ]}
];

const STORE_KEY = 'espanol:progress:v3';
const INTERVALS = [0,1,3,7,21];
const DAY = 86400000;
const todayStr = () => new Date().toISOString().slice(0,10);
const shuffle = a => { const r=[...a]; for(let i=r.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [r[i],r[j]]=[r[j],r[i]]; } return r; };

function useSpeech(){
  const voiceRef=useRef(null);
  useEffect(()=>{
    if(typeof window==='undefined'||!window.speechSynthesis) return;
    const pick=()=>{
      const vs=window.speechSynthesis.getVoices()||[];
      for(const tag of ['es-GT','es-419','es-MX','es-US','es-CO','es-ES','es']){
        const f=vs.find(v=>(v.lang||'').toLowerCase().startsWith(tag.toLowerCase()));
        if(f){ voiceRef.current=f; return; }
      }
    };
    pick(); window.speechSynthesis.addEventListener?.('voiceschanged',pick);
    return()=>window.speechSynthesis.removeEventListener?.('voiceschanged',pick);
  },[]);
  return useCallback((text,rate=.85)=>{
    if(typeof window==='undefined'||!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); if(voiceRef.current)u.voice=voiceRef.current;
    u.lang=voiceRef.current?.lang||'es-GT'; u.rate=rate; window.speechSynthesis.speak(u);
  },[]);
}


function normalizeSpeech(text){
  return (text||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[¿?¡!.,;:]/g,'').replace(/\s+/g,' ').trim();
}

function speechScore(expected, actual){
  const e=normalizeSpeech(expected).split(' ').filter(Boolean);
  const a=normalizeSpeech(actual).split(' ').filter(Boolean);
  if(!e.length||!a.length) return 0;
  const dp=Array.from({length:e.length+1},()=>Array(a.length+1).fill(0));
  for(let i=0;i<=e.length;i++) dp[i][0]=i;
  for(let j=0;j<=a.length;j++) dp[0][j]=j;
  for(let i=1;i<=e.length;i++) for(let j=1;j<=a.length;j++){
    const cost=e[i-1]===a[j-1]?0:1;
    dp[i][j]=Math.min(dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+cost);
  }
  return Math.max(0,Math.round((1-dp[e.length][a.length]/Math.max(e.length,a.length))*100));
}

function useSpeechRecognition(){
  const [supported,setSupported]=useState(true);
  const [listening,setListening]=useState(false);
  const recognitionRef=useRef(null);
  useEffect(()=>{
    if(typeof window==='undefined') return;
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ setSupported(false); return; }
    const r=new SR(); r.lang='es-GT'; r.interimResults=false; r.continuous=false; r.maxAlternatives=3;
    recognitionRef.current=r;
    return()=>{ try{r.abort()}catch{} };
  },[]);
  const listen=useCallback(()=>new Promise((resolve,reject)=>{
    const r=recognitionRef.current;
    if(!r){ reject(new Error('Speech recognition is not supported in this browser.')); return; }
    r.onstart=()=>setListening(true);
    r.onend=()=>setListening(false);
    r.onerror=e=>{ setListening(false); reject(new Error(e.error||'Could not hear you.')); };
    r.onresult=e=>{
      const result=e.results?.[0];
      const choices=result?Array.from(result).map(x=>x.transcript):[];
      resolve(choices[0]||'');
    };
    try{ r.start(); }catch(e){ setListening(false); reject(e); }
  }),[]);
  return {supported,listening,listen};
}

function useProgress(){
  const empty={cards:{},streak:0,lastDay:null,spoken:0,built:0};
  const [state,setState]=useState(empty); const [loaded,setLoaded]=useState(false); const ref=useRef(state); ref.current=state;
  useEffect(()=>{
    let next={...empty};
    try{ const raw=localStorage.getItem(STORE_KEY); if(raw) next={...next,...JSON.parse(raw)}; }catch{}
    const t=todayStr();
    if(next.lastDay&&next.lastDay!==t){ const y=new Date(Date.now()-DAY).toISOString().slice(0,10); if(next.lastDay!==y)next.streak=0; }
    setState(next); setLoaded(true);
  },[]);
  const persist=useCallback(next=>{ setState(next); try{ localStorage.setItem(STORE_KEY,JSON.stringify(next)); }catch{} },[]);
  const grade=useCallback((cardId,correct,kind)=>{
    const s=ref.current; const prev=s.cards[cardId]||{box:0,seen:0,right:0};
    const box=correct?Math.min(prev.box+1,5):1; const t=todayStr(); const y=new Date(Date.now()-DAY).toISOString().slice(0,10);
    let streak=s.streak; if(s.lastDay!==t) streak=s.lastDay===y?s.streak+1:1;
    persist({...s,cards:{...s.cards,[cardId]:{box,due:Date.now()+INTERVALS[Math.max(box-1,0)]*DAY,seen:prev.seen+1,right:prev.right+(correct?1:0)}},streak,lastDay:t,spoken:s.spoken+(kind==='speak'?1:0),built:s.built+(kind==='build'?1:0)});
  },[persist]);
  const reset=useCallback(()=>persist({...empty}),[persist]);
  return{state,grade,reset,loaded};
}

function Speak({text,say,size=20}){ return <button onClick={e=>{e.stopPropagation();say(text);}} aria-label="Play pronunciation" className="flex items-center justify-center" style={{width:size+20,height:size+20,borderRadius:99,background:'rgba(242,233,220,.08)',border:`1px solid ${T.line}`,color:T.cream,flexShrink:0}}><Volume2 size={size}/></button>; }
function Header({title,sub,onBack}){ return <div className="flex items-center gap-3 px-5 pt-6 pb-4">{onBack&&<button onClick={onBack} className="flex items-center justify-center" style={{width:38,height:38,borderRadius:12,background:T.surface,border:`1px solid ${T.line}`,color:T.cream}}><ChevronLeft size={20}/></button>}<div className="min-w-0"><div className="truncate" style={{fontFamily:serif,fontSize:22,color:T.cream}}>{title}</div>{sub&&<div style={{fontFamily:mono,fontSize:11,color:T.sand,letterSpacing:'.08em'}}>{sub.toUpperCase()}</div>}</div></div>; }
function Segmented({value,onChange,options}){ return <div className="mx-5 mb-5 flex" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:14,padding:3,gap:3}}>{options.map(([id,label])=><button key={id} onClick={()=>onChange(id)} className="flex-1 py-2" style={{borderRadius:11,border:'none',background:value===id?T.raised:'transparent',color:value===id?T.cream:T.sand,fontFamily:mono,fontSize:10.5}}>{label.toUpperCase()}</button>)}</div>; }
function Empty({title,body,action,onAction}){ return <div className="px-6 py-14 text-center"><Sparkles size={26} color={T.marigold} style={{margin:'0 auto 14px'}}/><div style={{fontFamily:serif,fontSize:20,color:T.cream,marginBottom:8}}>{title}</div><div style={{fontFamily:sans,fontSize:14,color:T.sand,lineHeight:1.6}}>{body}</div>{action&&<button onClick={onAction} className="mt-6 px-5 py-3" style={{fontSize:14,fontWeight:600,borderRadius:14,background:T.marigold,color:T.ground,border:'none'}}>{action}</button>}</div>; }

function Home({progress,onOpen,onReview,dueCount}){
  const mastered=Object.keys(progress.cards).filter(id=>CARD_BY_ID[id]&&progress.cards[id].box>=4).length;
  return <div className="pb-6"><div className="px-5 pt-8 pb-6"><div style={{fontFamily:mono,fontSize:11,letterSpacing:'.16em',color:T.sand,marginBottom:10}}>ESPAÑOL — GUATEMALA</div><div style={{fontFamily:serif,fontSize:38,lineHeight:1.05,color:T.cream}}>Poco a poco<span style={{color:T.marigold}}>.</span></div><div style={{fontSize:14,color:T.sand,marginTop:10}}>{mastered} of {ALL_CARDS.length} words are sticking.</div></div>
  <div className="px-5 grid grid-cols-2 gap-3"><div className="p-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}><div className="flex items-center gap-2" style={{color:T.marigold}}><Flame size={16}/><span style={{fontFamily:mono,fontSize:10,color:T.sand}}>STREAK</span></div><div style={{fontFamily:serif,fontSize:30,color:T.cream,marginTop:6}}>{progress.streak}<span style={{fontSize:14,color:T.sand}}> días</span></div></div><button onClick={onReview} disabled={!dueCount} className="p-4 text-left" style={{background:dueCount?T.marigold:T.surface,border:`1px solid ${dueCount?T.marigold:T.line}`,borderRadius:18,opacity:dueCount?1:.55}}><div style={{fontFamily:mono,fontSize:10,color:dueCount?'rgba(14,43,42,.7)':T.sand}}>DUE NOW</div><div style={{fontFamily:serif,fontSize:30,color:dueCount?T.ground:T.cream,marginTop:6}}>{dueCount}<span style={{fontSize:14}}> words</span></div></button></div>
  {GROUPS.map(g=><div key={g.id}><div className="px-5 mt-8 mb-3"><div style={{fontFamily:mono,fontSize:11,letterSpacing:'.14em',color:T.marigold}}>{g.label}</div><div style={{fontSize:12.5,color:T.sand,marginTop:3}}>{g.note}</div></div><div className="px-5 flex flex-col gap-3">{DECKS.filter(d=>d.group===g.id).map(d=>{const cards=ALL_CARDS.filter(c=>c.deck===d.id),known=cards.filter(c=>(progress.cards[c.id]?.box||0)>=4).length,pct=Math.round(known/cards.length*100);return <button key={d.id} onClick={()=>onOpen(d.id)} className="w-full text-left p-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}><div className="flex items-baseline justify-between"><div><div style={{fontFamily:serif,fontSize:19,color:T.cream}}>{d.name}</div><div style={{fontSize:13,color:T.sand,marginTop:2}}>{d.en}</div></div><div style={{fontFamily:mono,fontSize:12,color:d.accent}}>{pct}%</div></div><div className="mt-3 flex items-center gap-3"><div className="flex-1 overflow-hidden" style={{height:4,borderRadius:99,background:'rgba(242,233,220,.1)'}}><div style={{width:`${pct}%`,height:'100%',background:d.accent}}/></div><div style={{fontFamily:mono,fontSize:11,color:T.sand}}>{known}/{cards.length}</div></div></button>})}</div></div>)}</div>;
}

function Study({queue,progress,grade,say,onBack,title}){
  const [i,setI]=useState(0),[flipped,setFlipped]=useState(false),[done,setDone]=useState(0); useEffect(()=>{setI(0);setFlipped(false);setDone(0)},[title]); const card=queue[i];
  const advance=ok=>{grade(card.id,ok);setDone(d=>d+1);setFlipped(false);setTimeout(()=>setI(n=>n+1),100)};
  if(!queue.length)return <><Header title={title} onBack={onBack}/><Empty title="Nothing waiting here" body="Every card in this deck is scheduled for later." action="Back to decks" onAction={onBack}/></>;
  if(!card)return <><Header title={title} onBack={onBack}/><Empty title="Ronda completa" body={`You worked through ${done} cards.`} action="Back to decks" onAction={onBack}/></>;
  const box=progress.cards[card.id]?.box||0;
  return <><Header title={title} sub={`${i+1} of ${queue.length}`} onBack={onBack}/><div className="px-5"><div onClick={()=>{if(!flipped){setFlipped(true);say(card.es)}}} className="w-full p-6 flex flex-col" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:24,minHeight:310,cursor:'pointer'}}><div className="flex gap-1 mb-6">{BAND.map((c,j)=><div key={c} className="flex-1" style={{height:7,borderRadius:99,background:j<box?c:'rgba(242,233,220,.1)'}}/>)}</div><div className="flex-1 flex flex-col justify-center"><div style={{fontFamily:serif,fontSize:card.es.length>22?27:35,lineHeight:1.15,color:T.cream}}>{card.es}</div><div className="mt-4"><Speak text={card.es} say={say}/></div>{flipped?<div className="mt-6 pt-5" style={{borderTop:`1px solid ${T.line}`}}><div style={{fontSize:19,color:T.cream}}>{card.en}</div>{card.note&&<div style={{fontSize:13,color:T.sand,marginTop:8,lineHeight:1.55}}>{card.note}</div>}</div>:<div className="mt-6 pt-5" style={{borderTop:`1px solid ${T.line}`,fontFamily:mono,fontSize:11,color:T.sand}}>TAP TO REVEAL</div>}</div></div>{flipped&&<div className="grid grid-cols-2 gap-3 mt-4"><button onClick={()=>advance(false)} className="py-4 flex items-center justify-center gap-2" style={{borderRadius:16,background:'transparent',border:`1px solid ${T.rose}`,color:T.rose}}><RotateCcw size={16}/>Show again</button><button onClick={()=>advance(true)} className="py-4 flex items-center justify-center gap-2" style={{borderRadius:16,background:T.jade,border:'none',color:T.ground,fontWeight:700}}><Check size={16}/>I knew it</button></div>}</div></>;
}

function Lessons({say}){ const [open,setOpen]=useState(null); const l=LESSONS.find(x=>x.id===open); if(l)return <><Header title={l.title} sub={l.en} onBack={()=>setOpen(null)}/><div className="px-5 pb-8"><div className="p-5 mb-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:20,color:T.cream,lineHeight:1.6}}>{l.rule}</div><div className="p-4 mb-5" style={{background:T.raised,border:`1px dashed ${T.marigold}`,borderRadius:16}}><div style={{fontFamily:mono,fontSize:10,color:T.marigold,marginBottom:8}}>EL PATRÓN</div><div style={{fontFamily:mono,fontSize:13,color:T.cream,lineHeight:1.7}}>{l.pattern}</div></div><div className="flex flex-col gap-2 mb-5">{l.ex.map(([es,en])=><div key={es} className="p-4 flex justify-between gap-3" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:16}}><div><div style={{fontFamily:serif,fontSize:18,color:T.cream}}>{es}</div><div style={{fontSize:13.5,color:T.sand,marginTop:5}}>{en}</div></div><Speak text={es} say={say} size={16}/></div>)}</div><div className="p-4" style={{background:'rgba(233,163,60,.08)',border:`1px solid ${T.marigold}`,borderRadius:16}}><div style={{fontFamily:mono,fontSize:10,color:T.marigold,marginBottom:7}}>OJO</div><div style={{fontSize:14,color:T.cream,lineHeight:1.6}}>{l.watch}</div></div></div></>; return <div className="px-5 pb-6 flex flex-col gap-2">{LESSONS.map(x=><button key={x.id} onClick={()=>setOpen(x.id)} className="w-full text-left p-4 flex items-center gap-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}><div style={{fontFamily:mono,fontSize:13,color:T.marigold}}>{x.n}</div><div><div style={{fontFamily:serif,fontSize:18,color:T.cream}}>{x.title}</div><div style={{fontSize:13,color:T.sand}}>{x.en}</div></div></button>)}</div>; }

function Builder({grade,say}){ const [round,setRound]=useState(()=>shuffle(SENTENCES).slice(0,8)),[i,setI]=useState(0),[slots,setSlots]=useState([]),[bank,setBank]=useState([]),[result,setResult]=useState(null),[score,setScore]=useState(0); const q=round[i]; useEffect(()=>{if(!q)return;setSlots([]);setBank(shuffle(q.es.map((w,k)=>({w,k}))));setResult(null)},[i,q]); if(!q)return <div className="px-5 text-center"><div style={{fontFamily:serif,fontSize:58,color:T.jade}}>{score}<span style={{fontSize:24,color:T.sand}}>/{round.length}</span></div><button onClick={()=>{setRound(shuffle(SENTENCES).slice(0,8));setI(0);setScore(0)}} className="mt-7 w-full py-4" style={{borderRadius:16,background:T.marigold,border:'none',color:T.ground,fontWeight:700}}>Another set</button></div>;
  const check=()=>{const ok=slots.map(s=>s.w).join(' ')===q.es.join(' ');setResult(ok?'right':'wrong');grade(`s:${q.en}`,ok,'build');if(ok)setScore(s=>s+1);say(q.es.join(' '))};
  return <div className="px-5 pb-6"><div className="p-5 mb-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:20}}><div style={{fontFamily:mono,fontSize:10,color:T.sand,marginBottom:10}}>SAY THIS IN SPANISH</div><div style={{fontSize:19,color:T.cream}}>{q.en}</div></div><div className="p-3 mb-4 flex flex-wrap" style={{minHeight:92,background:T.raised,border:`1px solid ${result==='right'?T.jade:result==='wrong'?T.rose:T.line}`,borderRadius:18,gap:8}}>{slots.map((s,idx)=><button key={`${s.k}-${idx}`} disabled={!!result} onClick={()=>{setSlots(slots.filter((_,j)=>j!==idx));setBank([...bank,s])}} style={{padding:'9px 13px',borderRadius:11,background:T.surface,border:`1px solid ${T.line}`,color:T.cream,fontFamily:serif,fontSize:17}}>{s.w}</button>)}</div><div className="flex flex-wrap mb-4" style={{gap:8}}>{bank.map((s,idx)=><button key={`${s.k}b${idx}`} disabled={!!result} onClick={()=>{setSlots([...slots,s]);setBank(bank.filter((_,j)=>j!==idx))}} style={{padding:'10px 14px',borderRadius:12,background:T.surface,border:`1px solid ${T.line}`,color:T.cream,fontFamily:serif,fontSize:17}}>{s.w}</button>)}</div>{result?<><div className="p-4 mb-3 flex items-start gap-3" style={{background:result==='right'?'rgba(87,183,154,.14)':'rgba(219,106,106,.12)',border:`1px solid ${result==='right'?T.jade:T.rose}`,borderRadius:16}}>{result==='right'?<Check size={18} color={T.jade}/>:<X size={18} color={T.rose}/>}<div style={{fontFamily:serif,fontSize:19,color:T.cream}}>{q.es.join(' ')}</div></div><button onClick={()=>setI(n=>n+1)} className="w-full py-4" style={{borderRadius:16,background:T.marigold,border:'none',color:T.ground,fontWeight:700}}>Next</button></>:<button onClick={check} disabled={slots.length!==q.es.length} className="w-full py-4" style={{borderRadius:16,background:slots.length===q.es.length?T.jade:T.surface,border:`1px solid ${T.line}`,color:slots.length===q.es.length?T.ground:T.sand,fontWeight:700}}>Check</button>}</div>; }

function SayIt({grade,say}){ const [round,setRound]=useState(()=>shuffle(SAY_IT).slice(0,10)),[i,setI]=useState(0),[phase,setPhase]=useState('thinking'),[left,setLeft]=useState(6),[score,setScore]=useState(0); const timer=useRef(null),q=round[i]; useEffect(()=>{if(!q||phase!=='thinking')return;setLeft(6);timer.current=setInterval(()=>setLeft(n=>{if(n<=1){clearInterval(timer.current);setPhase('revealed');return 0}return n-1}),1000);return()=>clearInterval(timer.current)},[i,phase,q]); useEffect(()=>{if(phase==='revealed'&&q)say(q[1])},[phase,q,say]); const rate=ok=>{grade(`p:${q[0]}`,ok,'speak');if(ok)setScore(s=>s+1);setPhase('thinking');setI(n=>n+1)}; if(!q)return <div className="px-5 text-center"><div style={{fontFamily:serif,fontSize:58,color:T.jade}}>{score}<span style={{fontSize:24,color:T.sand}}>/{round.length}</span></div><button onClick={()=>{setRound(shuffle(SAY_IT).slice(0,10));setI(0);setScore(0);setPhase('thinking')}} className="mt-7 w-full py-4" style={{borderRadius:16,background:T.marigold,border:'none',color:T.ground,fontWeight:700}}>Another set</button></div>; return <div className="px-5 pb-6"><div className="flex justify-between mb-4" style={{fontFamily:mono,fontSize:11,color:T.sand}}><span>{i+1}/{round.length}</span><span className="flex items-center gap-2" style={{color:phase==='thinking'?(left<=2?T.rose:T.marigold):T.sand}}><Timer size={14}/>{phase==='thinking'?`${left}s`:'—'}</span></div><div className="p-6 text-center" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:22,minHeight:230}}><div style={{fontFamily:mono,fontSize:10,color:T.marigold,marginBottom:14}}>OUT LOUD, NOW</div><div style={{fontSize:20,color:T.cream,lineHeight:1.45}}>{q[0]}</div>{phase==='revealed'&&<div className="mt-6 pt-5" style={{borderTop:`1px solid ${T.line}`}}><div style={{fontFamily:serif,fontSize:23,color:T.marigold}}>{q[1]}</div><div className="mt-4 flex justify-center"><Speak text={q[1]} say={say}/></div></div>}</div>{phase==='thinking'?<button onClick={()=>{clearInterval(timer.current);setPhase('revealed')}} className="w-full py-4 mt-4" style={{borderRadius:16,background:'transparent',border:`1px solid ${T.line}`,color:T.cream}}>I said it — show me</button>:<div className="grid grid-cols-2 gap-3 mt-4"><button onClick={()=>rate(false)} className="py-4" style={{borderRadius:16,background:'transparent',border:`1px solid ${T.rose}`,color:T.rose}}>Not close</button><button onClick={()=>rate(true)} className="py-4" style={{borderRadius:16,background:T.jade,border:'none',color:T.ground,fontWeight:700}}>Close enough</button></div>}</div>; }


function PronunciationCoach({grade,say}){
  const prompts=useMemo(()=>shuffle([
    ...SAY_IT.map(([en,es])=>({en,es})),
    ...ALL_CARDS.filter(c=>c.es.split(' ').length>=2).map(c=>({en:c.en,es:c.es}))
  ]).slice(0,20),[]);
  const [i,setI]=useState(0),[heard,setHeard]=useState(''),[score,setScore]=useState(null),[error,setError]=useState('');
  const {supported,listening,listen}=useSpeechRecognition();
  const q=prompts[i%prompts.length];
  const record=async()=>{
    setError(''); setHeard(''); setScore(null);
    try{
      const text=await listen(); const sc=speechScore(q.es,text); setHeard(text); setScore(sc); grade(`voice:${q.es}`,sc>=70,'speak');
    }catch(e){ setError(e.message||'Could not hear you.'); }
  };
  const next=()=>{setI(n=>n+1);setHeard('');setScore(null);setError('')};
  return <div className="px-5 pb-6">
    <div className="p-4 mb-4" style={{background:T.raised,border:`1px dashed ${T.marigold}`,borderRadius:16}}>
      <div style={{fontSize:14,color:T.cream,lineHeight:1.55}}>Hear the phrase, repeat it naturally, then let the phone compare what it heard with the target. Aim for <b>70%+</b>, not perfection.</div>
    </div>
    <div className="p-6 text-center" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:22}}>
      <div style={{fontFamily:mono,fontSize:10,color:T.sand,letterSpacing:'.12em'}}>PRONUNCIATION {i+1}/{prompts.length}</div>
      <div style={{fontFamily:serif,fontSize:27,color:T.cream,lineHeight:1.25,marginTop:14}}>{q.es}</div>
      <div style={{fontSize:14,color:T.sand,lineHeight:1.5,marginTop:8}}>{q.en}</div>
      <div className="flex justify-center mt-5"><Speak text={q.es} say={say}/></div>
    </div>
    {!supported&&<div className="p-4 mt-4" style={{background:'rgba(219,106,106,.12)',border:`1px solid ${T.rose}`,borderRadius:16,color:T.cream,fontSize:14,lineHeight:1.5}}>Speech recognition is unavailable in this browser. On iPhone, try Safari. On Mac, Chrome is the most reliable option for this practice mode.</div>}
    {supported&&<button onClick={record} disabled={listening} className="w-full py-4 mt-4 flex items-center justify-center gap-2" style={{borderRadius:16,background:listening?T.rose:T.marigold,border:'none',color:T.ground,fontWeight:800}}><Mic size={18}/>{listening?'Listening…':'Speak now'}</button>}
    {error&&<div className="mt-3" style={{color:T.rose,fontSize:13}}>{error}</div>}
    {score!==null&&<div className="p-5 mt-4" style={{background:score>=70?'rgba(87,183,154,.13)':'rgba(233,163,60,.11)',border:`1px solid ${score>=70?T.jade:T.marigold}`,borderRadius:18}}>
      <div className="flex items-end justify-between gap-4"><div><div style={{fontFamily:mono,fontSize:9,color:T.sand,letterSpacing:'.1em'}}>THE PHONE HEARD</div><div style={{fontFamily:serif,fontSize:20,color:T.cream,marginTop:5}}>{heard||'—'}</div></div><div style={{fontFamily:serif,fontSize:34,color:score>=70?T.jade:T.marigold}}>{score}%</div></div>
      <div style={{fontSize:13.5,color:T.sand,lineHeight:1.5,marginTop:12}}>{score>=90?'Excellent — move on.':score>=70?'Good enough for real conversation.':'Try once more, focusing on the missing or changed words.'}</div>
      <button onClick={next} className="w-full py-3.5 mt-4" style={{borderRadius:14,background:T.jade,border:'none',color:T.ground,fontWeight:800}}>Next phrase</button>
    </div>}
  </div>;
}

function Convos({say}){ const [open,setOpen]=useState(null),[step,setStep]=useState(0),[peek,setPeek]=useState(false); const c=CONVOS.find(x=>x.id===open); useEffect(()=>{setStep(0);setPeek(false)},[open]); useEffect(()=>{if(!c)return;const t=c.turns[step];if(t&&t[0]==='them')say(t[1])},[step,c,say]); if(!c)return <div className="px-5 pb-6 flex flex-col gap-2">{CONVOS.map(x=><button key={x.id} onClick={()=>setOpen(x.id)} className="w-full text-left p-4 flex justify-between" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}><div><div style={{fontFamily:serif,fontSize:18,color:T.cream}}>{x.title}</div><div style={{fontSize:13,color:T.sand}}>{x.en}</div></div><div style={{width:8,height:8,borderRadius:99,background:x.accent}}/></button>)}</div>; const turn=c.turns[step]; if(!turn)return <><Header title={c.title} onBack={()=>setOpen(null)}/><Empty title="Conversación completa" body="Run it again and answer before revealing your line." action="Back" onAction={()=>setOpen(null)}/></>; return <><Header title={c.title} sub={`${step+1} of ${c.turns.length}`} onBack={()=>setOpen(null)}/><div className="px-5 pb-6"><div className="flex flex-col gap-2 mb-4">{c.turns.slice(0,step).map(([who,es,en],k)=><div key={k} style={{maxWidth:'88%',padding:'11px 14px',borderRadius:16,background:who==='you'?T.raised:T.surface,border:`1px solid ${who==='you'?c.accent:T.line}`,alignSelf:who==='you'?'flex-end':'flex-start'}}><div style={{fontFamily:serif,fontSize:16.5,color:T.cream}}>{es}</div><div style={{fontSize:12.5,color:T.sand,marginTop:4}}>{en}</div></div>)}</div>{turn[0]==='them'?<div className="p-5" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:20}}><div className="flex justify-between mb-3"><div style={{fontFamily:mono,fontSize:10,color:c.accent}}>ELLOS DICEN</div><Speak text={turn[1]} say={say} size={16}/></div><div style={{fontFamily:serif,fontSize:21,color:T.cream}}>{turn[1]}</div><div style={{fontSize:13.5,color:T.sand,marginTop:6}}>{turn[2]}</div><button onClick={()=>setStep(step+1)} className="w-full py-3.5 mt-5" style={{borderRadius:14,background:T.marigold,border:'none',color:T.ground,fontWeight:700}}>My turn</button></div>:<div className="p-5" style={{background:T.raised,border:`1px solid ${c.accent}`,borderRadius:20}}><div style={{fontFamily:mono,fontSize:10,color:c.accent,marginBottom:10}}>USTED RESPONDE</div><div style={{fontSize:18,color:T.cream}}>{turn[2]}</div>{peek&&<div className="mt-5 pt-4" style={{borderTop:`1px solid ${T.line}`}}><div style={{fontFamily:serif,fontSize:21,color:T.marigold}}>{turn[1]}</div></div>}<button onClick={()=>{if(!peek){setPeek(true);say(turn[1])}else{setPeek(false);setStep(step+1)}}} className="w-full py-3.5 mt-5" style={{borderRadius:14,background:peek?T.jade:'transparent',border:`1px solid ${peek?T.jade:T.line}`,color:peek?T.ground:T.cream,fontWeight:700}}>{peek?'Continue':'Show me how'}</button></div>}</div></>; }

function buildRound(pool,n=10){ return shuffle(pool).slice(0,n).map(card=>{const any=shuffle(ALL_CARDS.filter(c=>c.id!==card.id)).slice(0,3);return{card,options:shuffle([card,...any])}}); }
function Quiz({pool,grade,say,onBack,listening}){ const [round,setRound]=useState(()=>buildRound(pool)),[i,setI]=useState(0),[picked,setPicked]=useState(null),[score,setScore]=useState(0); const q=round[i]; useEffect(()=>{if(listening&&q)say(q.card.es)},[i,listening,q,say]); const choose=o=>{if(picked)return;const right=o.id===q.card.id;setPicked(o.id);grade(q.card.id,right);if(right)setScore(s=>s+1);if(!listening)say(q.card.es);setTimeout(()=>{setPicked(null);setI(n=>n+1)},850)}; if(!q)return <><Header title={listening?'Al oído':'Práctica'} onBack={onBack}/><div className="px-5 text-center"><div style={{fontFamily:serif,fontSize:62,color:T.jade}}>{score}<span style={{fontSize:26,color:T.sand}}>/{round.length}</span></div><button onClick={onBack} className="mt-8 w-full py-4" style={{borderRadius:16,background:T.marigold,border:'none',color:T.ground,fontWeight:700}}>Done</button></div></>; return <><Header title={listening?'Al oído':'Práctica'} sub={`${i+1} of ${round.length} · ${score} right`} onBack={onBack}/><div className="px-5"><div className="p-6 mb-4 flex flex-col items-center text-center" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:22,minHeight:150}}>{listening?<><button onClick={()=>say(q.card.es)} style={{width:74,height:74,borderRadius:99,background:T.raised,border:`1px solid ${T.line}`,color:T.marigold}}><Headphones size={30} style={{margin:'auto'}}/></button><div style={{fontFamily:mono,fontSize:11,color:T.sand,marginTop:14}}>TAP TO HEAR IT AGAIN</div></>:<div style={{fontFamily:serif,fontSize:q.card.es.length>22?25:31,color:T.cream}}>{q.card.es}</div>}</div><div className="flex flex-col gap-2">{q.options.map(o=>{const isRight=o.id===q.card.id,chosen=picked===o.id;let border=T.line,bg=T.surface,color=T.cream;if(picked){if(isRight){border=T.jade;bg='rgba(87,183,154,.16)'}else if(chosen){border=T.rose;bg='rgba(219,106,106,.14)'}else color=T.sand}return <button key={o.id} onClick={()=>choose(o)} className="w-full text-left px-4 py-4 flex justify-between" style={{background:bg,border:`1px solid ${border}`,borderRadius:16,color,fontSize:16}}><span>{o.en}</span>{picked&&isRight&&<Check size={18} color={T.jade}/>} {picked&&chosen&&!isRight&&<X size={18} color={T.rose}/>}</button>})}</div></div></>; }

function DeckPicker({title,sub,onPick}){ return <><Header title={title} sub={sub}/><div className="px-5 flex flex-col gap-2 pb-6"><button onClick={()=>onPick('all')} className="w-full text-left p-4" style={{background:T.marigold,border:'none',borderRadius:18,color:T.ground}}><div style={{fontFamily:serif,fontSize:19}}>Todo revuelto</div><div style={{fontSize:13}}>Mixed from every deck</div></button>{DECKS.map(d=><button key={d.id} onClick={()=>onPick(d.id)} className="w-full text-left p-4 flex justify-between" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}><div><div style={{fontFamily:serif,fontSize:18,color:T.cream}}>{d.name}</div><div style={{fontSize:13,color:T.sand}}>{d.en}</div></div><div style={{width:8,height:8,borderRadius:99,background:d.accent}}/></button>)}</div></>; }

function ProgressView({progress,reset}){
  const vocab=Object.entries(progress.cards).filter(([id])=>CARD_BY_ID[id]);
  const boxes=[1,2,3,4,5].map(b=>vocab.filter(([,v])=>v.box===b).length);
  const all=Object.values(progress.cards),seen=all.reduce((a,c)=>a+(c.seen||0),0),right=all.reduce((a,c)=>a+(c.right||0),0),acc=seen?Math.round(right/seen*100):0;
  const importRef=useRef(null);
  const backup=()=>{
    const payload={version:1,exportedAt:new Date().toISOString(),progress};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`poco-a-poco-backup-${todayStr()}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const restore=async e=>{
    const f=e.target.files?.[0]; if(!f)return;
    try{const data=JSON.parse(await f.text()); const next=data.progress||data; localStorage.setItem(STORE_KEY,JSON.stringify(next)); window.location.reload();}catch{alert('That file is not a valid Poco a Poco backup.')}
  };
  return <><Header title="Avance" sub="your progress"/><div className="px-5 pb-8">
    <div className="grid grid-cols-2 gap-3 mb-3">{[['Answers',seen],['Accuracy',`${acc}%`]].map(([l,v])=><div key={l} className="p-3" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:16}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>{l.toUpperCase()}</div><div style={{fontFamily:serif,fontSize:24,color:T.cream}}>{v}</div></div>)}</div>
    <div className="grid grid-cols-3 gap-3 mb-7">{[['Streak',progress.streak],['Spoken',progress.spoken],['Built',progress.built]].map(([l,v])=><div key={l} className="p-3" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:16}}><div style={{fontFamily:mono,fontSize:9,color:T.sand}}>{l.toUpperCase()}</div><div style={{fontFamily:serif,fontSize:22,color:T.cream}}>{v}</div></div>)}</div>
    <div className="p-4 mb-7 flex flex-col gap-3" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}>{['New again','Learning','Settling','Known','Solid'].map((l,idx)=><div key={l} className="flex items-center gap-3"><div style={{fontSize:13,color:T.cream,width:82}}>{l}</div><div className="flex-1" style={{height:8,borderRadius:99,background:'rgba(242,233,220,.08)'}}><div style={{width:`${Math.round(boxes[idx]/ALL_CARDS.length*100)}%`,height:'100%',background:BAND[idx],borderRadius:99}}/></div><div style={{fontFamily:mono,fontSize:12,color:T.sand,width:28,textAlign:'right'}}>{boxes[idx]}</div></div>)}</div>
    <div className="p-4 mb-4" style={{background:T.surface,border:`1px solid ${T.line}`,borderRadius:18}}>
      <div style={{fontFamily:serif,fontSize:18,color:T.cream}}>Move your progress</div><div style={{fontSize:13,color:T.sand,lineHeight:1.5,marginTop:4}}>Until cloud sync is added, export a backup on one device and import it on another.</div>
      <div className="grid grid-cols-2 gap-2 mt-4"><button onClick={backup} className="py-3" style={{borderRadius:12,background:T.marigold,border:'none',color:T.ground,fontWeight:800}}>Export backup</button><button onClick={()=>importRef.current?.click()} className="py-3" style={{borderRadius:12,background:'transparent',border:`1px solid ${T.line}`,color:T.cream}}>Import backup</button></div>
      <input ref={importRef} type="file" accept="application/json,.json" onChange={restore} style={{display:'none'}}/>
    </div>
    <button onClick={()=>{if(confirm('Clear all Poco a Poco progress on this device?'))reset()}} className="w-full py-3" style={{borderRadius:14,background:'transparent',border:`1px solid ${T.line}`,color:T.sand}}>Clear progress</button>
  </div></>;
}

export default function App(){
  const {state,grade,reset,loaded}=useProgress(); const say=useSpeech(); const [tab,setTab]=useState('mazos'),[studyDeck,setStudyDeck]=useState(null),[quizPool,setQuizPool]=useState(null),[gramTab,setGramTab]=useState('reglas'),[hablarTab,setHablarTab]=useState('dilo'),[quizMode,setQuizMode]=useState('leer');
  const dueCards=useMemo(()=>ALL_CARDS.filter(c=>state.cards[c.id]&&state.cards[c.id].due<=Date.now()),[state]);
  const studyQueue=useMemo(()=>{if(!studyDeck)return[];if(studyDeck==='__due')return shuffle(dueCards).slice(0,20);const cards=ALL_CARDS.filter(c=>c.deck===studyDeck),ready=cards.filter(c=>!state.cards[c.id]||state.cards[c.id].due<=Date.now());return [...(ready.length?ready:cards)].sort((a,b)=>(state.cards[a.id]?.box||0)-(state.cards[b.id]?.box||0)).slice(0,20)},[studyDeck,state,dueCards]);
  const studyTitle=studyDeck==='__due'?'Repaso':DECKS.find(d=>d.id===studyDeck)?.name||'Estudio'; const poolFor=id=>id==='all'?ALL_CARDS:ALL_CARDS.filter(c=>c.deck===id);
  const tabs=[['mazos','Mazos',Layers],['gramatica','Frases',BookOpen],['hablar','Hablar',Mic],['quiz','Quiz',Target],['avance','Avance',BarChart3]];
  let body;
  if(!loaded) body=<div className="px-5 pt-24 text-center" style={{fontFamily:mono,fontSize:12,color:T.sand}}>CARGANDO…</div>;
  else if(tab==='mazos') body=studyDeck?<Study queue={studyQueue} progress={state} grade={grade} say={say} title={studyTitle} onBack={()=>setStudyDeck(null)}/>:<Home progress={state} dueCount={dueCards.length} onOpen={setStudyDeck} onReview={()=>setStudyDeck('__due')}/>;
  else if(tab==='gramatica') body=<><Header title="Cómo se arma" sub="grammar and word order"/><Segmented value={gramTab} onChange={setGramTab} options={[["reglas","Reglas"],["armar","Armar"]]}/>{gramTab==='reglas'?<Lessons say={say}/>:<Builder grade={grade} say={say}/>}</>;
  else if(tab==='hablar') body=<><Header title="Hablar" sub="produce it out loud"/><Segmented value={hablarTab} onChange={setHablarTab} options={[["dilo","Dilo tú"],["pronuncia","Pronuncia"],["convo","Conversar"]]}/>{hablarTab==='dilo'?<SayIt grade={grade} say={say}/>:hablarTab==='pronuncia'?<PronunciationCoach grade={grade} say={say}/>:<Convos say={say}/>}</>;
  else if(tab==='quiz') body=quizPool?<Quiz pool={poolFor(quizPool)} grade={grade} say={say} listening={quizMode==='escuchar'} onBack={()=>setQuizPool(null)}/>:<><Segmented value={quizMode} onChange={setQuizMode} options={[["leer","Leer"],["escuchar","Escuchar"]]}/><DeckPicker title={quizMode==='leer'?'Práctica':'Al oído'} sub={quizMode==='leer'?'read it, pick the meaning':'hear it, pick the meaning'} onPick={setQuizPool}/></>;
  else body=<ProgressView progress={state} reset={reset}/>;
  return <div style={{background:T.ground,minHeight:'100vh',color:T.cream,fontFamily:sans,WebkitFontSmoothing:'antialiased'}}><style>{`*{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:focus-visible{outline:2px solid ${T.marigold};outline-offset:2px}button:active{transform:scale(.985)}@media(prefers-reduced-motion:reduce){*{transition:none!important}button:active{transform:none}}`}</style><div className="mx-auto" style={{maxWidth:480,paddingBottom:100}}>{body}</div><nav className="fixed bottom-0 left-0 right-0" style={{background:'rgba(14,43,42,.94)',backdropFilter:'blur(12px)',borderTop:`1px solid ${T.line}`}}><div className="mx-auto flex safe-bottom" style={{maxWidth:480}}>{tabs.map(([id,label,Icon])=>{const active=tab===id;return <button key={id} onClick={()=>{setTab(id);if(id==='mazos')setStudyDeck(null);if(id==='quiz')setQuizPool(null)}} className="flex-1 flex flex-col items-center gap-1 py-3" style={{background:'transparent',border:'none',color:active?T.marigold:T.sand}}><Icon size={19}/><span style={{fontFamily:mono,fontSize:9}}>{label.toUpperCase()}</span></button>})}</div></nav></div>;
}
