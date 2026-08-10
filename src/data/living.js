export const CHAPTERS = [
  {id:'arrival', n:1, icon:'✈️', title:'Llegada', en:'Arrival & getting settled', color:'#E9A33C', confidence:'arrival', scenes:['Immigration','Taxi from airport','Hotel check-in','Apartment security']},
  {id:'daily', n:2, icon:'☕', title:'Día a día', en:'Coffee, breakfast & errands', color:'#57B79A', confidence:'daily', scenes:['Order coffee','Buy breakfast','Laundry','Ask for help']},
  {id:'social', n:3, icon:'👥', title:'Con la gente', en:'Small talk & making friends', color:'#DB6A6A', confidence:'social', scenes:['Meet a neighbour','Weekend plans','Introduce yourself','Talk about hobbies']},
  {id:'getting', n:4, icon:'🚗', title:'Moverse', en:'Uber, directions & traffic', color:'#9B7BB8', confidence:'transport', scenes:['Give an address','Ask directions','Explain where to stop','Traffic conversation']},
  {id:'shopping', n:5, icon:'🛒', title:'Compras', en:'Supermarket & market', color:'#E9A33C', confidence:'shopping', scenes:['Find an item','Ask a price','Pay at checkout','Ask for NIT invoice']},
  {id:'food', n:6, icon:'🍽️', title:'Comer fuera', en:'Restaurants & cafés', color:'#57B79A', confidence:'food', scenes:['Get a table','Ask recommendations','Dietary request','Pay the bill']},
  {id:'home', n:7, icon:'🏠', title:'En casa', en:'Apartment & maintenance', color:'#BFAE97', confidence:'home', scenes:['Water issue','Internet problem','Building security','Delivery at the gate']},
  {id:'money', n:8, icon:'🏦', title:'Dinero y banco', en:'Banking & payments', color:'#9B7BB8', confidence:'bank', scenes:['Cash withdrawal','Exchange money','Card problem','Bank appointment']},
  {id:'health', n:9, icon:'🏥', title:'Salud', en:'Pharmacy & doctor', color:'#DB6A6A', confidence:'health', scenes:['Explain symptoms','Buy medicine','Book an appointment','Emergency help']},
  {id:'business', n:10, icon:'💼', title:'Trabajo', en:'General business Spanish', color:'#E9A33C', confidence:'business', scenes:['Meeting update','Vendor call','Give feedback','Explain a delay']},
];

export const CHARACTERS = [
  {id:'maria', avatar:'☕', name:'María', role:'Café owner', note:'Warm, quick speech.', chapter:'daily'},
  {id:'jose', avatar:'🚕', name:'José', role:'Uber driver', note:'Talkative and relaxed.', chapter:'getting'},
  {id:'ana', avatar:'🏥', name:'Dra. Ana', role:'Doctor', note:'Clear formal Spanish.', chapter:'health'},
  {id:'diego', avatar:'🏦', name:'Diego', role:'Bank adviser', note:'Polite and detailed.', chapter:'money'},
  {id:'sofia', avatar:'👥', name:'Sofía', role:'Friend', note:'Natural informal Spanish.', chapter:'social'},
  {id:'miguel', avatar:'🛡️', name:'Miguel', role:'Building security', note:'Daily greetings and access.', chapter:'home'},
];

