export const PRONUNCIATION_SETS = [
  {
    id:'r-vs-rr', icon:'🌀', title:'R vs RR', level:'Core',
    sound:'r / rr',
    mouth:'Keep the tongue tip close to the ridge behind your upper teeth. For RR, let air make the tongue vibrate rather than forcing it.',
    note:'A single r is lighter; rr or word-initial r is stronger.',
    examples:[
      {word:'pero', meaning:'but', target:'pero', syllables:'pe-ro', stress:1},
      {word:'perro', meaning:'dog', target:'perro', syllables:'pe-rro', stress:1},
      {word:'caro', meaning:'expensive', target:'caro', syllables:'ca-ro', stress:1},
      {word:'carro', meaning:'car', target:'carro', syllables:'ca-rro', stress:1},
      {word:'rápido', meaning:'fast', target:'rápido', syllables:'rá-pi-do', stress:0},
    ]
  },
  {
    id:'j', icon:'🌬️', title:'J / G fuerte', level:'Core',
    sound:'j / ge / gi',
    mouth:'Make a soft friction sound at the back of the mouth. Do not use the English J sound.',
    note:'Think of warm air passing through the back of your throat.',
    examples:[
      {word:'jefe', meaning:'boss', target:'jefe', syllables:'je-fe', stress:0},
      {word:'Guatemala', meaning:'Guatemala', target:'Guatemala', syllables:'Gua-te-ma-la', stress:2},
      {word:'trabajo', meaning:'work', target:'trabajo', syllables:'tra-ba-jo', stress:1},
      {word:'gente', meaning:'people', target:'gente', syllables:'gen-te', stress:0},
    ]
  },
  {
    id:'ll-y', icon:'🗣️', title:'LL / Y', level:'Useful',
    sound:'ll / y',
    mouth:'For most Latin American accents, use a smooth y-like sound. Keep it light and connected.',
    note:'Do not over-pronounce it like an English “j”.',
    examples:[
      {word:'calle', meaning:'street', target:'calle', syllables:'ca-lle', stress:0},
      {word:'llave', meaning:'key', target:'llave', syllables:'lla-ve', stress:0},
      {word:'yo', meaning:'I', target:'yo', syllables:'yo', stress:0},
      {word:'ayuda', meaning:'help', target:'ayuda', syllables:'a-yu-da', stress:1},
    ]
  },
  {
    id:'b-v', icon:'👄', title:'B and V', level:'Useful',
    sound:'b / v',
    mouth:'In Spanish, B and V are usually very similar. Use the lips gently; do not force an English V with teeth on the lower lip.',
    note:'At the start of a phrase the sound is firmer; between vowels it becomes softer.',
    examples:[
      {word:'vino', meaning:'wine', target:'vino', syllables:'vi-no', stress:0},
      {word:'banco', meaning:'bank', target:'banco', syllables:'ban-co', stress:0},
      {word:'vivir', meaning:'to live', target:'vivir', syllables:'vi-vir', stress:1},
      {word:'trabajo', meaning:'work', target:'trabajo', syllables:'tra-ba-jo', stress:1},
    ]
  },
  {
    id:'vowels', icon:'🎵', title:'Pure vowels', level:'Essential',
    sound:'a e i o u',
    mouth:'Spanish vowels stay short and pure. Avoid sliding into an extra sound at the end like English often does.',
    note:'Keep each vowel stable from start to finish.',
    examples:[
      {word:'casa', meaning:'house', target:'casa', syllables:'ca-sa', stress:0},
      {word:'mesa', meaning:'table', target:'mesa', syllables:'me-sa', stress:0},
      {word:'vino', meaning:'wine', target:'vino', syllables:'vi-no', stress:0},
      {word:'poco', meaning:'little', target:'poco', syllables:'po-co', stress:0},
      {word:'uno', meaning:'one', target:'uno', syllables:'u-no', stress:0},
    ]
  },
  {
    id:'stress', icon:'🎯', title:'Word stress', level:'Essential',
    sound:'stress',
    mouth:'Make the stressed syllable slightly longer and clearer, not dramatically louder.',
    note:'Accent marks tell you exactly where the stress goes.',
    examples:[
      {word:'teléfono', meaning:'phone', target:'teléfono', syllables:'te-lé-fo-no', stress:1},
      {word:'también', meaning:'also', target:'también', syllables:'tam-bién', stress:1},
      {word:'rápido', meaning:'fast', target:'rápido', syllables:'rá-pi-do', stress:0},
      {word:'camión', meaning:'truck', target:'camión', syllables:'ca-mión', stress:1},
    ]
  }
];

export const SHADOW_PHRASES = [
  {id:'p1',topic:'Greeting',text:'Buenos días, ¿cómo amaneció?',chunks:['Buenos días','¿cómo amaneció?']},
  {id:'p2',topic:'Coffee',text:'¿Me regala un café americano sin azúcar, por favor?',chunks:['¿Me regala un café americano','sin azúcar','por favor?']},
  {id:'p3',topic:'Taxi',text:'Aquí está bien, muchas gracias. Que le vaya bien.',chunks:['Aquí está bien','muchas gracias','Que le vaya bien']},
  {id:'p4',topic:'Restaurant',text:'¿Cuál me recomienda? Quisiera algo sin mucho picante.',chunks:['¿Cuál me recomienda?','Quisiera algo','sin mucho picante']},
  {id:'p5',topic:'Home',text:'Fíjese que tengo un problema con el agua desde esta mañana.',chunks:['Fíjese que','tengo un problema con el agua','desde esta mañana']},
  {id:'p6',topic:'Social',text:'El sábado fui a comer y después estuve en casa.',chunks:['El sábado','fui a comer','y después estuve en casa']},
  {id:'p7',topic:'Bank',text:'Mi tarjeta fue rechazada, pero tengo fondos disponibles.',chunks:['Mi tarjeta fue rechazada','pero tengo fondos disponibles']},
  {id:'p8',topic:'Health',text:'Me duele la cabeza desde ayer y me siento un poco mareado.',chunks:['Me duele la cabeza','desde ayer','y me siento un poco mareado']}
];
