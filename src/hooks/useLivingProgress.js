import { useCallback, useEffect, useMemo, useState } from 'react';
const KEY='espanol:living:v5';
const base={day:1, xp:0, missionDone:{}, confidence:{arrival:25,daily:30,social:15,transport:25,shopping:20,food:25,home:15,bank:10,health:10,business:10}, scenarioScores:{}, reflections:[]};
export function useLivingProgress(){
 const [state,setState]=useState(base);
 useEffect(()=>{try{const x=localStorage.getItem(KEY);if(x)setState({...base,...JSON.parse(x),confidence:{...base.confidence,...JSON.parse(x).confidence}})}catch{}},[]);
 const save=useCallback(next=>{setState(next);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}},[]);
 const completeMission=useCallback((id,area)=>{setState(s=>{const next={...s,xp:s.xp+80,missionDone:{...s.missionDone,[id]:new Date().toISOString()},confidence:{...s.confidence,[area]:Math.min(100,(s.confidence[area]||0)+4)}};try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next})},[]);
 const recordScenario=useCallback((id,area,score)=>{setState(s=>{const old=s.scenarioScores[id]||[];const next={...s,xp:s.xp+Math.max(20,score),scenarioScores:{...s.scenarioScores,[id]:[...old,{score,at:Date.now()}].slice(-8)},confidence:{...s.confidence,[area]:Math.min(100,Math.round((s.confidence[area]||0)*.8+score*.2))}};try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next})},[]);
 const addReflection=useCallback(text=>{if(!text.trim())return;setState(s=>{const next={...s,reflections:[{text:text.trim(),at:Date.now()},...s.reflections].slice(0,20),xp:s.xp+20};try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next})},[]);
 const weakest=useMemo(()=>Object.entries(state.confidence).sort((a,b)=>a[1]-b[1])[0], [state.confidence]);
 return {state,save,completeMission,recordScenario,addReflection,weakest};
}
