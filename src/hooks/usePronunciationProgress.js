import {useEffect,useMemo,useState,useCallback} from 'react';

const KEY='espanol:pronunciation:v12';
const base={attempts:[],byItem:{},soundScores:{}};

export function usePronunciationProgress(){
  const [state,setState]=useState(base);
  useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setState({...base,...JSON.parse(raw)})}catch{}},[]);
  const persist=next=>{try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next};

  const record=useCallback(attempt=>{
    setState(s=>{
      const key=attempt.itemId;
      const prior=s.byItem?.[key]||[];
      const sound=attempt.sound||'general';
      const soundPrior=s.soundScores?.[sound]||[];
      return persist({
        attempts:[...(s.attempts||[]),attempt].slice(-120),
        byItem:{...(s.byItem||{}),[key]:[...prior,attempt].slice(-10)},
        soundScores:{...(s.soundScores||{}),[sound]:[...soundPrior,attempt.overall].slice(-20)}
      });
    });
  },[]);

  const weakestSound=useMemo(()=>{
    const arr=Object.entries(state.soundScores||{}).map(([k,v])=>[k,Math.round(v.reduce((a,b)=>a+b,0)/v.length)]);
    return arr.sort((a,b)=>a[1]-b[1])[0]||null;
  },[state.soundScores]);

  const average=useMemo(()=>state.attempts.length?Math.round(state.attempts.reduce((a,b)=>a+b.overall,0)/state.attempts.length):0,[state.attempts]);

  return {state,record,weakestSound,average};
}
