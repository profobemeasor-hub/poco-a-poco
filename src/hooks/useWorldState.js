import {useCallback,useEffect,useMemo,useState} from 'react';
import {WORLD_EVENTS,WORLD_ACHIEVEMENTS} from '../data/world';

const KEY='espanol:world:v11';
const initialTimeline=()=>[{id:'arrived',icon:'✈️',title:'Arrived in Guatemala',at:Date.now()}];
const base={day:1,wallet:4250,visited:{},completed:{},relationships:{maria:0,jose:0,sofia:0,miguel:0,ana:0,diego:0,lucia:0,laura:0,officer:0},achievements:{},timeline:[],eventHistory:[],currentEvent:null};

function merge(saved={}){
  return {...base,...saved,visited:{...base.visited,...(saved.visited||{})},completed:{...base.completed,...(saved.completed||{})},relationships:{...base.relationships,...(saved.relationships||{})},achievements:{...base.achievements,...(saved.achievements||{})},timeline:(saved.timeline?.length?saved.timeline:initialTimeline()).slice(-50),eventHistory:[...(saved.eventHistory||[])].slice(-30)};
}

export function useWorldState(){
  const [state,setState]=useState(()=>({...base,timeline:initialTimeline()}));
  useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setState(merge(JSON.parse(raw)))}catch{}},[]);
  const persist=next=>{try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next};

  const visit=useCallback(location=>setState(s=>{const first=!s.visited[location.id];return persist({...s,visited:{...s.visited,[location.id]:(s.visited[location.id]||0)+1},timeline:(first?[...s.timeline,{id:`visit:${location.id}`,icon:location.icon,title:`Visited ${location.name}`,at:Date.now()}]:s.timeline).slice(-50)})}),[]);

  const completeTask=useCallback((location,task)=>setState(s=>{const key=`${location.id}:${task.id}`;const first=!s.completed[key];const rel=task.relation?{...s.relationships,[task.relation]:Math.min(100,(s.relationships[task.relation]||0)+7)}:s.relationships;return persist({...s,wallet:Math.max(0,s.wallet-(first?location.cost:0)),completed:{...s.completed,[key]:(s.completed[key]||0)+1},relationships:rel,timeline:[...s.timeline,{id:`task:${key}:${Date.now()}`,icon:location.icon,title:task.title,at:Date.now()}].slice(-50)})}),[]);

  const advanceDay=useCallback(()=>setState(s=>{const day=s.day+1;const event=WORLD_EVENTS[day%WORLD_EVENTS.length];return persist({...s,day,wallet:s.wallet+150,currentEvent:event,eventHistory:[...s.eventHistory,{...event,at:Date.now()}].slice(-30),timeline:[...s.timeline,{id:`day:${day}`,icon:'☀️',title:`Started day ${day}`,at:Date.now()}].slice(-50)})}),[]);
  const resolveEvent=useCallback(()=>setState(s=>persist({...s,currentEvent:null})),[]);

  const stats=useMemo(()=>{const places=Object.keys(state.visited).length;const tasks=Object.values(state.completed).reduce((a,b)=>a+b,0);const cafeTasks=Object.entries(state.completed).filter(([k])=>k.startsWith('cafe:')).reduce((a,[,v])=>a+v,0);const distinctTaskPlaces=new Set(Object.keys(state.completed).map(k=>k.split(':')[0])).size;return{places,tasks,cafeTasks,distinctTaskPlaces}},[state]);

  useEffect(()=>setState(s=>{const next={...s.achievements};let changed=false;const unlock=id=>{if(!next[id]){next[id]=Date.now();changed=true}};
    if(stats.places>=3)unlock('first-trip');if(stats.cafeTasks>=3)unlock('coffee-regular');if(stats.tasks>=8)unlock('city-life');if(state.visited.antigua)unlock('weekend');if(stats.distinctTaskPlaces>=6)unlock('independent');
    if(!changed)return s;
    const fresh=WORLD_ACHIEVEMENTS.filter(a=>next[a.id]&&!s.achievements[a.id]).map(a=>({id:`achievement:${a.id}`,icon:a.icon,title:`Achievement: ${a.title}`,at:Date.now()}));
    return persist({...s,achievements:next,timeline:[...s.timeline,...fresh].slice(-50)});
  }),[stats.places,stats.cafeTasks,stats.tasks,stats.distinctTaskPlaces,state.visited.antigua]);

  return {state,visit,completeTask,advanceDay,resolveEvent,stats};
}
