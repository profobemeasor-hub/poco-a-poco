export const PARTNER_SESSIONS = [
  {
    id:'cafe-duo', icon:'☕', title:'Café roleplay', level:'Easy',
    learnerRole:'Customer', partnerRole:'Barista',
    objective:'Order, make one change, ask one follow-up question.',
    turns:[
      ['partner','Buenos días. ¿Qué le preparo?','Good morning. What can I get you?'],
      ['learner','Buenos días. ¿Me regala un café americano, por favor?','Order politely.'],
      ['partner','Claro. ¿Con azúcar o sin azúcar?','With sugar or without?'],
      ['learner','Sin azúcar, por favor. ¿Tiene leche deslactosada?','Make a change and ask a follow-up.'],
      ['partner','Sí, claro. ¿Algo más?','Anything else?'],
      ['learner','Eso es todo, muchas gracias.','Close naturally.']
    ]
  },
  {
    id:'taxi-duo', icon:'🚕', title:'Taxi conversation', level:'Easy',
    learnerRole:'Passenger', partnerRole:'Driver',
    objective:'Choose a route, answer small talk, say where to stop.',
    turns:[
      ['partner','Buenas. ¿Vamos por la ruta rápida o evitamos el tráfico?','Which route?'],
      ['learner','Prefiero evitar el tráfico, por favor.','Choose the route.'],
      ['partner','¿Lleva mucho tiempo viviendo aquí?','Have you lived here long?'],
      ['learner','Sí, vivo aquí desde hace un tiempo. Todavía estoy aprendiendo español.','Answer naturally.'],
      ['partner','Ya casi llegamos. ¿Dónde lo dejo?','Where should I drop you?'],
      ['learner','Aquí está bien, muchas gracias. Que le vaya bien.','Finish the ride.']
    ]
  },
  {
    id:'restaurant-duo', icon:'🍽️', title:'Restaurant night', level:'Medium',
    learnerRole:'Guest', partnerRole:'Server',
    objective:'Get a table, ask for a recommendation, order, pay.',
    turns:[
      ['partner','Buenas noches. ¿Mesa para cuántos?','Table for how many?'],
      ['learner','Para dos, por favor.','Ask for a table.'],
      ['partner','¿Ya saben qué van a pedir?','Ready to order?'],
      ['learner','¿Cuál me recomienda? Quisiera algo sin mucho picante.','Ask for a recommendation.'],
      ['partner','Le recomiendo el pepián. ¿Algo de tomar?','Recommendation and drink.'],
      ['learner','Agua pura, por favor. Y la cuenta cuando pueda.','Order and ask for the bill.']
    ]
  },
  {
    id:'doctor-duo', icon:'🏥', title:'Doctor visit', level:'Hard',
    learnerRole:'Patient', partnerRole:'Doctor',
    objective:'Explain symptoms, duration and medicine already taken.',
    turns:[
      ['partner','Buenos días. ¿Qué síntomas tiene y desde cuándo?','Symptoms and duration.'],
      ['learner','Me duele la cabeza desde ayer y me siento mareado.','Explain the problem.'],
      ['partner','¿Tiene fiebre o náusea?','Any fever or nausea?'],
      ['learner','No tengo fiebre, pero estoy un poco cansado.','Clarify symptoms.'],
      ['partner','¿Ha tomado algún medicamento?','Taken medicine?'],
      ['learner','Sí, tomé acetaminofén esta mañana.','Say what you took.']
    ]
  },
  {
    id:'bank-duo', icon:'🏦', title:'Bank problem', level:'Hard',
    learnerRole:'Customer', partnerRole:'Bank adviser',
    objective:'Explain a declined card and request a solution.',
    turns:[
      ['partner','Buenas tardes. ¿En qué le puedo ayudar?','How can I help?'],
      ['learner','Mi tarjeta fue rechazada ayer, pero tengo fondos en la cuenta.','Explain the issue.'],
      ['partner','¿Fue una compra local o internacional?','Local or international?'],
      ['learner','Fue una compra local en un restaurante.','Give detail.'],
      ['partner','Parece un bloqueo de seguridad. ¿Desea que lo quite?','Security block.'],
      ['learner','Sí, por favor. Quisiera desbloquear la tarjeta.','Request action.']
    ]
  },
  {
    id:'apartment-duo', icon:'🏠', title:'Apartment maintenance', level:'Medium',
    learnerRole:'Resident', partnerRole:'Property manager',
    objective:'Report a problem and agree a visit time.',
    turns:[
      ['partner','Hola. Me dijeron que hay un problema en el apartamento. ¿Qué pasó?','What happened?'],
      ['learner','Fíjese que no hay agua desde esta mañana.','Explain the issue.'],
      ['partner','¿Es en todo el apartamento?','Everywhere?'],
      ['learner','Sí, no hay agua en todo el apartamento.','Clarify scope.'],
      ['partner','Mantenimiento puede ir esta tarde. ¿Puede estar en casa?','Can you be home?'],
      ['learner','Sí, puedo estar aquí a partir de las tres.','Agree a time.']
    ]
  }
];

export const TUTOR_PLANS = [
  {
    id:'15min-daily', icon:'⏱️', title:'15-minute daily session', duration:15,
    blocks:[
      ['Warm-up','2 min','Say three things you did today in Spanish.'],
      ['Smart Coach','5 min','Run one recommended adaptive conversation.'],
      ['Pronunciation','4 min','Practice your weakest sound or one rhythm phrase.'],
      ['Free speak','3 min','Talk for one minute without stopping; repeat once better.'],
      ['Wrap-up','1 min','Write one useful phrase to reuse tomorrow.']
    ]
  },
  {
    id:'30min-tutor', icon:'🧑‍🏫', title:'30-minute tutor session', duration:30,
    blocks:[
      ['Check-in','5 min','Tutor asks about the learner’s day only in Spanish.'],
      ['Roleplay','8 min','Complete one Partner Mode scene and swap roles once.'],
      ['Correction','5 min','Tutor chooses only the three most important corrections.'],
      ['Speaking Lab','6 min','Shadow two phrases and compare repeat consistency.'],
      ['Challenge','4 min','Learner improvises a variation of the roleplay.'],
      ['Homework','2 min','Choose one real-world mission for tomorrow.']
    ]
  },
  {
    id:'45min-deep', icon:'🎓', title:'45-minute deep practice', duration:45,
    blocks:[
      ['Warm conversation','7 min','No English unless completely stuck.'],
      ['Living World','8 min','Complete two location tasks.'],
      ['Partner roleplay','10 min','Run one medium/hard scenario; swap roles.'],
      ['Pronunciation Studio','8 min','Focus on weakest sound plus rhythm.'],
      ['Story retell','7 min','Retell a recent event in past tense.'],
      ['Review','5 min','Save three corrections and one success.']
    ]
  }
];

export const PEER_FEEDBACK = [
  'Easy to understand',
  'Good rhythm',
  'Good vocabulary',
  'Needed more detail',
  'Too much hesitation',
  'One grammar issue',
  'Very natural',
  'Try again more slowly'
];