export const MISSIONS = [
  {id:'coffee', icon:'☕', title:'Order completely in Spanish', place:'Coffee shop', prompt:'Order your drink, make one modification, and thank the person naturally.', coach:'Try: “Buenos días. ¿Me regala un americano grande, sin azúcar, por favor?”', confidence:'daily'},
  {id:'guard', icon:'🛡️', title:'Start a 30-second conversation', place:'Building / security', prompt:'Greet the guard and ask how their morning is going.', coach:'Try: “Buenos días, ¿cómo amaneció? ¿Todo tranquilo hoy?”', confidence:'social'},
  {id:'directions', icon:'🧭', title:'Ask where something is', place:'Outside', prompt:'Ask someone where a pharmacy, shop or entrance is located.', coach:'Try: “Disculpe, ¿dónde queda la farmacia más cercana?”', confidence:'transport'},
  {id:'groceries', icon:'🛒', title:'Do checkout in Spanish', place:'Supermarket', prompt:'Handle greeting, NIT/factura, payment and goodbye in Spanish.', coach:'Useful: “Sin NIT, gracias. Con tarjeta. Muchas gracias, que le vaya bien.”', confidence:'shopping'},
  {id:'restaurant', icon:'🍽️', title:'Ask for a recommendation', place:'Restaurant', prompt:'Ask what they recommend and one question about the dish.', coach:'Try: “¿Cuál me recomienda? ¿Qué lleva este plato?”', confidence:'food'},
  {id:'smalltalk', icon:'👥', title:'Ask one follow-up question', place:'Anywhere social', prompt:'When someone tells you something, ask one natural follow-up instead of switching to English.', coach:'Useful: “¿Y después qué pasó?” / “¿Y usted?” / “¿Desde cuándo?”', confidence:'social'},
  {id:'phone', icon:'📞', title:'Make one short phone call', place:'Phone', prompt:'Ask for information, confirm it, and close the call in Spanish.', coach:'Start: “Buenas tardes. Le llamo para confirmar…”', confidence:'daily'},
];

const t = (prompt, expected, model, tips=[]) => ({prompt, expected, model, tips});

