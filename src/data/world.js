export const WORLD_LOCATIONS = [
  {id:'apartment',icon:'🏠',name:'Apartamento',en:'Home',x:12,y:68,accent:'#BFAE97',cost:0,description:'Start and end the day here. Security, deliveries and maintenance happen around you.',tasks:[
    {id:'greet-guard',title:'Greet security',spanish:'Buenos días, ¿cómo amaneció? ¿Todo tranquilo?',reward:25,relation:'miguel'},
    {id:'delivery',title:'Handle a delivery',spanish:'Sí, la entrega es para mí. Puede subir, por favor.',reward:30,relation:'miguel'},
    {id:'maintenance',title:'Report a problem',spanish:'Fíjese que tengo un problema con el agua desde esta mañana.',reward:35,relation:'laura'}]},
  {id:'cafe',icon:'☕',name:'Café',en:'Coffee shop',x:38,y:57,accent:'#E9A33C',cost:28,description:'Order naturally, change your drink and build familiarity with María.',tasks:[
    {id:'coffee-order',title:'Order your drink',spanish:'¿Me regala un americano grande, sin azúcar, por favor?',reward:30,relation:'maria'},
    {id:'coffee-smalltalk',title:'Make small talk',spanish:'Todo bien, gracias. ¿Y usted, cómo va su mañana?',reward:35,relation:'maria'}]},
  {id:'supermarket',icon:'🛒',name:'Supermercado',en:'Supermarket',x:68,y:61,accent:'#57B79A',cost:145,description:'Find products, deal with checkout, NIT and payment.',tasks:[
    {id:'find-item',title:'Ask for an item',spanish:'Disculpe, ¿dónde puedo encontrar agua pura?',reward:30},
    {id:'checkout',title:'Do checkout in Spanish',spanish:'Sin NIT, gracias. Con tarjeta, por favor.',reward:35}]},
  {id:'bank',icon:'🏦',name:'Banco',en:'Bank',x:68,y:31,accent:'#9B7BB8',cost:0,description:'Handle card issues, cash and appointments with Diego.',tasks:[
    {id:'card-help',title:'Explain a card problem',spanish:'Mi tarjeta fue rechazada, pero tengo fondos en la cuenta.',reward:45,relation:'diego'},
    {id:'withdrawal',title:'Ask about cash withdrawal',spanish:'Quisiera retirar efectivo, por favor.',reward:35,relation:'diego'}]},
  {id:'restaurant',icon:'🍽️',name:'Restaurante',en:'Restaurant',x:39,y:31,accent:'#DB6A6A',cost:115,description:'Get a table, ask for recommendations, order and pay.',tasks:[
    {id:'table',title:'Get a table',spanish:'Buenas noches. ¿Tiene mesa para dos?',reward:30,relation:'lucia'},
    {id:'recommend',title:'Ask for a recommendation',spanish:'¿Cuál me recomienda? Quisiera algo sin mucho picante.',reward:40,relation:'lucia'},
    {id:'bill',title:'Ask for the bill',spanish:'Todo estuvo muy bien, gracias. La cuenta, por favor.',reward:30,relation:'lucia'}]},
  {id:'pharmacy',icon:'💊',name:'Farmacia',en:'Pharmacy',x:12,y:34,accent:'#DB6A6A',cost:42,description:'Explain symptoms and understand medicine instructions.',tasks:[
    {id:'medicine',title:'Ask for medicine',spanish:'¿Tiene algo para el dolor de cabeza?',reward:35,relation:'ana'},
    {id:'instructions',title:'Confirm instructions',spanish:'Entonces, una cada ocho horas con comida, ¿verdad?',reward:40,relation:'ana'}]},
  {id:'uber',icon:'🚕',name:'Uber / Taxi',en:'Getting around',x:26,y:47,accent:'#9B7BB8',cost:65,description:'Choose a route, talk about traffic and tell José where to stop.',tasks:[
    {id:'route',title:'Choose the route',spanish:'Prefiero la ruta con menos tráfico, por favor.',reward:30,relation:'jose'},
    {id:'stop',title:'Tell the driver to stop',spanish:'Aquí está bien, muchas gracias. Que le vaya bien.',reward:30,relation:'jose'}]},
  {id:'airport',icon:'✈️',name:'Aeropuerto',en:'Airport',x:87,y:14,accent:'#E9A33C',cost:0,description:'Travel, immigration and practical airport Spanish.',tasks:[
    {id:'purpose',title:'Explain your purpose',spanish:'Vengo por trabajo y voy a estar varios meses.',reward:50,relation:'officer'},
    {id:'bag',title:'Ask about luggage',spanish:'Disculpe, ¿dónde recojo mi equipaje?',reward:35}]},
  {id:'antigua',icon:'🌋',name:'Antigua',en:'Weekend trip',x:86,y:77,accent:'#57B79A',cost:220,description:'A weekend destination for directions, food and social conversation.',tasks:[
    {id:'weekend-plan',title:'Talk about your plan',spanish:'Voy a pasar el día aquí y quiero conocer el centro.',reward:45,relation:'sofia'},
    {id:'recommend-place',title:'Ask what to see',spanish:'¿Qué lugar me recomienda visitar primero?',reward:40}]}
];

