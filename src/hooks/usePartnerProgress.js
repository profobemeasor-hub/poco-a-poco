import {useCallback,useEffect,useMemo,useState} from 'react';

const KEY='espanol:partner:v13';
const base={sessions:[],feedback:{},tutorNotes:[],minutes:0};

export function usePartnerProgress(){
  const [state,setState]=useState(base);
  useEffect(()=>{try{const raw=localStorage.getItem(KEY);if(raw)setState({...base,...JSON.parse(raw)})}catch{}},[]);
  const persist=next=>{try{localStorage.setItem(KEY,JSON.stringify(next))}catch{};return next};

  const completeSession=useCallback(({sessionId,score,feedback=[],minutes=10})=>{
    setState(s=>persist({
      ...s,
      sessions:[...(s.sessions||[]),{sessionId,score,feedback,at:Date.now()}].slice(-100),
      feedback:{...(s.feedback||{}),[sessionId]:[...(s.feedback?.[sessionId]||[]),...feedback].slice(-30)},
      minutes:(s.minutes||0)+minutes
    }));
  },[]);

  const addTutorNote=useCallback(text=>{
    if(!text.trim())return;
    setState(s=>persist({...s,tutorNotes:[{text:text.trim(),at:Date.now()},...(s.tutorNotes||[])].slice(0,50)}));
  },[]);

  const average=useMemo(()=>state.sessions.length?Math.round(state.sessions.reduce((a,b)=>a+b.score,0)/state.sessions.length):0,[state.sessions]);

  return {state,completeSession,addTutorNote,average};
}