export const SCENARIOS = [
  {
    id:'coffee-roleplay', chapter:'daily', character:'maria', title:'Your usual coffee', en:'Order, change something, make small talk',
    turns:[
      t(['¡Buenos días! ¿Lo de siempre o quiere probar algo diferente hoy?','Buenos días. ¿Qué le preparo hoy?'],['buenos días','me regala','por favor'],'Buenos días, María. Hoy quiero algo diferente. ¿Me regala un cappuccino mediano, sin azúcar, por favor?',['Use “¿Me regala…?” for a natural Guatemalan request.']),
      t(['Claro. ¿Lo quiere caliente o frío?','Perfecto. ¿Con leche normal o deslactosada?'],['quiero','caliente'],'Lo quiero caliente y con leche normal, gracias.',['A full sentence helps speaking confidence.']),
      t(['Muy bien. ¿Y qué tal su mañana?','Listo. ¿Tiene mucho que hacer hoy?'],['bien','hoy'],'Bien, gracias. Hoy tengo algunas cosas que hacer, pero todo tranquilo. ¿Y usted?',['Throw the conversation back with “¿Y usted?”'])
    ]
  },
  {
    id:'uber-roleplay', chapter:'getting', character:'jose', title:'Taxi / Uber ride', en:'Route, traffic and where to stop',
    turns:[
      t(['Buenas, ¿vamos por la Reforma o prefiere otra ruta?','¿Prefiere la ruta rápida o evitar el tráfico?'],['prefiero','tráfico'],'Prefiero la ruta con menos tráfico, por favor.',['“Prefiero…” is softer than a command.']),
      t(['¿Lleva mucho tiempo viviendo en Guatemala?','¿Es de aquí o está de visita?'],['vivo','guatemala'],'Vivo aquí desde hace un tiempo. Todavía estoy aprendiendo español.',['Use present tense for something still true.']),
      t(['Ya casi llegamos. ¿Dónde lo dejo?','¿Está bien aquí o sigo un poco más?'],['aquí','bien'],'Aquí está bien, muchas gracias. Que le vaya bien.',['Memorise “Aquí está bien”.'])
    ]
  },
  {
    id:'friend-roleplay', chapter:'social', character:'sofia', title:'Weekend conversation', en:'Past, plans and follow-up questions',
    turns:[
      t(['¡Hola! ¿Qué hiciste este fin de semana?','Cuéntame, ¿cómo estuvo tu fin de semana?'],['fui','estuve'],'El sábado fui a comer y después estuve en casa. ¿Y tú?',['Use fui/estuve for completed actions.']),
      t(['Yo salí con unos amigos. ¿Te gusta salir o prefieres planes tranquilos?','Fui a Antigua. ¿Has ido últimamente?'],['me gusta','prefiero'],'Me gusta salir, pero también prefiero planes tranquilos algunos días.',['Me gusta + infinitive.']),
      t(['¿Y qué vas a hacer el próximo fin de semana?','¿Tienes planes para el sábado?'],['voy a','sábado'],'El sábado voy a descansar un poco y después voy a salir.',['Use “voy a + infinitive” for plans.'])
    ]
  },
  {
    id:'market-roleplay', chapter:'shopping', character:null, title:'At the market', en:'Price, quantity and friendly bargaining',
    turns:[
      t(['Pase adelante. ¿Qué está buscando?','Buenas, ¿qué le doy?'],['busco','aguacate'],'Buenas. Busco aguacates. ¿A cómo están?',['“Busco…” is useful when shopping.']),
      t(['Tres por diez. ¿Cuántos quiere?','Están a cuatro cada uno.'],['llevo','seis'],'Si llevo seis, ¿me hace un descuento?',['Use “si llevo…” to negotiate.']),
      t(['Se los dejo más baratos. ¿Algo más?','Está bien. ¿Quiere algo más?'],['eso es todo','gracias'],'Eso es todo, muchas gracias. Que le vaya bien.',['Close warmly.'])
    ]
  },
  {
    id:'restaurant-roleplay', chapter:'food', character:null, title:'Dinner out', en:'Table, recommendation and payment',
    turns:[
      t(['Buenas noches. ¿Mesa para cuántos?','Bienvenidos. ¿Cuántas personas?'],['para dos','por favor'],'Para dos, por favor.',['Short and natural is fine.']),
      t(['Aquí tienen el menú. ¿Ya saben qué van a pedir?','¿Les recomiendo algo?'],['recomienda','sin picante'],'¿Cuál me recomienda? Para mí, algo sin mucho picante.',['Ask for a recommendation instead of defaulting to English.']),
      t(['¿Desean algo más?','¿Todo bien con la comida?'],['cuenta','por favor'],'Todo muy bien, gracias. La cuenta, por favor.',['“La cuenta, por favor” is enough.'])
    ]
  },
  {
    id:'maintenance-roleplay', chapter:'home', character:'miguel', title:'Apartment problem', en:'Explain the issue and arrange help',
    turns:[
      t(['Buenas tardes. ¿En qué le puedo ayudar?','Buenas, ¿qué problema tiene?'],['problema','desde'],'Fíjese que tengo un problema con el agua desde esta mañana.',['“Fíjese que…” softens bad news.']),
      t(['¿No tiene agua en todo el apartamento?','¿Es solo en la cocina o en todo el apartamento?'],['todo','apartamento'],'No hay agua en todo el apartamento.',['Use “hay/no hay”.']),
      t(['Voy a llamar a mantenimiento. ¿Puede estar en casa en una hora?','Mantenimiento puede llegar esta tarde. ¿Le funciona?'],['sí','puedo'],'Sí, puedo estar aquí. Muchas gracias por ayudarme.',['Confirm clearly.'])
    ]
  },
  {
    id:'bank-roleplay', chapter:'money', character:'diego', title:'Card problem', en:'Explain a declined card and ask for action',
    turns:[
      t(['Buenas tardes. Cuénteme, ¿qué problema tiene con la tarjeta?','¿En qué le puedo ayudar con su cuenta?'],['tarjeta','rechazada'],'Mi tarjeta fue rechazada ayer dos veces, pero tengo fondos.',['Explain what happened first.']),
      t(['¿Fue una compra local o internacional?','¿Recuerda dónde intentó pagar?'],['compra','local'],'Fue una compra local en un restaurante.',['Keep answers specific.']),
      t(['Voy a revisarlo. ¿Quiere que desbloqueemos la tarjeta si no hay problema?','Parece un bloqueo de seguridad. ¿Desea que lo quite?'],['sí','por favor'],'Sí, por favor. Quisiera que la desbloquearan.',['“Quisiera…” is polite.'])
    ]
  },
  {
    id:'doctor-roleplay', chapter:'health', character:'ana', title:'At the doctor', en:'Symptoms, duration and follow-up',
    turns:[
      t(['Buenos días. ¿Qué le pasa y desde cuándo se siente así?','¿Qué síntomas tiene?'],['me duele','desde'],'Me duele mucho la cabeza desde ayer y me siento mareado.',['Pain uses “me duele…”.']),
      t(['¿Tiene fiebre, tos o náusea?','¿Ha tenido fiebre?'],['no tengo','fiebre'],'No tengo fiebre, pero estoy un poco cansado.',['Use tener for fever.']),
      t(['¿Ha tomado algún medicamento?','¿Tomó algo para el dolor?'],['tomé','acetaminofén'],'Sí, tomé acetaminofén esta mañana.',['Use preterite for completed action.'])
    ]
  },
  {
    id:'pharmacy-roleplay', chapter:'health', character:null, title:'At the pharmacy', en:'Ask for medicine and understand instructions',
    turns:[
      t(['Buenas tardes, ¿qué necesita?','¿En qué le puedo ayudar?'],['algo para','dolor'],'¿Tiene algo para el dolor de cabeza?',['“¿Tiene algo para…?” is very reusable.']),
      t(['¿Tiene alguna alergia?','¿Es alérgico a algún medicamento?'],['no soy','alérgico'],'No soy alérgico a ningún medicamento.',['Use “ser alérgico”.']),
      t(['Tome una cada ocho horas.','Una tableta cada ocho horas con comida.'],['cada ocho horas','comida'],'Entendido: una cada ocho horas con comida. Gracias.',['Repeat instructions back to confirm.'])
    ]
  },
  {
    id:'neighbour-roleplay', chapter:'social', character:'sofia', title:'New neighbour', en:'Introduce yourself and keep small talk going',
    turns:[
      t(['Hola, creo que no nos conocemos. Soy Sofía.','Buenos días, soy su vecina. ¿Cómo se llama?'],['mucho gusto','soy'],'Mucho gusto, soy Richard. Vivo aquí desde hace poco.',['Introduce yourself simply.']),
      t(['¿De dónde es?','¿Es nuevo en Guatemala?'],['soy de','vivo aquí'],'Soy de Nigeria y vivo aquí en Guatemala.',['Origin uses ser.']),
      t(['¿Y qué le gusta hacer los fines de semana?','¿Qué hace normalmente el fin de semana?'],['me gusta','fin de semana'],'Me gusta salir a comer, caminar y conocer lugares nuevos. ¿Y a usted?',['Finish with a follow-up.'])
    ]
  },
  {
    id:'delivery-roleplay', chapter:'home', character:'miguel', title:'Delivery at the gate', en:'Confirm a delivery and give access instructions',
    turns:[
      t(['Jefe, tiene una entrega en la garita.','Hay un mensajero preguntando por usted.'],['entrega','para mí'],'Sí, la entrega es para mí.',['Confirm quickly.']),
      t(['¿Quiere que lo deje pasar?','¿Puede subir el mensajero?'],['puede','subir'],'Sí, puede subir. Por favor, indíquele el apartamento.',['Use formal instruction politely.']),
      t(['Perfecto. ¿Algo más?','Listo, ya va para arriba.'],['gracias','eso es todo'],'Eso es todo, muchas gracias.',['Natural close.'])
    ]
  },
  {
    id:'phone-roleplay', chapter:'daily', character:null, title:'A short phone call', en:'Ask, confirm and close without switching to English',
    turns:[
      t(['Buenas tardes, ¿en qué le puedo ayudar?','Buenas tardes. ¿Con quién desea hablar?'],['llamo para','confirmar'],'Buenas tardes. Llamo para confirmar una cita.',['“Llamo para…” gives purpose immediately.']),
      t(['Claro. ¿A nombre de quién está?','¿Me da su nombre, por favor?'],['a nombre de','richard'],'Está a nombre de Richard.',['Useful phone phrase.']),
      t(['Sí, está confirmada para mañana a las diez.','Perfecto, lo esperamos mañana a las diez.'],['mañana','diez','gracias'],'Perfecto, mañana a las diez. Muchas gracias por confirmarlo.',['Repeat the key detail back.'])
    ]
  },
];

export const CONFIDENCE_LABELS = {
 arrival:'Arrival', daily:'Daily life', social:'Social', transport:'Getting around', shopping:'Shopping', food:'Restaurants', home:'Home', bank:'Banking', health:'Health', business:'Business'
};
