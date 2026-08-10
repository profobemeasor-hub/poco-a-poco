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
  {id:'maria', avatar:'☕', name:'María', role:'Café owner', note:'Warm, quick speech. Remembers your usual order.', chapter:'daily'},
  {id:'jose', avatar:'🚕', name:'José', role:'Uber driver', note:'Talkative. Likes football, traffic and weekend chat.', chapter:'getting'},
  {id:'ana', avatar:'🏥', name:'Dra. Ana', role:'Doctor', note:'Clear formal Spanish. Asks follow-up questions.', chapter:'health'},
  {id:'diego', avatar:'🏦', name:'Diego', role:'Bank adviser', note:'Polite, formal and detail-oriented.', chapter:'money'},
  {id:'sofia', avatar:'👥', name:'Sofía', role:'Friend', note:'Natural informal Spanish and social conversation.', chapter:'social'},
  {id:'miguel', avatar:'🛡️', name:'Miguel', role:'Building security', note:'Daily greetings, deliveries and apartment access.', chapter:'home'},
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

export const SCENARIOS = [
 {id:'coffee-roleplay', chapter:'daily', character:'maria', title:'Your usual coffee', en:'Order, change something, make small talk', opener:'¡Buenos días! ¿Lo de siempre o quiere probar algo diferente hoy?', expected:['Buenos días','me regala','por favor'], model:'Buenos días, María. Hoy quiero algo diferente. ¿Me regala un cappuccino mediano, sin azúcar, por favor?', tips:['Use “¿Me regala…?” for a natural Guatemalan request.','Add one social line: “¿Qué tal su día?”']},
 {id:'uber-roleplay', chapter:'getting', character:'jose', title:'Traffic and route', en:'Tell the driver where and discuss traffic', opener:'Buenas, ¿vamos por la Reforma o prefiere otra ruta?', expected:['prefiero','tráfico'], model:'Buenas. Prefiero ir por la Reforma si hay menos tráfico. Si no, la ruta que usted recomiende está bien.', tips:['“Prefiero…” is softer than a command.','Use “Aquí está bien” when you want to stop.']},
 {id:'friend-roleplay', chapter:'social', character:'sofia', title:'Weekend plans', en:'Talk about what you did and what is next', opener:'¡Hola! ¿Qué hiciste este fin de semana?', expected:['fui','estuve','voy'], model:'El sábado fui a comer y después estuve en casa. Mañana voy a salir a caminar un rato. ¿Y tú?', tips:['Use fui/estuve for completed past actions.','Always throw the conversation back: “¿Y tú?”']},
 {id:'market-roleplay', chapter:'shopping', character:null, title:'At the market', en:'Ask price and negotiate politely', opener:'Pase adelante. ¿Qué está buscando?', expected:['a cómo','descuento'], model:'Buenas. ¿A cómo están los aguacates? Si llevo seis, ¿me hace un descuento?', tips:['“¿A cómo?” is very natural in a market.','Keep bargaining friendly.']},
 {id:'restaurant-roleplay', chapter:'food', character:null, title:'Dinner out', en:'Get a table and order', opener:'Buenas noches. ¿Mesa para cuántos?', expected:['para dos','recomienda'], model:'Para dos, por favor. ¿Cuál me recomienda hoy? Y para mí, sin mucho picante.', tips:['“¿Cuál me recomienda?” keeps the conversation natural.','Use “para mí” when ordering your own dish.']},
 {id:'maintenance-roleplay', chapter:'home', character:'miguel', title:'Apartment problem', en:'Explain a water/internet issue', opener:'Buenas tardes. ¿En qué le puedo ayudar?', expected:['problema','desde'], model:'Buenas tardes. Fíjese que tengo un problema con el agua desde esta mañana. ¿Me puede ayudar a contactar mantenimiento?', tips:['“Fíjese que…” softens the start of a problem.','Use “desde” to say since when.']},
 {id:'bank-roleplay', chapter:'money', character:'diego', title:'Card problem', en:'Explain a declined card', opener:'Buenas tardes. Cuénteme, ¿qué problema tiene con la tarjeta?', expected:['tarjeta','rechazada','ayer'], model:'Buenas tardes. Mi tarjeta fue rechazada ayer dos veces, pero tengo fondos. Quisiera saber si hay algún bloqueo.', tips:['Quisiera is polite and professional.','Explain what happened before asking for action.']},
 {id:'doctor-roleplay', chapter:'health', character:'ana', title:'At the doctor', en:'Describe symptoms clearly', opener:'Buenos días. ¿Qué le pasa y desde cuándo se siente así?', expected:['me duele','desde'], model:'Buenos días. Me duele mucho la cabeza desde ayer y también me siento un poco mareado.', tips:['Body pain uses “me duele…”.','“Desde ayer” = since yesterday.']},
];

export const CONFIDENCE_LABELS = {
 arrival:'Arrival', daily:'Daily life', social:'Social', transport:'Getting around', shopping:'Shopping', food:'Restaurants', home:'Home', bank:'Banking', health:'Health', business:'Business'
};
