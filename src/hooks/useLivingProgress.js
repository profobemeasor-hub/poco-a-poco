import { useCallback, useEffect, useMemo, useState } from 'react';

const KEY='espanol:living:v5';
const base={
  day:1,
  xp:0,
  missionDone:{},
  confidence:{arrival:25,daily:30,social:15,transport:25,shopping:20,food:25,home:15,bank:10,health:10,business:10},
  scenarioScores:{},
  reflections:[],
  coachMemory:{weakWords:{},mistakes:{},rounds:[],totalTurns:0}
};

function merge(saved={}){
  return {
    ...base,
    ...saved,
    confidence:{...base.confidence,...(saved.confidence||{})},
    coachMemory:{
      ...base.coachMemory,
      ...(saved.coachMemory||{}),
      weakWords:{...base.coachMemory.weakWords,...(saved.coachMemory?.weakWords||{})},
      mistakes:{...base.coachMemory.mistakes,...(saved.coachMemory?.mistakes||{})},
      rounds:[...(saved.coachMemory?.rounds||[])].slice(-60)
    }
  };
}

export function useLivingProgress(){
  const [state,setState]=useState(base);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(KEY);
      if(raw)setState(merge(JSON.parse(raw)));
    }catch{}
  },[]);

  const persist=(next)=>{
    try{localStorage.setItem(KEY,JSON.stringify(next))}catch{}
    return next;
  };

  const save=useCallback(next=>setState(persist(merge(next))),[]);

  const completeMission=useCallback((id,area)=>{
    setState(s=>persist({
      ...s,
      xp:s.xp+80,
      missionDone:{...s.missionDone,[id]:new Date().toISOString()},
      confidence:{...s.confidence,[area]:Math.min(100,(s.confidence[area]||0)+4)}
    }));
  },[]);

  const recordScenario=useCallback((id,area,score)=>{
    setState(s=>{
      const old=s.scenarioScores[id]||[];
      return persist({
        ...s,
        xp:s.xp+Math.max(20,score),
        scenarioScores:{...s.scenarioScores,[id]:[...old,{score,at:Date.now()}].slice(-12)},
        confidence:{...s.confidence,[area]:Math.min(100,Math.round((s.confidence[area]||0)*.82+score*.18))}
      });
    });
  },[]);

  const recordCoachTurn=useCallback(({scenarioId,area,score,missing=[],mistakes=[]})=>{
    setState(s=>{
      const weak={...(s.coachMemory?.weakWords||{})};
      for(const word of missing){
        weak[word]=(weak[word]||0)+1;
      }
      // Successful use slowly reduces weakness.
      if(score>=80){
        Object.keys(weak).forEach(w=>{ if(weak[w]>0) weak[w]=Math.max(0,weak[w]-0.2); });
      }

      const errs={...(s.coachMemory?.mistakes||{})};
      for(const m of mistakes){
        errs[m]=(errs[m]||0)+1;
      }

      const round={scenarioId,area,score,missing,mistakes,at:Date.now()};
      const old=s.scenarioScores[scenarioId]||[];
      const next={
        ...s,
        xp:s.xp+Math.max(10,Math.round(score/2)),
        scenarioScores:{...s.scenarioScores,[scenarioId]:[...old,{score,at:Date.now()}].slice(-12)},
        confidence:{...s.confidence,[area]:Math.min(100,Math.round((s.confidence[area]||0)*.88+score*.12))},
        coachMemory:{
          weakWords:weak,
          mistakes:errs,
          rounds:[...(s.coachMemory?.rounds||[]),round].slice(-60),
          totalTurns:(s.coachMemory?.totalTurns||0)+1
        }
      };
      return persist(next);
    });
  },[]);

  const addReflection=useCallback(text=>{
    if(!text.trim())return;
    setState(s=>persist({
      ...s,
      reflections:[{text:text.trim(),at:Date.now()},...s.reflections].slice(0,20),
      xp:s.xp+20
    }));
  },[]);

  const clearCoachMemory=useCallback(()=>{
    setState(s=>persist({...s,coachMemory:{...base.coachMemory}}));
  },[]);

  const weakest=useMemo(()=>Object.entries(state.confidence).sort((a,b)=>a[1]-b[1])[0], [state.confidence]);

  const weakWords=useMemo(()=>Object.entries(state.coachMemory?.weakWords||{})
    .filter(([,n])=>n>.2)
    .sort((a,b)=>b[1]-a[1]).slice(0,8),[state.coachMemory]);

  const topMistakes=useMemo(()=>Object.entries(state.coachMemory?.mistakes||{})
    .sort((a,b)=>b[1]-a[1]).slice(0,6),[state.coachMemory]);

  return {state,save,completeMission,recordScenario,recordCoachTurn,addReflection,clearCoachMemory,weakest,weakWords,topMistakes};
}