export const WORLD_EVENTS = [
  {id:'rain',icon:'🌧️',title:'Heavy rain',text:'Está lloviendo fuerte. Your outdoor plan changed.',phrase:'Está lloviendo mucho. ¿Podemos ir más tarde?',area:'transport'},
  {id:'internet',icon:'📶',title:'Internet problem',text:'Your apartment internet stopped working.',phrase:'Fíjese que el internet no está funcionando desde hace una hora.',area:'home'},
  {id:'uber-cancel',icon:'🚕',title:'Uber cancelled',text:'Your driver cancelled and you need another option.',phrase:'Se canceló mi viaje. ¿Me puede ayudar a pedir otro?',area:'transport'},
  {id:'invite',icon:'👥',title:'Unexpected invitation',text:'Sofía invited you out this evening.',phrase:'¡Gracias por invitarme! ¿A qué hora nos vemos?',area:'social'},
  {id:'card',icon:'💳',title:'Card declined',text:'Your card was declined at checkout.',phrase:'Mi tarjeta fue rechazada. ¿Puedo pagar con otra tarjeta?',area:'bank'},
  {id:'closed',icon:'🚪',title:'Place closed',text:'The place you planned to visit is closed.',phrase:'¿Sabe a qué hora abren mañana?',area:'daily'},
  {id:'delivery',icon:'📦',title:'Delivery at the gate',text:'Security called about a package.',phrase:'Sí, es para mí. Puede dejarlo en recepción, por favor.',area:'home'}
];

export const WORLD_ACHIEVEMENTS = [
  {id:'first-trip',icon:'🗺️',title:'First steps',rule:'Visit 3 different locations'},
  {id:'coffee-regular',icon:'☕',title:'Regular customer',rule:'Complete 3 café interactions'},
  {id:'city-life',icon:'🏙️',title:'City life',rule:'Complete 8 world tasks'},
  {id:'weekend',icon:'🌋',title:'Weekend explorer',rule:'Visit Antigua'},
  {id:'independent',icon:'🏆',title:'Living independently',rule:'Complete tasks in 6 different locations'}
];

export const RELATIONSHIP_PEOPLE = {
  maria:{name:'María',icon:'☕',role:'Café owner'},jose:{name:'José',icon:'🚕',role:'Uber driver'},
  sofia:{name:'Sofía',icon:'👥',role:'Friend'},miguel:{name:'Miguel',icon:'🛡️',role:'Security'},
  ana:{name:'Dra. Ana',icon:'🏥',role:'Doctor'},diego:{name:'Diego',icon:'🏦',role:'Bank adviser'},
  lucia:{name:'Lucía',icon:'🍽️',role:'Restaurant server'},laura:{name:'Laura',icon:'🏠',role:'Property manager'},
  officer:{name:'Oficial',icon:'✈️',role:'Immigration'}
};
