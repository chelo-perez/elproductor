import { useState, useEffect, useRef } from "react";
import { Clapperboard, User, Zap, Megaphone, Star, Users, Wallet, Ticket, TrendingUp, TrendingDown, Trophy, Share2, RefreshCw, Film, ImageDown, Award, Heart, Skull, Drama, Sparkles, Rocket, Bomb, Swords, Video, CircleUserRound, Banknote, Coins, Eye, Music } from "lucide-react";

// =====================================================================
// CONTENIDO
// =====================================================================
// Regla de títulos: sustantivos femeninos + adjetivos femeninos o invariables → siempre concuerdan.
const SUSTANTIVOS = ["Arma","Venganza","Misión","Búsqueda","Fuerza","Justicia","Presa","Tormenta","Amenaza","Sombra","Cacería","Fuga","Trampa","Sentencia","Conspiración","Alianza","Jugada","Deuda","Guerra","Verdad","Traición","Frontera","Furia","Caída","Ruta","Persecución","Operación","Zona","Noche","Batalla","Máquina","Ley","Máscara","Señal","Marea","Herencia"];
const ADJETIVOS = ["Mortal","Implacable","Imposible","Letal","Suprema","Fatal","Inminente","Ciega","Extrema","Final","Perdida","Salvaje","Silenciosa","Infernal","Absoluta","Oscura","Prohibida","Inmortal","Total","Brutal","Secreta","Perfecta","Cruel","Feroz","Sangrienta","Eterna","Fugaz","Máxima","Definitiva","Peligrosa","Invisible","Radical","Terminal","Global","Rota","Inquebrantable"];

// Cada género trae su paleta: la app entera cambia de acento cuando se revela.
const GENEROS = [
  { id:"accion", nombre:"Acción", publico:38, costoBase:60, tag:"Explosiones, persecuciones y una cuenta regresiva.", pal:{ bg:"#1A0B05", bg2:"#4A1A08", acc:"#FF7A1A", ink:"#FFF3E6" } },
  { id:"comedia", nombre:"Comedia romántica", publico:22, costoBase:25, tag:"Se odian, se enamoran, hay una boda.", pal:{ bg:"#FFE7EE", bg2:"#FFC2D1", acc:"#E0457B", ink:"#3A1020" } },
  { id:"terror", nombre:"Terror", publico:18, costoBase:15, tag:"Nadie debería haber entrado a esa casa.", pal:{ bg:"#050505", bg2:"#1A0000", acc:"#C1121F", ink:"#E8E8E8" } },
  { id:"drama", nombre:"Drama", publico:12, costoBase:20, tag:"Una historia que te va a partir al medio.", pal:{ bg:"#2B2118", bg2:"#5C4632", acc:"#D4A86A", ink:"#F5EBDD" } },
  { id:"animacion", nombre:"Animación", publico:30, costoBase:70, tag:"Para toda la familia, con un chiste para los padres.", pal:{ bg:"#1E6FE0", bg2:"#7CC4FF", acc:"#FFD23F", ink:"#FFFFFF" } },
  { id:"scifi", nombre:"Ciencia ficción", publico:26, costoBase:80, tag:"El futuro llegó y no es lo que esperábamos.", pal:{ bg:"#04101F", bg2:"#0E2A4F", acc:"#3EE8FF", ink:"#E6F7FF" } },
  { id:"super", nombre:"Superhéroes", publico:42, costoBase:120, tag:"La ciudad tiene un problema y una sola persona con capa.", pal:{ bg:"#080C24", bg2:"#1D2C7A", acc:"#FFCC00", ink:"#FFFFFF" }, motivo:"accion" },
  { id:"suspenso", nombre:"Suspenso", publico:16, costoBase:25, tag:"Alguien miente. Quizás todos.", pal:{ bg:"#07090D", bg2:"#1C2431", acc:"#8FC1E8", ink:"#E9EFF5" }, motivo:"drama" },
  { id:"musical", nombre:"Musical", publico:14, costoBase:40, tag:"Cuando las palabras no alcanzan, se canta.", pal:{ bg:"#25082F", bg2:"#6B1C7E", acc:"#FFD166", ink:"#FFF3FA" }, motivo:"comedia" },
];
const PROTAGONISTAS = ["Un policía suspendido con una última oportunidad","Una contadora que descubre un fraude enorme","Un ex marine con un pasado que no cuenta","Una adolescente con un don que no pidió","Un agente retirado al que le secuestran a la hija","Un robot que empieza a sentir","Un sacerdote en plena crisis de fe","Una chef que perdió el gusto","Un profesor de pilates con deudas de juego","Una periodista que sabe demasiado","Un taxista nocturno que ve cosas","Una abuela que fue espía y nadie le cree"];
const SITUACIONES = [
  { texto:"Un secuestro con 48 horas de plazo", generos:["accion","drama","suspenso","super"] },
  { texto:"Un virus que no debe caer en manos equivocadas", generos:["accion","scifi","terror","super"] },
  { texto:"Un traidor dentro del equipo", generos:["accion","drama","suspenso","super"] },
  { texto:"Una última misión antes de retirarse", generos:["accion","comedia"] },
  { texto:"Un pueblo que esconde un secreto", generos:["terror","drama","suspenso"] },
  { texto:"Un juego donde perder es morir", generos:["terror","scifi"] },
  { texto:"Una revancha veinte años después", generos:["drama","accion"] },
  { texto:"Una boda que no debería ocurrir", generos:["comedia","drama","musical"] },
  { texto:"Un viaje en el tiempo que salió mal", generos:["scifi","comedia","animacion"] },
  { texto:"Un intercambio de cuerpos", generos:["comedia","animacion","musical"] },
  { texto:"Una mascota que en realidad es un alien", generos:["animacion","scifi","comedia"] },
  { texto:"Un apagón mundial de internet", generos:["scifi","accion","comedia","super"] },
  { texto:"Un villano que quiere exactamente lo mismo que el héroe", generos:["super","accion","animacion"] },
  { texto:"Una desaparición que nadie quiere investigar", generos:["suspenso","terror","drama"] },
  { texto:"Una audición que lo cambia todo", generos:["musical","comedia","drama"] },
  { texto:"Un testigo que recuerda de más", generos:["suspenso","accion","drama"] },
];
const DIRECTORES = [
  { n:"Christopher Nolan", c:5, p:5, k:5, g:["accion","scifi","drama","super","suspenso"], t:["autor"] },{ n:"Steven Spielberg", c:5, p:5, k:5, g:["accion","scifi","drama","animacion"], t:["veterano"] },
  { n:"Quentin Tarantino", c:4, p:5, k:4, g:["accion","drama","suspenso"], t:["autor"] },{ n:"Greta Gerwig", c:4, p:5, k:3, g:["comedia","drama","super","musical"], t:["autor"] },
  { n:"Martin Scorsese", c:3, p:5, k:5, g:["drama","suspenso"], t:["autor","veterano"] },{ n:"Michael Bay", c:5, p:2, k:5, g:["accion","scifi","super"], t:["blockbuster"] },
  { n:"James Cameron", c:5, p:4, k:5, g:["accion","scifi","super"], t:["blockbuster","veterano"] },{ n:"Denis Villeneuve", c:4, p:5, k:4, g:["scifi","drama","suspenso"], t:["autor"] },
  { n:"Jordan Peele", c:4, p:5, k:3, g:["terror","comedia","super"], t:["autor"] },{ n:"Nancy Meyers", c:3, p:3, k:3, g:["comedia","musical"], t:["veterano"] },
  { n:"Guillermo del Toro", c:3, p:5, k:4, g:["terror","animacion","drama"], t:["autor"] },{ n:"Wes Anderson", c:2, p:5, k:3, g:["comedia","animacion","drama","musical"], t:["autor"] },
  { n:"Juan José Campanella", c:4, p:5, k:2, g:["drama","comedia","animacion","suspenso"], t:["veterano","ar"] },{ n:"Damián Szifron", c:4, p:4, k:2, g:["comedia","accion","drama","suspenso"], t:["autor","ar"] },
  { n:"Lucrecia Martel", c:1, p:5, k:2, g:["drama","suspenso"], t:["autor","ar"] },{ n:"Pedro Almodóvar", c:2, p:5, k:3, g:["drama","comedia","musical"], t:["autor","veterano","es"] },
];
const ACTORES = [
  { n:"Tom Cruise", c:5, p:3, k:5, g:["accion","scifi","super"], t:["estrella","veterano"] },{ n:"Ricardo Darín", c:4, p:5, k:2, g:["drama","comedia","suspenso"], t:["veterano","ar"] },
  { n:"Keanu Reeves", c:4, p:3, k:4, g:["accion","scifi","suspenso"], t:["estrella"] },{ n:"Dwayne Johnson", c:5, p:2, k:5, g:["accion","comedia","animacion","super"], t:["estrella"] },
  { n:"Guillermo Francella", c:4, p:4, k:2, g:["comedia","drama"], t:["veterano","ar"] },{ n:"Adam Sandler", c:4, p:2, k:4, g:["comedia","drama","musical"], t:["estrella"] },
  { n:"Jason Statham", c:4, p:2, k:3, g:["accion","super"], t:["estrella"] },{ n:"Denzel Washington", c:4, p:5, k:4, g:["accion","drama","suspenso"], t:["veterano"] },
  { n:"Leonardo DiCaprio", c:5, p:5, k:5, g:["drama","accion","suspenso"], t:["estrella"] },{ n:"Timothée Chalamet", c:4, p:4, k:3, g:["drama","scifi","musical"], t:["revelacion"] },
  { n:"Ryan Reynolds", c:5, p:3, k:4, g:["comedia","accion","super","musical"], t:["estrella"] },{ n:"Arnold Schwarzenegger", c:4, p:2, k:4, g:["accion","scifi","super"], t:["estrella","veterano"] },
  { n:"Pedro Pascal", c:5, p:4, k:4, g:["accion","scifi","drama","super"], t:["estrella"] },{ n:"Luis Brandoni", c:3, p:4, k:1, g:["comedia","drama"], t:["veterano","ar"] },
  { n:"Leonardo Sbaraglia", c:3, p:4, k:2, g:["drama","accion","terror","suspenso"], t:["ar"] },{ n:"Gastón Pauls", c:3, p:3, k:1, g:["comedia","drama"], t:["ar"] },
  { n:"Rodrigo de la Serna", c:3, p:4, k:2, g:["drama","accion","suspenso"], t:["ar"] },{ n:"Martín Piroyansky", c:2, p:4, k:1, g:["comedia","drama","musical"], t:["ar"] },
];
const ACTRICES = [
  { n:"Sandra Bullock", c:4, p:3, k:4, g:["comedia","drama","scifi"], t:["estrella"] },{ n:"Meryl Streep", c:3, p:5, k:4, g:["drama","comedia","suspenso","musical"], t:["veterano"] },
  { n:"Margot Robbie", c:5, p:4, k:4, g:["comedia","drama","accion","super","musical"], t:["estrella"] },{ n:"Cate Blanchett", c:3, p:5, k:4, g:["drama","scifi","suspenso"], t:["veterano"] },
  { n:"Zendaya", c:5, p:4, k:4, g:["drama","scifi","comedia","super","musical"], t:["revelacion"] },{ n:"Jennifer Lawrence", c:4, p:4, k:4, g:["drama","comedia","scifi","suspenso"], t:["estrella"] },
  { n:"Natalia Oreiro", c:3, p:3, k:2, g:["comedia","drama","musical"], t:["ar"] },{ n:"Florence Pugh", c:4, p:5, k:3, g:["drama","terror","accion","super","suspenso"], t:["revelacion"] },
  { n:"Emma Stone", c:4, p:5, k:4, g:["comedia","drama","musical"], t:["estrella"] },{ n:"Scarlett Johansson", c:5, p:4, k:5, g:["accion","scifi","drama","super"], t:["estrella"] },
  { n:"Julia Roberts", c:4, p:4, k:4, g:["comedia","drama"], t:["estrella","veterano"] },{ n:"Anne Hathaway", c:4, p:4, k:4, g:["comedia","drama","scifi","musical"], t:["estrella"] },
  { n:"Penélope Cruz", c:3, p:5, k:3, g:["drama","comedia"], t:["veterano","es"] },{ n:"Mercedes Morán", c:3, p:5, k:1, g:["drama","comedia"], t:["veterano","ar"] },
  { n:"Nancy Dupláa", c:3, p:3, k:1, g:["drama","comedia"], t:["ar"] },{ n:"Carla Peterson", c:3, p:3, k:1, g:["comedia","drama"], t:["ar"] },
  { n:"Griselda Siciliani", c:3, p:4, k:1, g:["comedia","drama","musical"], t:["ar"] },{ n:"Celeste Cid", c:3, p:3, k:1, g:["drama","comedia","terror","suspenso"], t:["ar"] },
];
const PRESUPUESTOS = [
  { nombre:"Bajo", desc:"Se filma en tres semanas y en la casa de un amigo.", mult:0.6, base:12, factor:2 },
  { nombre:"Medio", desc:"Hay catering y una escena en helicóptero.", mult:1.6, base:45, factor:7 },
  { nombre:"Blockbuster", desc:"El estudio apostó todo. Hay juguetes antes del estreno.", mult:3.6, base:130, factor:12 },
];
const ICONO_GENERO = { accion: Bomb, comedia: Heart, terror: Skull, drama: Drama, animacion: Sparkles, scifi: Rocket, super: Zap, suspenso: Eye, musical: Music };
// Frases del resultado: varias opciones por caso para que no se repitan
const F = {
  premio: {
    2: ["Arrasó en la temporada de premios. Discurso de seis minutos.", "Noche de gala perfecta: el productor lloró en cámara.", "La orquesta tuvo que cortar el discurso de agradecimiento.", "Temporada de premios de ensueño. Hasta el catering salió bien."],
    1: ["Nominada a mejor película. Perdió, pero la fiesta fue buena.", "Cinco nominaciones. Ninguna estatuilla, muchas selfies.", "Nominada a mejor guion. Perdió contra una película que nadie vio.", "Entró en la terna. El productor practicó el discurso en vano."],
    0: ["Pasó sin pena ni gloria en la temporada de premios.", "Ni una nominación. Ni siquiera al sonido.", "Los premios miraron para otro lado.", "Se mencionó en un podcast de cine. Una vez."],
    "-1": ["El productor fue a recibir el Razzie en persona.", "Se agotaron las entradas de la gala de los Razzie.", "Se convirtió en película de culto por las razones equivocadas.", "Peor película del año según tres críticos y un tío."],
  },
  secuela: {
    si: ["Secuela confirmada para 2028.", "Ya se anunció la trilogía.", "El estudio compró los derechos de la precuela antes del segundo fin de semana.", "Secuela, serie y parque temático en negociación."],
    quizas: ["El estudio evalúa una serie derivada.", "Hay una secuela escrita que nadie se anima a filmar.", "Se habló de una segunda parte. Se sigue hablando.", "El estudio pidió 'ver los números de streaming' antes de decidir."],
    no: ["No hay secuela. Está bien así.", "Nadie pidió una segunda parte.", "El estudio archivó la franquicia con elegancia.", "Quedó como película única. Un clásico de fin de semana lluvioso."],
    reboot: ["Reboot anunciado para dentro de doce años.", "Un director joven ya dijo que quiere 'reimaginarla'.", "En 2038 alguien va a decir que estaba adelantada a su época.", "El estudio prefirió olvidarla. Internet, no."],
  },
  critica: {
    4: ["La crítica se arrodilló.", "Unanimidad en la crítica, algo que no pasaba desde hacía años.", "Los críticos le pidieron una segunda función."],
    3: ["La crítica la trató con respeto.", "Buenas reseñas, con algún 'pero' en el tercer acto.", "La crítica la aprobó. Sin aplaudir, pero la aprobó."],
    2: ["La crítica se aburrió a la mitad.", "Reseñas tibias: 'cumple', 'correcta', 'para ver en casa'.", "La crítica la vio con el reloj en la mano."],
    1: ["La crítica pidió que le devolvieran las dos horas.", "Una reseña se tituló 'Por qué'.", "La crítica la destrozó con una alegría poco profesional."],
  },
  publico: {
    4: ["El público salió aplaudiendo.", "Se agotaron las funciones del primer fin de semana.", "La gente volvió a verla con amigos."],
    3: ["El público la disfrutó.", "Buen boca a boca, sobre todo entre los que fueron sin expectativas.", "El público se rió donde había que reírse. Y en un par de lugares más."],
    2: ["El público la vio con el celular en la mano.", "Nadie se fue, pero nadie la recomendó.", "El público la calificó con tres estrellas 'por el esfuerzo'."],
    1: ["El público se fue antes del final.", "Hubo devoluciones de entradas.", "El público pidió el nombre del responsable."],
  },
  genero: {
    accion: ["La escena de la persecución en moto se volvió meme.", "Se rompieron 14 autos y un helicóptero de utilería."],
    comedia: ["El beso final fue lo más comentado del año.", "La escena de la boda se filmó 43 veces."],
    terror: ["Hubo gente que salió de la sala en la escena del sótano.", "Se prohibió en dos países y eso duplicó la taquilla."],
    drama: ["El monólogo del final se estudia en escuelas de actuación.", "Dura dos horas cuarenta. Nadie miró el reloj."],
    animacion: ["La mascota de la película se vendió más que la película.", "Los chicos la vieron nueve veces. Los padres, nueve veces también."],
    scifi: ["Los fans discutieron la línea temporal durante meses.", "El diseño de la nave se hizo con un presupuesto de 40 pesos y talento."],
    super: ["La escena después de los créditos generó tres teorías y un podcast.", "El traje costó más que el guion. Se nota en los dos."],
    suspenso: ["Nadie adivinó el final. Tampoco el guionista, dicen.", "Se prohibió contar el giro final y la gente lo contó igual."],
    musical: ["La canción del segundo acto quedó pegada por semanas.", "El número de baile en la lluvia se filmó con lluvia de verdad."],
  },
};
const PREMIOS = {
  mayores: ["Oscar", "Globo de Oro", "BAFTA"],
  festivales: ["Palma de Oro en Cannes", "León de Oro en Venecia", "Oso de Oro en Berlín"],
  festivalesSel: ["Cannes", "Venecia", "Berlín", "Toronto", "San Sebastián"],
  ar: ["Cóndor de Plata", "Premio Sur"],
  cats: ["mejor dirección", "mejor actor", "mejor actriz", "mejor guion original", "mejor fotografía", "mejor banda sonora"],
  malas: ["peor película", "peor guion", "peores efectos especiales", "peor remake o secuela"],
};
function premiosDe(nivel, cast, director) {
  const p = [];
  const ar = cast.some((c) => c.t.includes("ar")), es = cast.some((c) => c.t.includes("es")), autor = director.t.includes("autor");
  if (nivel === 2) {
    p.push(`${frase(PREMIOS.mayores)} a mejor película`);
    if (autor || Math.random() < 0.3) p.push(frase(PREMIOS.festivales));
    if (Math.random() < 0.7) p.push(`${frase(PREMIOS.mayores)} a ${frase(PREMIOS.cats)}`);
  }
  if (nivel === 1) {
    p.push(`Nominada al ${frase(PREMIOS.mayores)} a ${frase(PREMIOS.cats)}`);
    if (autor && Math.random() < 0.6) p.push(`Selección oficial en ${frase(PREMIOS.festivalesSel)}`);
  }
  if (nivel >= 1 && ar) p.push(`${frase(PREMIOS.ar)} a ${frase(PREMIOS.cats)}`);
  if (nivel >= 1 && es) p.push(`Goya a ${frase(PREMIOS.cats)}`);
  if (nivel === -1) { p.push("Razzie a peor película"); if (Math.random() < 0.5) p.push(`Razzie a ${frase(PREMIOS.malas.slice(1))}`); }
  return [...new Set(p)];
}
const frase = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// =====================================================================
// FÓRMULA DE ESTRENO
// =====================================================================
function costoDe(f, presupuesto) {
  const cast = [f.director, f.actor1, f.actor2];
  return Math.round((presupuesto.base + cast.reduce((s, c) => s + c.k, 0) * presupuesto.factor) * 1.5); // producción + marketing, en millones enteros
}
function estrenar(f) {
  const { genero, situacion, director, actor1, actor2, presupuesto } = f;
  const cast = [director, actor1, actor2];
  const afin = (c) => c.g.includes(genero.id);
  const afinCount = cast.filter(afin).length;
  const fuera = [actor1, actor2].filter((a) => !afin(a)).length;
  const situAfin = situacion.generos.includes(genero.id);
  const tags = cast.flatMap((c) => c.t);
  const notas = [];
  const comAvg = (director.c + actor1.c + actor2.c) / 3;           // 1..5
  const prestigio = (director.p * 2 + actor1.p + actor2.p) / 4;     // 1..5
  let taq = 1;
  // crítica: parte del prestigio, se mueve fuerte por afinidad y presupuesto
  let critica = 2.6 + prestigio * 1.1 + (afin(director) ? 1.0 : -1.4) + (situAfin ? 0.7 : -0.9) - fuera * 0.5;
  if (presupuesto.nombre === "Blockbuster") critica -= 0.6;
  if (presupuesto.nombre === "Bajo" && (genero.id === "drama" || genero.id === "terror")) { critica += 0.8; notas.push("Filmada con dos mangos y mucha cara: la crítica ama eso."); }
  if (tags.filter((t) => t === "estrella").length >= 2) { critica -= 0.6; taq *= 1.1; notas.push("Dos estrellas en el set: la prensa habló más de los egos que de la película."); }
  if (director.t.includes("autor") && presupuesto.nombre === "Blockbuster") { taq *= 0.85; critica += 0.4; notas.push("Tensión con el estudio: el director cortó la escena de la explosión final."); }
  if (tags.includes("veterano") && tags.includes("revelacion")) { critica += 0.6; taq *= 1.08; notas.push("La química entre veteranía y frescura fue lo más comentado."); }
  if (fuera === 2) { taq *= 1.2; notas.push("Nadie esperaba a este elenco en este género. La gente fue por curiosidad."); }
  if (presupuesto.nombre === "Bajo" && (genero.id === "scifi" || genero.id === "animacion")) { critica -= 1.5; taq *= 0.7; notas.push("Los efectos se notan. Mucho."); }
  if (director.t.includes("blockbuster") && genero.id === "drama") { critica -= 1.2; notas.push("El drama tiene tres persecuciones que nadie pidió."); }
  critica = clamp(critica + rnd(-1.4, 1.4), 1, 10);
  const publico = clamp(1.9 + comAvg * 0.9 + afinCount * 0.5 + (situAfin ? 0.7 : -0.5) + (critica - 5.5) * 0.25 + rnd(-1.3, 1.3), 1, 10);
  // taquilla: público potencial del género × tirón del elenco × presupuesto × boca a boca × azar
  const azar = Math.exp(rnd(-0.45, 0.45));
  const espectadores = genero.publico * Math.pow(comAvg / 5, 1.8) * (0.55 + afinCount * 0.22) * presupuesto.mult * (0.55 + publico / 12) * (situAfin ? 1 : 0.85) * taq * azar;
  const recaudacion = espectadores * 10;
  const total = costoDe(f, presupuesto);
  const resultado = recaudacion - total;
  let nivel = 0;
  if (critica >= 8.3) nivel = 2; else if (critica >= 7.2) nivel = 1; else if (critica <= 3.2) nivel = -1;
  const premio = frase(F.premio[nivel]);
  const premios = premiosDe(nivel, cast, director);
  const secuela = frase(F.secuela[resultado > total * 0.6 ? "si" : resultado > 0 ? "quizas" : resultado < -total * 0.4 && critica < 4.5 ? "reboot" : "no"]);
  const critText = frase(F.critica[critica >= 8 ? 4 : critica >= 6 ? 3 : critica >= 4 ? 2 : 1]);
  const pubText = frase(F.publico[publico >= 8 ? 4 : publico >= 6 ? 3 : publico >= 4 ? 2 : 1]);
  if (Math.random() < 0.6) notas.push(frase(F.genero[genero.id]));
  const notasFinal = notas.sort(() => Math.random() - 0.5).slice(0, 2);
  return { espectadores, recaudacion, costo: total, resultado, critica, publico, premio, premios, nivel, secuela, notas: notasFinal, critText, pubText };
}
const M = (v) => v >= 1000 ? `US$ ${(v / 1000).toFixed(1)} mil M` : `US$ ${Math.round(v)} M`;
const Esp = (v) => v >= 100 ? `${Math.round(v)} millones` : `${v.toFixed(1)} millones`;

// =====================================================================
// SISTEMA VISUAL "NOCHE DE PREMIOS"
// Negro laqueado, oro metálico en degradado, geometría art déco.
// Cinzel (versales de gala) para marca, etiquetas y botones; condensada de póster para el título de la película.
// =====================================================================
const NEGRO = "#070707", LACA = "#121212", MARFIL = "#F3EAD6", ROJO = "#8E1B24", GRIS = "#8C8A82";
const ORO = "#D4A93D", ORO_C = "#F6E6B4", ORO_O = "#8A6A1C";
const GOLD = `linear-gradient(135deg, ${ORO_C} 0%, ${ORO} 45%, ${ORO_O} 100%)`;
const GOLD_H = `linear-gradient(90deg, transparent, ${ORO} 30%, ${ORO_C} 50%, ${ORO} 70%, transparent)`;
const SERIF = "'Cinzel', 'Didot', 'Bodoni 72', 'Noto Serif', 'Times New Roman', serif";
const DISPLAY = "'Anton', 'Impact', 'HelveticaNeue-CondensedBlack', 'Roboto Condensed', sans-serif-condensed, 'Arial Narrow', sans-serif";
const DW = 800;
const UI = "'DM Sans', -apple-system, 'Segoe UI', Roboto, sans-serif";
const versal = (size, extra = {}) => ({ fontFamily: SERIF, fontSize: size, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600, ...extra });
const ROW = 46, VISIBLE = 5;
const CSS = `

@keyframes entra { from { opacity:0; transform: translateY(18px) } to { opacity:1; transform:none } }
@keyframes sale { from { opacity:1 } to { opacity:0; transform: translateY(-14px) } }
@keyframes reparte { from { opacity:0; transform: translateY(60px) scale(.97) } to { opacity:1; transform:none } }
@keyframes latido { 0%,100% { transform: scale(1) } 50% { transform: scale(1.03) } }
@keyframes telon { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes clac { 0% { transform: rotate(-22deg) } 60% { transform: rotate(4deg) } 100% { transform: rotate(0) } }
@keyframes gira { to { transform: rotate(360deg) } }
@keyframes destello { 0%,100% { opacity:.35 } 50% { opacity:.9 } }
@keyframes portada { from { opacity:0; transform: scale(.94) } to { opacity:1; transform:none } }
.panel { animation: entra .45s cubic-bezier(.2,.8,.2,1) both }
.panel-out { animation: sale .25s ease-in both }
.carta { animation: reparte .5s cubic-bezier(.2,.9,.25,1.1) both }
@keyframes tension { 0% { transform: translateY(0) rotate(0) } 15% { transform: translateY(-8px) rotate(-1.2deg) scale(1.02) } 35% { transform: translateY(-8px) rotate(1.2deg) scale(1.02) } 55% { transform: translateY(-8px) rotate(-.8deg) scale(1.02) } 75% { transform: translateY(-8px) rotate(.8deg) scale(1.02) } 100% { transform: translateY(-8px) rotate(0) scale(1.03) } }
@keyframes halo { 0% { box-shadow: 0 0 0 0 rgba(246,230,180,.0) } 60% { box-shadow: 0 0 0 6px rgba(246,230,180,.18), 0 0 40px rgba(212,169,61,.55) } 100% { box-shadow: 0 0 0 10px rgba(246,230,180,0), 0 0 60px rgba(212,169,61,0) } }
@keyframes revela { 0% { filter: brightness(2.2) } 100% { filter: brightness(1) } }
.tenso { animation: tension 1s cubic-bezier(.3,.6,.3,1) both }
.halo { animation: halo 1.1s ease-out both }
.revela { animation: revela 1.2s ease-out both }
.estrenar { animation: latido 1.8s ease-in-out infinite }
.tel { transform-origin: top; animation: telon .5s cubic-bezier(.2,.8,.2,1) both }
.clac { transform-origin: left bottom; animation: clac .6s cubic-bezier(.2,.8,.2,1) both }
.rayos { animation: gira 180s linear infinite; transform-origin: 50% 50% }
.destello { animation: destello 3s ease-in-out infinite }
.portada { animation: portada 1.1s cubic-bezier(.2,.8,.2,1) both }
button:focus-visible { outline: 2px solid ${ORO_C}; outline-offset: 3px }
@media (prefers-reduced-motion: reduce) { .panel,.panel-out,.carta,.estrenar,.tel,.clac,.rayos,.destello,.portada,.tenso,.halo,.revela { animation: none } }
`;

// Rayos de sol art déco (fondo de escenario)
function Rayos({ size = 900, alpha = 0.16, top = -420 }) {
  const rays = 36;
  return (
    <svg className="absolute left-1/2 rayos pointer-events-none" style={{ width: size, height: size, marginLeft: -size / 2, top, opacity: alpha }} viewBox="-500 -500 1000 1000">
      <defs><radialGradient id="rg" r="0.5"><stop offset="0" stopColor={ORO_C} /><stop offset="1" stopColor={ORO} stopOpacity="0" /></radialGradient></defs>
      {Array.from({ length: rays }).map((_, i) => { const a = (i / rays) * Math.PI * 2, b = a + Math.PI / rays; return <path key={i} d={`M0 0 L${Math.cos(a) * 500} ${Math.sin(a) * 500} L${Math.cos(b) * 500} ${Math.sin(b) * 500} Z`} fill="url(#rg)" />; })}
    </svg>
  );
}
// Filete dorado con rombo central
function Filete({ w = "100%", my = 10 }) {
  return (
    <div className="flex items-center gap-2" style={{ width: w, margin: `${my}px auto` }}>
      <div className="flex-1" style={{ height: 1, background: GOLD_H }} />
      <div style={{ width: 7, height: 7, background: ORO, transform: "rotate(45deg)" }} />
      <div className="flex-1" style={{ height: 1, background: GOLD_H }} />
    </div>
  );
}
// Marco art déco: doble línea con esquinas escalonadas
function Marco({ children, className = "", style = {}, fondo = LACA, pad = 16 }) {
  const esq = (pos) => {
    const t = pos.includes("t"), l = pos.includes("l");
    return <svg key={pos} className="absolute" style={{ [t ? "top" : "bottom"]: 4, [l ? "left" : "right"]: 4, transform: `scale(${l ? 1 : -1}, ${t ? 1 : -1})` }} width="18" height="18" viewBox="0 0 18 18"><path d="M0 18 V6 H4 V2 H8 V0 H18" fill="none" stroke={ORO} strokeWidth="1.5" /></svg>;
  };
  return (
    <div className={`relative ${className}`} style={{ background: fondo, border: `1px solid ${ORO}`, boxShadow: `inset 0 0 0 3px ${fondo}, inset 0 0 0 4px ${ORO}55`, padding: pad, ...style }}>
      {["tl", "tr", "bl", "br"].map(esq)}
      {children}
    </div>
  );
}
function BotonOro({ children, onClick, disabled, className = "", grande, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 ${className}`}
      style={{ ...versal(grande ? 18 : 13), background: GOLD, color: NEGRO, padding: grande ? "18px 20px" : "14px 16px", border: "none", boxShadow: `0 1px 0 ${ORO_C} inset, 0 8px 22px rgba(212,169,61,.25)`, opacity: disabled ? 0.5 : 1, transition: "all .3s", ...style }}>
      {children}
    </button>
  );
}
function BotonNegro({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 ${className}`} style={{ ...versal(12), background: "transparent", color: ORO_C, padding: "14px 16px", border: `1px solid ${ORO}`, transition: "all .3s" }}>{children}</button>
  );
}

function Estatuilla({ h = 110, color, cls = "" }) {
  const id = "est" + h + (color ? "r" : "");
  const c1 = color || "#F6E6B4", c2 = color || "#D4A93D", c3 = color ? color : "#7A5A14", oscuro = color ? "rgba(0,0,0,.35)" : "#7A5A14";
  return (
    <svg className={cls} width={h * 0.4} height={h} viewBox="0 0 44 110" fill="none" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={c3} /><stop offset=".35" stopColor={c1} /><stop offset=".6" stopColor={c2} /><stop offset="1" stopColor={c3} /></linearGradient>
        <linearGradient id={id + "p"} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c3} /></linearGradient>
      </defs>
      <path d="M22 2 L24.2 8.2 L30.8 8.2 L25.5 12 L27.5 18.4 L22 14.6 L16.5 18.4 L18.5 12 L13.2 8.2 L19.8 8.2 Z" fill={`url(#${id}p)`} />
      <path d="M15.2 14.5 L11.5 36 L15.5 37 L18.4 17 Z M28.8 14.5 L32.5 36 L28.5 37 L25.6 17 Z" fill={`url(#${id})`} />
      <circle cx="22" cy="25" r="5" fill={`url(#${id})`} /><rect x="20.2" y="29.5" width="3.6" height="4" fill={`url(#${id})`} />
      <path d="M11.5 34 H32.5 L29 60 H15 Z" fill={`url(#${id})`} /><path d="M11.5 34 H32.5 L32 36.5 H12 Z" fill={oscuro} opacity=".6" />
      <rect x="14.5" y="58" width="15" height="3" fill={oscuro} />
      <path d="M15 61 H29 L33 86 H11 Z" fill={`url(#${id})`} />
      <g stroke={oscuro} strokeWidth=".9" opacity=".8"><line x1="18.5" y1="63" x2="16.2" y2="85" /><line x1="22" y1="63" x2="22" y2="85" /><line x1="25.5" y1="63" x2="27.8" y2="85" /></g>
      <rect x="8" y="86" width="28" height="5" fill={`url(#${id})`} /><rect x="4" y="91" width="36" height="6" fill={`url(#${id})`} /><rect x="0" y="97" width="44" height="9" fill={`url(#${id})`} /><rect x="0" y="106" width="44" height="2" fill={oscuro} />
    </svg>
  );
}
// Íconos propios por premio (figuras originales, no las estatuillas registradas)
function IconoPremio({ texto, h = 22 }) {
  const t = texto.toLowerCase();
  const nominada = t.startsWith("nominada"), razzie = t.includes("razzie");
  const plata = t.includes("cóndor") || t.includes("premio sur");
  const c1 = razzie ? "#E0485A" : plata ? "#E9E9EC" : ORO_C, c2 = razzie ? ROJO : plata ? "#9A9AA6" : ORO, c3 = razzie ? "#5A0E15" : plata ? "#5C5C66" : ORO_O;
  const id = "pr" + (razzie ? "r" : plata ? "p" : "o") + h;
  const G = `url(#${id})`;
  const defs = <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1} /><stop offset=".55" stopColor={c2} /><stop offset="1" stopColor={c3} /></linearGradient></defs>;
  const base = <><rect x="7" y="19" width="10" height="2" fill={G} /><rect x="5" y="21" width="14" height="2" fill={G} /></>;
  let cuerpo;
  if (t.includes("globo")) cuerpo = <><circle cx="12" cy="9" r="6.5" fill={G} /><path d="M5.5 9 H18.5 M12 2.5 V15.5 M7 5 Q12 8 17 5 M7 13 Q12 10 17 13" stroke={c3} strokeWidth=".9" fill="none" /><rect x="11" y="15.5" width="2" height="3.5" fill={G} />{base}</>;
  else if (t.includes("bafta")) cuerpo = <><path d="M4 4 Q12 1 20 4 Q20 12 12 18 Q4 12 4 4 Z" fill={G} /><path d="M7.5 8 Q9.5 6.5 11 8.5 M13 8.5 Q14.5 6.5 16.5 8 M9 12.5 Q12 15 15 12.5" stroke={c3} strokeWidth="1.2" fill="none" />{base}</>;
  else if (t.includes("palma")) cuerpo = <><path d="M12 19 V6" stroke={G} strokeWidth="1.6" /><path d="M12 6 Q6 4 3 9 Q8 7 12 9 M12 6 Q18 4 21 9 Q16 7 12 9 M12 9 Q6 9 4 15 Q9 12 12 12 M12 9 Q18 9 20 15 Q15 12 12 12 M12 12 Q9 14 9 18 Q12 15 12 15 M12 12 Q15 14 15 18 Q12 15 12 15" fill={G} />{base}</>;
  else if (t.includes("león")) cuerpo = <><circle cx="12" cy="10" r="7.5" fill={c3} /><circle cx="12" cy="10" r="5" fill={G} /><path d="M12 3 L13.5 5.5 L10.5 5.5 Z M5 8 L7.5 8.5 L6.5 11 Z M19 8 L16.5 8.5 L17.5 11 Z M6 14 L8.5 13 L8 15.5 Z M18 14 L15.5 13 L16 15.5 Z" fill={c3} /><circle cx="10" cy="9.5" r=".8" fill={c3} /><circle cx="14" cy="9.5" r=".8" fill={c3} /><path d="M11 12 H13 L12 13.5 Z" fill={c3} />{base}</>;
  else if (t.includes("oso")) cuerpo = <><circle cx="6.5" cy="5.5" r="2.5" fill={G} /><circle cx="17.5" cy="5.5" r="2.5" fill={G} /><circle cx="12" cy="10.5" r="7" fill={G} /><circle cx="9.5" cy="9.5" r=".9" fill={c3} /><circle cx="14.5" cy="9.5" r=".9" fill={c3} /><ellipse cx="12" cy="13" rx="2.6" ry="1.9" fill={c1} /><circle cx="12" cy="12.5" r="1" fill={c3} />{base}</>;
  else if (t.includes("goya")) cuerpo = <><circle cx="12" cy="6" r="3.5" fill={G} /><path d="M8 11 Q12 9 16 11 L17 18 H7 Z" fill={G} />{base}</>;
  else if (t.includes("cóndor")) cuerpo = <><path d="M12 12 Q6 3 1 6 Q5 7 6 10 Q3 10 2 13 Q7 12 12 16 Q17 12 22 13 Q21 10 18 10 Q19 7 23 6 Q18 3 12 12 Z" fill={G} /><circle cx="12" cy="11.5" r="1.4" fill={c3} />{base}</>;
  else if (t.includes("premio sur")) cuerpo = <><path d="M12 1 L13.5 8.5 L21 10 L13.5 11.5 L12 19 L10.5 11.5 L3 10 L10.5 8.5 Z" fill={G} /><path d="M5 4 L7 6 M19 4 L17 6 M5 16 L7 14 M19 16 L17 14" stroke={c2} strokeWidth="1.2" /></>;
  else if (t.includes("selección")) cuerpo = <><path d="M12 20 Q4 17 3 8 Q7 9 9 13 Q6 11 5 6 Q9 8 10 12 M12 20 Q20 17 21 8 Q17 9 15 13 Q18 11 19 6 Q15 8 14 12" fill="none" stroke={G} strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="7" r="2" fill={G} /></>;
  else if (razzie) cuerpo = <><circle cx="12" cy="9" r="3" fill={G} /><circle cx="8.5" cy="11" r="2.6" fill={G} /><circle cx="15.5" cy="11" r="2.6" fill={G} /><circle cx="9.5" cy="15" r="2.6" fill={G} /><circle cx="14.5" cy="15" r="2.6" fill={G} /><circle cx="12" cy="18" r="2.3" fill={G} /><path d="M12 6 Q10 2 8 3 Q10 4 12 6 Q13 2 16 3 Q13 4 12 6" fill="#3E8E4A" /></>;
  else return <Estatuilla h={h} />; // Oscar y genéricos: la estatuilla del juego
  return <svg width={h} height={h} viewBox="0 0 24 24" style={{ flexShrink: 0, opacity: nominada ? 0.75 : 1 }}>{defs}{cuerpo}</svg>;
}
// ---------- Portada ----------
function Portada({ onStart }) {
  return (
    <div className="portada relative flex flex-col items-center text-center" style={{ minHeight: "88vh", cursor: "pointer" }} onClick={onStart}>
      <Rayos size={1100} alpha={0.22} top={-300} />
      <div className="relative flex flex-col items-center" style={{ marginTop: "14vh" }}>
        <div style={{ ...versal(11), color: ORO }}>Un juego de</div>
        <div className="flex items-center gap-3 mt-2"><div style={{ width: 40, height: 1, background: GOLD_H }} /><Clapperboard size={22} color={ORO_C} strokeWidth={1.5} /><div style={{ width: 40, height: 1, background: GOLD_H }} /></div>
        <h1 className="mt-6" style={{ fontFamily: SERIF, fontSize: 54, lineHeight: 1, letterSpacing: ".12em", fontWeight: 700, color: "transparent", backgroundImage: GOLD, WebkitBackgroundClip: "text", backgroundClip: "text", textTransform: "uppercase", filter: "drop-shadow(0 4px 18px rgba(212,169,61,.35))" }}>
          El<br />Productor
        </h1>
        <Filete w={180} my={18} />
        <p style={{ fontFamily: UI, fontSize: 15, color: MARFIL, maxWidth: 260, lineHeight: 1.5, fontStyle: "italic" }}>Girá el título, dá vuelta las cartas y estrená la película que nadie pidió.</p>
        <div className="mt-5 px-4 py-3" style={{ border: `1px solid ${ORO}55`, maxWidth: 300 }}>
          <div style={{ ...versal(9), color: ORO }}>Cómo se juega</div>
          <p style={{ fontFamily: UI, fontSize: 13, color: MARFIL, lineHeight: 1.5, marginTop: 6 }}>Una temporada son <b>tres películas</b> con una caja de <b>{M(FONDOS_INICIALES)}</b>. Vos elegís el género y cuánto arriesgar en cada una; el elenco lo reparte la suerte. Lo que recaudan vuelve a la caja.</p>
        </div>
        <Estatuilla cls="mt-8 destello" />
        <div className="mt-8" style={{ ...versal(11), color: ORO_C }}>Tocá para entrar</div>
      </div>
    </div>
  );
}

// ---------- Marquesina ----------
function Marquesina({ texto, sub, encendida }) {
  return (
    <div className="relative mb-6">
      <Marco className="text-center" fondo={NEGRO} pad={0} style={{ padding: "18px 16px 16px" }}>
        <div style={{ ...versal(10), color: ORO }}>{sub}</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 38, lineHeight: 1.02, marginTop: 8, color: encendida ? "transparent" : "#3A3A3A", backgroundImage: encendida ? GOLD : "none", WebkitBackgroundClip: "text", backgroundClip: "text", letterSpacing: ".02em", transition: "color .4s" }}>{texto}</div>
        <Filete w={120} my={8} />
      </Marco>
    </div>
  );
}

// ---------- Tambor con capitel escalonado ----------
function Tambor({ items, target, spinId, delay, onStop, girado }) {
  const strip = [...items, ...items, ...items];
  const n = items.length;
  const [pos, setPos] = useState(target);
  const [trans, setTrans] = useState("none");
  const prev = useRef(target);
  const visto = useRef(spinId); // giros ya procesados: al montar, el actual no cuenta
  useEffect(() => {
    if (!spinId || spinId === visto.current) return;
    visto.current = spinId;
    setTrans("none"); setPos(prev.current % n);
    const t1 = setTimeout(() => { setTrans(`transform ${2.6 + delay}s cubic-bezier(.08,.75,.15,1)`); setPos(target + 2 * n); prev.current = target; }, 30);
    const t2 = setTimeout(onStop, (2.6 + delay) * 1000 + 60);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [spinId]);
  const y = -(pos * ROW) + ((VISIBLE - 1) / 2) * ROW;
  return (
    <div className="flex-1 flex flex-col items-center">
      <div style={{ width: "60%", height: 4, background: GOLD }} /><div style={{ width: "80%", height: 4, background: GOLD, marginTop: 2 }} /><div style={{ width: "100%", height: 3, background: GOLD, marginTop: 2 }} />
      <div className="relative w-full overflow-hidden" style={{ height: ROW * VISIBLE, background: NEGRO, borderLeft: `1px solid ${ORO}`, borderRight: `1px solid ${ORO}` }}>
        <div style={{ transform: `translateY(${y}px)`, transition: trans, willChange: "transform" }}>
          {strip.map((w, i) => <div key={i} className="flex items-center justify-center" style={{ fontFamily: SERIF, fontWeight: 600, height: ROW, fontSize: 17, letterSpacing: ".06em", color: MARFIL }}>{w}</div>)}
        </div>
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: ROW * 2, height: ROW, borderTop: `1px solid ${ORO_C}`, borderBottom: `1px solid ${ORO_C}`, background: girado ? "rgba(212,169,61,.22)" : "rgba(212,169,61,.06)", transition: "background .4s" }} />
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: ROW * 1.7, background: `linear-gradient(${NEGRO}, transparent)` }} />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: ROW * 1.7, background: `linear-gradient(transparent, ${NEGRO})` }} />
      </div>
      <div style={{ width: "100%", height: 3, background: GOLD }} /><div style={{ width: "80%", height: 4, background: GOLD, marginTop: 2 }} /><div style={{ width: "60%", height: 4, background: GOLD, marginTop: 2 }} />
    </div>
  );
}

// ---------- Carta ----------
function Carta({ nombre, valor, sub, Icono, IconoFrente, abierta, puede, tenso, onFlip, i }) {
  const IF = IconoFrente || Icono;
  return (
    <div className={`carta ${tenso ? "tenso" : ""}`} style={{ perspective: 1100, animationDelay: tenso ? "0ms" : `${i * 70}ms` }} onClick={() => puede && onFlip()}>
      <div className={abierta ? "halo" : ""} style={{ position: "relative", minHeight: 64, transformStyle: "preserve-3d", transition: "transform 1.1s cubic-bezier(.25,.8,.25,1)", transform: abierta ? "rotateY(180deg)" : "none" }}>
        <div className="absolute inset-0 px-4 flex items-center gap-3" style={{ backfaceVisibility: "hidden", background: puede ? LACA : NEGRO, border: `1px solid ${puede ? ORO_C : "#3A3320"}`, boxShadow: puede ? `inset 0 0 0 3px ${LACA}, inset 0 0 0 4px ${ORO}66, 0 8px 24px rgba(212,169,61,.18)` : "none", color: puede ? ORO_C : "#5C5642", cursor: puede ? "pointer" : "default" }}>
          <Icono size={20} color={puede ? ORO : "#5C5642"} strokeWidth={1.5} />
          <span style={versal(12)}>{nombre}</span>
          {puede && <span className="ml-auto" style={{ fontFamily: UI, fontSize: 12, color: GRIS, fontStyle: "italic" }}>Tocá para dar vuelta</span>}
        </div>
        <div className={`px-4 py-3 flex items-center gap-3 ${abierta ? "revela" : ""}`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: MARFIL, color: NEGRO, border: `1px solid ${ORO}`, boxShadow: `inset 0 0 0 3px ${MARFIL}, inset 0 0 0 4px ${ORO}88`, minHeight: 64, visibility: abierta ? "visible" : "hidden" }}>
          <div className="flex items-center justify-center" style={{ width: 40, height: 40, border: `1px solid ${ORO}`, boxShadow: `inset 0 0 0 2px ${MARFIL}, inset 0 0 0 3px ${ORO}66`, flexShrink: 0 }}><IF size={20} color={ORO_O} strokeWidth={1.5} /></div>
          <div>
            <div style={{ ...versal(9), color: ORO_O }}>{nombre}</div>
            <div style={{ fontFamily: UI, fontSize: 17, lineHeight: 1.25, fontWeight: 500 }}>{valor}</div>
            {sub && <div style={{ fontFamily: UI, fontSize: 12, color: "#5A5A5A", marginTop: 2, fontStyle: "italic" }}>{sub}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Contadores ----------
function useCuenta(valor, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => { let raf, t0; const step = (t) => { if (!t0) t0 = t; const p = Math.min(1, (t - t0) / ms); setV(valor * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); }; raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf); }, [valor]);
  return v;
}
function Dato({ label, valor, fmt, color, Icono }) {
  const v = useCuenta(valor);
  return (
    <div className="flex items-start gap-2">
      <Icono size={15} color={color || ORO_O} strokeWidth={1.8} style={{ marginTop: 4 }} />
      <div>
        <div style={{ ...versal(9), color: "#6A6A6A" }}>{label}</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 22, color: color || NEGRO }}>{fmt(v)}</div>
      </div>
    </div>
  );
}
function Barra({ label, v, texto }) {
  const a = useCuenta(v, 1200);
  return (
    <div className="flex-1">
      <div className="flex justify-between items-baseline">
        <span style={{ ...versal(9), color: "#6A6A6A" }}>{label}</span>
        <span style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 20 }}>{a.toFixed(1)}</span>
      </div>
      <div style={{ height: 3, background: "#DDD3BC" }}><div style={{ height: 3, width: `${a * 10}%`, background: GOLD }} /></div>
      <div style={{ fontFamily: UI, fontSize: 12, marginTop: 4, color: "#4A4A4A", fontStyle: "italic" }}>{texto}</div>
    </div>
  );
}

// =====================================================================
// PÓSTER PROCEDURAL (canvas 1080×1350)
// =====================================================================
function fitFont(ctx, text, font, maxW, max = 300, min = 24) {
  ctx.font = font.replace("SIZE", "100");
  const w = ctx.measureText(text).width || 1;
  return Math.max(min, Math.min(max, Math.floor(100 * maxW / w)));
}
function textoFit(ctx, text, font, maxW, x, y, max, min) {
  const s = fitFont(ctx, text, font, maxW, max, min); ctx.font = font.replace("SIZE", s); ctx.fillText(text, x, y); return s;
}
function grano(ctx, W, H, n = 9000) { ctx.save(); for (let i = 0; i < n; i++) { ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.12)"; ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2); } ctx.restore(); }
// Fondos con foto: cantidad de imágenes disponibles por género en public/fondos/<genero>-<n>.jpg (1080×1350).
// 0 = usar solo motivos dibujados. Si una imagen no carga, cae al motivo dibujado.
const FONDOS = { accion: 0, comedia: 0, terror: 0, drama: 0, animacion: 0, scifi: 0 };
const N_MOTIVOS = 3;
const R2 = (a, b) => a + Math.random() * (b - a);
function motivo(ctx, id, W, H, pal, v = 0) {
  ctx.save(); ctx.strokeStyle = pal.acc; ctx.fillStyle = pal.acc;
  const burst = (x, y, r, a) => { const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, pal.acc); g.addColorStop(1, "transparent"); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = pal.acc; };
  if (id === "accion") {
    if (v === 0) { ctx.lineWidth = 6; for (let i = -10; i < 30; i++) { ctx.globalAlpha = 0.08 + (i % 3) * 0.05; ctx.beginPath(); ctx.moveTo(i * 80, 0); ctx.lineTo(i * 80 + 700, H); ctx.stroke(); } burst(W * 0.7, H * 0.42, 420, 0.55); }
    if (v === 1) { burst(W / 2, H * 0.4, 520, 0.7); ctx.lineWidth = 3; for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.1 + Math.random() * 0.25; const a = Math.random() * Math.PI * 2; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 120, H * 0.4 + Math.sin(a) * 120); ctx.lineTo(W / 2 + Math.cos(a) * R2(500, 900), H * 0.4 + Math.sin(a) * R2(500, 900)); ctx.stroke(); } }
    if (v === 2) { ctx.lineWidth = 4; for (let i = 0; i < 26; i++) { ctx.globalAlpha = 0.06 + Math.random() * 0.14; const y = Math.random() * H * 0.8; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + R2(-40, 40)); ctx.stroke(); } ctx.globalAlpha = 0.5; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(W * 0.62, H * 0.38, 260, 0, 7); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W * 0.62, H * 0.38, 340, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(W * 0.62 - 420, H * 0.38); ctx.lineTo(W * 0.62 + 420, H * 0.38); ctx.moveTo(W * 0.62, H * 0.38 - 420); ctx.lineTo(W * 0.62, H * 0.38 + 420); ctx.stroke(); }
  }
  if (id === "comedia") {
    if (v === 0) for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.08 + Math.random() * 0.12; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H * 0.75, 40 + Math.random() * 120, 0, 7); ctx.fill(); }
    if (v === 1) { ctx.lineWidth = 60; for (let i = -6; i < 16; i++) { ctx.globalAlpha = 0.07; ctx.beginPath(); ctx.moveTo(i * 130, 0); ctx.lineTo(i * 130 + 500, H); ctx.stroke(); } for (let i = 0; i < 14; i++) { ctx.globalAlpha = 0.18 + Math.random() * 0.25; const x = Math.random() * W, y = Math.random() * H * 0.7, r = 20 + Math.random() * 40; ctx.beginPath(); ctx.moveTo(x, y + r); ctx.bezierCurveTo(x - r * 1.6, y - r * 0.4, x - r * 0.6, y - r * 1.4, x, y - r * 0.5); ctx.bezierCurveTo(x + r * 0.6, y - r * 1.4, x + r * 1.6, y - r * 0.4, x, y + r); ctx.fill(); } }
    if (v === 2) { for (let i = 0; i < 160; i++) { ctx.globalAlpha = 0.25 + Math.random() * 0.5; ctx.fillRect(Math.random() * W, Math.random() * H * 0.8, 8 + Math.random() * 10, 16 + Math.random() * 14); } burst(W / 2, H * 0.3, 600, 0.35); }
  }
  if (id === "terror") {
    if (v === 0) { ctx.globalAlpha = 0.9; ctx.fillStyle = "#000"; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, H * 0.55 + Math.random() * 220); ctx.lineTo(W, H); ctx.closePath(); ctx.fill(); ctx.strokeStyle = pal.acc; ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { ctx.globalAlpha = 0.35; const x = Math.random() * W, y = Math.random() * H * 0.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + R2(-60, 60), y + R2(120, 260)); ctx.stroke(); } }
    if (v === 1) { for (let i = 0; i < 12; i++) { const g = ctx.createRadialGradient(Math.random() * W, H * 0.6 + Math.random() * H * 0.4, 20, W / 2, H * 0.8, 700); g.addColorStop(0, "rgba(120,120,130,.18)"); g.addColorStop(1, "transparent"); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } ctx.fillStyle = "#E8E8E8"; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(W * 0.7, H * 0.25, 170, 0, 7); ctx.fill(); ctx.fillStyle = pal.bg; ctx.globalAlpha = 0.95; ctx.beginPath(); ctx.arc(W * 0.76, H * 0.22, 150, 0, 7); ctx.fill(); }
    if (v === 2) { ctx.strokeStyle = pal.acc; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.55; const rama = (x, y, a, l, d) => { if (d > 6 || l < 12) return; const nx = x + Math.cos(a) * l, ny = y + Math.sin(a) * l; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(nx, ny); ctx.stroke(); rama(nx, ny, a + R2(-0.6, 0.6), l * 0.8, d + 1); if (Math.random() < 0.6) rama(nx, ny, a + R2(-1.2, 1.2), l * 0.6, d + 1); }; for (let i = 0; i < 5; i++) rama(Math.random() * W, 0, Math.PI / 2 + R2(-0.5, 0.5), 160, 0); }
  }
  if (id === "drama") {
    if (v === 0) { ctx.lineWidth = 2; for (let i = 0; i < 90; i++) { ctx.globalAlpha = 0.05 + Math.random() * 0.12; const x = Math.random() * W; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, H * (0.3 + Math.random() * 0.6)); ctx.stroke(); } }
    if (v === 1) { for (let i = 0; i < 9; i++) { ctx.globalAlpha = 0.05 + i * 0.02; ctx.fillRect(0, H * 0.15 + i * 60, W, 40 + i * 6); } burst(W * 0.5, H * 0.2, 500, 0.35); }
    if (v === 2) { ctx.globalAlpha = 0.22; ctx.fillRect(W * 0.58, 0, 190, H * 0.62); ctx.fillRect(W * 0.8, 0, 190, H * 0.62); ctx.fillStyle = "#000"; ctx.globalAlpha = 0.5; ctx.fillRect(W * 0.58, H * 0.2, 420, 16); ctx.fillRect(W * 0.58, H * 0.42, 420, 16); }
  }
  if (id === "animacion") {
    const cols = [pal.acc, "#FF5C8A", "#7CFF9A", "#FFFFFF"];
    if (v === 0) for (let i = 0; i < 70; i++) { ctx.fillStyle = cols[i % cols.length]; ctx.globalAlpha = 0.5 + Math.random() * 0.5; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H * 0.7, 8 + Math.random() * 26, 0, 7); ctx.fill(); }
    if (v === 1) for (let i = 0; i < 9; i++) { ctx.fillStyle = cols[i % cols.length]; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H * 0.6, 120 + Math.random() * 220, 0, 7); ctx.fill(); }
    if (v === 2) for (let i = 0; i < 40; i++) { ctx.fillStyle = cols[i % cols.length]; ctx.globalAlpha = 0.6 + Math.random() * 0.4; const x = Math.random() * W, y = Math.random() * H * 0.7, r = 10 + Math.random() * 28; ctx.beginPath(); for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.45 : r, a = (k / 10) * Math.PI * 2 - Math.PI / 2; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
  }
  if (id === "scifi") {
    if (v === 0) { ctx.lineWidth = 2; ctx.globalAlpha = 0.25; for (let i = 0; i <= 12; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + (i - 6) * 60, H * 0.45); ctx.lineTo(W / 2 + (i - 6) * 400, H); ctx.stroke(); } for (let j = 0; j < 8; j++) { const y = H * 0.45 + j * j * 14; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.globalAlpha = 0.9; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(W / 2, H * 0.36, 230, 0, 7); ctx.stroke(); }
    if (v === 1) { ctx.fillStyle = "#FFF"; for (let i = 0; i < 400; i++) { ctx.globalAlpha = Math.random() * 0.9; const r = Math.random() * 2.2; ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, r, 0, 7); ctx.fill(); } const g = ctx.createRadialGradient(W * 0.72, H * 0.3, 40, W * 0.72, H * 0.3, 300); g.addColorStop(0, pal.acc); g.addColorStop(0.7, pal.bg2); g.addColorStop(1, "transparent"); ctx.globalAlpha = 0.85; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W * 0.72, H * 0.3, 280, 0, 7); ctx.fill(); }
    if (v === 2) { ctx.lineWidth = 1.5; ctx.globalAlpha = 0.35; const r = 60; for (let y = -r; y < H * 0.8; y += r * 1.5) for (let x = -r; x < W + r; x += r * 1.73) { const ox = ((y / (r * 1.5)) % 2) ? r * 0.87 : 0; ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; ctx.lineTo(x + ox + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.stroke(); } burst(W * 0.4, H * 0.35, 460, 0.5); }
  }
  ctx.restore();
}
function cargarFondo(id, v) {
  return new Promise((res) => { if (!FONDOS[id]) return res(null); const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = `/fondos/${id}-${(v % FONDOS[id]) + 1}.jpg`; });
}
async function dibujarPoster(cv, { titulo, ficha, resultado, conResultado = true, productor = "" }) {
  const W = 1080, H = 1350, ctx = cv.getContext("2d"), pal = ficha.genero.pal, m = 64, ancho = W - 2 * m;
  cv.width = W; cv.height = H;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal.bg2); g.addColorStop(1, pal.bg);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const foto = await cargarFondo(ficha.genero.id, ficha.variante);
  if (foto) {
    const esc = Math.max(W / foto.width, H / foto.height), fw = foto.width * esc, fh = foto.height * esc;
    ctx.drawImage(foto, (W - fw) / 2, (H - fh) / 2, fw, fh);
    const velo = ctx.createLinearGradient(0, 0, 0, H); velo.addColorStop(0, "rgba(0,0,0,.35)"); velo.addColorStop(0.45, "rgba(0,0,0,0)"); velo.addColorStop(1, pal.bg);
    ctx.fillStyle = velo; ctx.fillRect(0, 0, W, H);
  } else motivo(ctx, ficha.genero.motivo || ficha.genero.id, W, H, pal, ficha.variante % N_MOTIVOS);
  const v = ctx.createRadialGradient(W / 2, H * 0.5, 300, W / 2, H * 0.5, 900); v.addColorStop(0, "transparent"); v.addColorStop(1, "rgba(0,0,0,.6)"); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  grano(ctx, W, H);
  const D = `${DW} SIZEpx ${DISPLAY}`, R = `500 SIZEpx ${UI}`, I = `italic SIZEpx ${UI}`;
  ctx.textAlign = "center"; ctx.fillStyle = pal.ink;
  // cabecera: nombres de actor y actriz, separados por el acento
  ctx.fillStyle = pal.ink; textoFit(ctx, ficha.actor1.n.toUpperCase(), D, ancho * 0.44, W * 0.27, m + 56, 40);
  textoFit(ctx, ficha.actor2.n.toUpperCase(), D, ancho * 0.44, W * 0.73, m + 56, 40);
  ctx.fillStyle = pal.acc; ctx.fillRect(W / 2 - 2, m + 22, 4, 44);
  if (conResultado && resultado.premios.length) { const pr = resultado.premios[0]; const linea = resultado.nivel === 2 ? `★  GANADORA DEL ${pr.toUpperCase()}  ★` : resultado.nivel === 1 ? `★  ${pr.toUpperCase()}  ★` : `${pr.toUpperCase()}`; ctx.fillStyle = pal.acc; textoFit(ctx, linea, R, ancho, W / 2, m + 104, 24); }
  // título: cada palabra ocupa exactamente el ancho, como en los pósters de acción.
  // El bloque se ancla desde abajo para que nunca pise los créditos.
  const [s, a] = titulo.toUpperCase().split(" ");
  const fs1 = fitFont(ctx, s, D, ancho, 320), fs2 = fitFont(ctx, a, D, ancho, 320);
  const yDirector = H - 290, yTag = yDirector - 62, yA = yTag - 84, yS = yA - fs2 * 0.92;
  ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 36; ctx.shadowOffsetY = 14;
  ctx.fillStyle = pal.ink; ctx.font = D.replace("SIZE", fs1); ctx.fillText(s, W / 2, yS);
  ctx.fillStyle = pal.acc; ctx.font = D.replace("SIZE", fs2); ctx.fillText(a, W / 2, yA);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = pal.ink; textoFit(ctx, ficha.genero.tag, I, ancho, W / 2, yTag, 34);
  ctx.fillStyle = pal.acc; ctx.fillRect(W / 2 - 60, yDirector - 40, 120, 3);
  ctx.fillStyle = pal.ink; textoFit(ctx, `UNA PELÍCULA DE ${ficha.director.n.toUpperCase()}`, R, ancho, W / 2, yDirector, 28);
  // bloque de créditos, tres líneas chicas
  ctx.globalAlpha = 0.8; ctx.fillStyle = pal.ink;
  [ficha.protagonista, ficha.situacion.texto, `Presupuesto ${ficha.presupuesto.nombre}`].forEach((t, i) => textoFit(ctx, t.toUpperCase(), R, ancho * 0.85, W / 2, H - 214 + i * 32, 22));
  ctx.globalAlpha = 1;
  if (conResultado) {
    ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(0, H - 118, W, 118);
    ctx.fillStyle = pal.acc; ctx.fillRect(0, H - 118, W, 3);
    const gano = resultado.resultado >= 0 ? `GANÓ ${M(resultado.resultado)}` : `PERDIÓ ${M(-resultado.resultado)}`;
    textoFit(ctx, `${Esp(resultado.espectadores).toUpperCase()} DE ESPECTADORES`, D, ancho, W / 2, H - 70, 40);
    ctx.fillStyle = pal.ink; textoFit(ctx, `CRÍTICA ${resultado.critica.toFixed(1)}  ·  PÚBLICO ${resultado.publico.toFixed(1)}  ·  ${gano}`, R, ancho, W / 2, H - 28, 24);
  } else {
    ctx.fillStyle = pal.acc; ctx.fillRect(W / 2 - 60, H - 112, 120, 3); ctx.fillStyle = pal.ink; textoFit(ctx, "PRÓXIMAMENTE", D, ancho, W / 2, H - 58, 40);
  }
  // marco dorado y marca del juego
  ctx.strokeStyle = ORO; ctx.lineWidth = 3; ctx.strokeRect(14, 14, W - 28, H - 28); ctx.lineWidth = 1; ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.fillStyle = ORO_C; ctx.font = `600 16px ${SERIF}`; if ("letterSpacing" in ctx) ctx.letterSpacing = "5px"; ctx.fillText(productor ? `${productor.toUpperCase()} PRESENTA` : "EL PRODUCTOR", W / 2, 46); if ("letterSpacing" in ctx) ctx.letterSpacing = "0px";
}

const URL_JUEGO = "gaming.masfacil.com.ar";
async function dibujarTemporada(cv, { pelis, fondos, rango, productor = "" }) {
  const W = 1080, H = 1350, ctx = cv.getContext("2d");
  cv.width = W; cv.height = H;
  ctx.fillStyle = "#070707"; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2, 300); for (let i = 0; i < 36; i++) { const a = (i / 36) * Math.PI * 2, b = a + Math.PI / 36; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1400); g.addColorStop(0, "rgba(246,230,180,.16)"); g.addColorStop(1, "rgba(212,169,61,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 1400, Math.sin(a) * 1400); ctx.lineTo(Math.cos(b) * 1400, Math.sin(b) * 1400); ctx.closePath(); ctx.fill(); } ctx.restore();
  ctx.strokeStyle = ORO; ctx.lineWidth = 3; ctx.strokeRect(22, 22, W - 44, H - 44); ctx.lineWidth = 1; ctx.strokeRect(34, 34, W - 68, H - 68);
  const oro = ctx.createLinearGradient(0, 0, W, 0); oro.addColorStop(0, ORO_O); oro.addColorStop(0.35, ORO_C); oro.addColorStop(0.6, ORO); oro.addColorStop(1, ORO_O);
  const ls = (v) => { if ("letterSpacing" in ctx) ctx.letterSpacing = v; };
  ctx.textAlign = "center";
  ls("8px"); ctx.fillStyle = ORO; ctx.font = `600 22px ${SERIF}`; ctx.fillText(productor ? `LA TEMPORADA DE ${productor.toUpperCase()}` : "EL PRODUCTOR · MI TEMPORADA", W / 2, 96); ls("0px");
  const pw = 300, ph = 375, gap = 30, x0 = (W - (pw * 3 + gap * 2)) / 2, y0 = 150;
  for (let i = 0; i < pelis.length; i++) {
    const off = document.createElement("canvas");
    await dibujarPoster(off, { titulo: pelis[i].titulo, ficha: pelis[i].ficha, resultado: pelis[i].res, conResultado: false, productor });
    const x = x0 + i * (pw + gap);
    ctx.save(); ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; ctx.fillStyle = "#000"; ctx.fillRect(x, y0, pw, ph); ctx.restore();
    ctx.drawImage(off, x, y0, pw, ph);
    ctx.strokeStyle = ORO; ctx.lineWidth = 3; ctx.strokeRect(x, y0, pw, ph);
    const r = pelis[i].resultado;
    ctx.fillStyle = r >= 0 ? "#7FD39A" : "#F07C88"; ctx.font = `${DW} 34px ${DISPLAY}`; ctx.fillText(`${r >= 0 ? "+" : "−"} ${M(Math.abs(r))}`, x + pw / 2, y0 + ph + 52);
    ctx.fillStyle = MARFIL; ctx.font = `500 18px ${UI}`; ctx.fillText(pelis[i].genero, x + pw / 2, y0 + ph + 82);
  }
  ctx.fillStyle = ORO; ctx.fillRect(W / 2 - 200, 720, 400, 1); ctx.save(); ctx.translate(W / 2, 720); ctx.rotate(Math.PI / 4); ctx.fillRect(-7, -7, 14, 14); ctx.restore();
  ls("4px"); ctx.fillStyle = ORO; ctx.font = `600 20px ${SERIF}`; ctx.fillText(productor ? `${productor.toUpperCase()} CERRÓ LA TEMPORADA COMO` : "CERRÉ LA TEMPORADA COMO", W / 2, 790);
  const t = rango[1].toUpperCase(); ctx.fillStyle = oro; ctx.font = `700 ${fitFont(ctx, t, `700 SIZEpx ${SERIF}`, W - 160, 74, 40)}px ${SERIF}`; ctx.fillText(t, W / 2, 890); ls("0px");
  ctx.fillStyle = MARFIL; ctx.font = `italic 28px ${UI}`; ctx.fillText(rango[2], W / 2, 950);
  ls("5px"); ctx.fillStyle = ORO; ctx.font = `600 18px ${SERIF}`; ctx.fillText(`EMPECÉ CON ${M(FONDOS_INICIALES).toUpperCase()}`, W / 2, 1050); ls("0px");
  ctx.fillStyle = fondos >= FONDOS_INICIALES ? "#7FD39A" : "#F07C88"; ctx.font = `${DW} 110px ${DISPLAY}`; ctx.fillText(M(fondos), W / 2, 1160);
  ctx.fillStyle = MARFIL; ctx.font = `500 22px ${UI}`; ctx.fillText("EN CAJA", W / 2, 1200);
  ls("4px"); ctx.fillStyle = ORO_C; ctx.font = `600 20px ${SERIF}`; ctx.fillText(`¿TE ANIMÁS? ${URL_JUEGO.toUpperCase()}`, W / 2, 1285); ls("0px");
}
function PosterTemporada({ pelis, fondos, rango, productor = "" }) {
  const ref = useRef(null);
  const [listo, setListo] = useState(false);
  useEffect(() => { let vivo = true; const go = () => { if (vivo && ref.current) dibujarTemporada(ref.current, { pelis, fondos, rango, productor }).then(() => vivo && setListo(true)); }; if (document.fonts && document.fonts.load) Promise.all([document.fonts.load(`80px ${DISPLAY}`), document.fonts.load(`600 16px ${SERIF}`)]).then(go).catch(go); else go(); return () => { vivo = false; }; }, []);
  const compartir = async () => {
    ref.current.toBlob(async (blob) => {
      const file = new File([blob], "mi-temporada.png", { type: "image/png" });
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "Mi temporada como productor", text: `${productor || "Cerré"} ${productor ? "cerró" : ""} la temporada como ${rango[1]}. ¿Te animás? https://${URL_JUEGO}` }); return; } } catch (e) {}
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    }, "image/png");
  };
  return (
    <div className="panel">
      <div style={{ padding: 4, background: GOLD }}><canvas ref={ref} className="w-full block" style={{ aspectRatio: "4 / 5", opacity: listo ? 1 : 0, transition: "opacity .5s" }} /></div>
      <BotonOro onClick={compartir} className="w-full mt-3"><ImageDown size={18} strokeWidth={1.8} /> Compartir mi temporada</BotonOro>
    </div>
  );
}
function Poster({ titulo, ficha, resultado, conResultado = true, etiqueta = "Compartir el póster", oculto = false, productor = "" }) {
  const ref = useRef(null);
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let vivo = true;
    const go = () => { if (vivo && ref.current) dibujarPoster(ref.current, { titulo, ficha, resultado, conResultado, productor }).then(() => vivo && setListo(true)); };
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load(`80px ${DISPLAY}`), document.fonts.load(`30px ${UI}`), document.fonts.load(`600 16px ${SERIF}`)]).then(go).catch(go); else go();
    return () => { vivo = false; };
  }, []);
  const compartir = async () => {
    ref.current.toBlob(async (blob) => {
      const file = new File([blob], `${titulo.replace(/\s+/g, "-")}.png`, { type: "image/png" });
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: titulo }); return; } } catch (e) {}
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    }, "image/png");
  };
  return (
    <div className="panel">
      <div style={oculto ? { position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 } : { padding: 4, background: GOLD }}>
        <canvas ref={ref} className="w-full block" style={{ aspectRatio: "4 / 5", opacity: listo ? 1 : 0, transition: "opacity .5s" }} />
      </div>
      <BotonOro onClick={compartir} className={oculto ? "w-full" : "w-full mt-3"}><ImageDown size={18} strokeWidth={1.8} /> {etiqueta}</BotonOro>
    </div>
  );
}

// =====================================================================
// APP
// =====================================================================
const FONDOS_INICIALES = 500;
const PELIS_POR_TEMPORADA = 3;
const TITULOS_PRODUCTOR = [
  [1100, "Magnate de Hollywood", "Tenés estudio propio y un pase VIP vitalicio a la gala."],
  [750, "Productor de peso", "El estudio te devuelve las llamadas antes del mediodía."],
  [500, "Productor sólido", "Terminaste con lo que empezaste. En esta industria, eso es ganar."],
  [180, "Sobreviviente", "Perdiste plata, pero seguís invitado a las fiestas."],
  [0, "Productor en bancarrota", "El estudio te agradece los servicios prestados."],
];

export default function Productor() {
  const [paso, setPaso] = useState("portada");
  const [saliendo, setSaliendo] = useState(false);
  const [sIdx, setSIdx] = useState(Math.floor(Math.random() * SUSTANTIVOS.length));
  const [aIdx, setAIdx] = useState(Math.floor(Math.random() * ADJETIVOS.length));
  const [spinId, setSpinId] = useState(0);
  const [girando, setGirando] = useState(false);
  const [girado, setGirado] = useState(false);
  const [genero, setGenero] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [revelado, setRevelado] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [telon, setTelon] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [tenso, setTenso] = useState(null);
  const [fondos, setFondos] = useState(FONDOS_INICIALES);
  const [pelis, setPelis] = useState([]); // temporada
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const [nombre, setNombre] = useState(() => { try { return localStorage.getItem("productor") || ""; } catch (e) { return ""; } });
  const [nombreTmp, setNombreTmp] = useState(nombre);
  const guardarNombre = () => { const n = nombreTmp.trim().slice(0, 24); setNombre(n); try { localStorage.setItem("productor", n); } catch (e) {} irA("genero"); };
  const productor = nombre || "Productor anónimo";
  const enCurso = !["portada", "nombre", "temporada"].includes(paso) && pelis.length < PELIS_POR_TEMPORADA;
  useEffect(() => { if (!enCurso) return; const h = (e) => { e.preventDefault(); e.returnValue = ""; }; window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h); }, [enCurso]);
  const abandonar = () => { setConfirmarSalida(false); irA("portada", () => { setFondos(FONDOS_INICIALES); setPelis([]); setGirado(false); setFicha(null); setResultado(null); setGenero(null); }); };

  const nPeli = pelis.length + 1;
  const irA = (p, fn) => { setSaliendo(true); setTimeout(() => { fn && fn(); setPaso(p); setSaliendo(false); }, 240); };
  const darVuelta = () => { if (tenso !== null) return; setTenso(revelado); setTimeout(() => { setRevelado((r) => r + 1); setTenso(null); }, 1000); };
  const girar = () => {
    if (girando) return;
    // nunca repetir el título actual ni uno ya usado en la temporada
    const usados = new Set([`${sIdx}-${aIdx}`, ...pelis.map((p) => p.clave)]);
    let ns, na, intentos = 0;
    do { ns = Math.floor(Math.random() * SUSTANTIVOS.length); na = Math.floor(Math.random() * ADJETIVOS.length); intentos++; } while (usados.has(`${ns}-${na}`) && intentos < 50);
    setGirado(false); setGirando(true); setSIdx(ns); setAIdx(na); setSpinId((x) => x + 1);
  };
  const titulo = `${SUSTANTIVOS[sIdx]} ${ADJETIVOS[aIdx]}`;
  const elegirGenero = (g) => irA("ruleta", () => { setGenero(g); setGirado(false); });
  const repartir = () => irA("mazos", () => { setFicha({ genero, protagonista: pick(PROTAGONISTAS), situacion: pick(SITUACIONES), director: pick(DIRECTORES), actor1: pick(ACTORES), actor2: pick(ACTRICES), presupuesto: null, variante: Math.floor(Math.random() * 12) }); setRevelado(0); });
  const mazos = ficha ? [
    { nombre: "Protagonista", valor: ficha.protagonista, Icono: CircleUserRound },
    { nombre: "Conflicto", valor: ficha.situacion.texto, Icono: Swords },
    { nombre: "Dirige", valor: ficha.director.n, Icono: Video },
    { nombre: "Actor", valor: ficha.actor1.n, Icono: Star },
    { nombre: "Actriz", valor: ficha.actor2.n, Icono: (p) => <Star {...p} fill={p.color} /> },
  ] : [];
  const irAPresupuesto = () => irA("presupuesto");
  const lanzar = (pres) => {
    if (costoDe(ficha, pres) > fondos) return; // nunca estrenar por encima de la caja
    const f = { ...ficha, presupuesto: pres };
    setFicha(f); setTelon(true);
    setTimeout(() => { const r = estrenar(f); setResultado(r); setFondos((x) => Math.round(x - r.costo + r.recaudacion)); setPelis((ps) => [...ps, { titulo, clave: `${sIdx}-${aIdx}`, genero: f.genero.nombre, resultado: r.resultado, critica: r.critica, ficha: f, res: r }]); setPaso("poster"); setCopiado(false); }, 700);
    setTimeout(() => setTelon(false), 1250);
  };
  const siguiente = () => {
    const quebrado = fondos < Math.min(...PRESUPUESTOS.map((p) => p.base * 1.5));
    if (pelis.length >= PELIS_POR_TEMPORADA || quebrado) irA("temporada");
    else irA("genero", () => { setGirado(false); setFicha(null); setResultado(null); setGenero(null); });
  };
  const nuevaTemporada = () => irA("genero", () => { setFondos(FONDOS_INICIALES); setPelis([]); setGirado(false); setFicha(null); setResultado(null); setGenero(null); });
  const rango = TITULOS_PRODUCTOR.find(([min]) => fondos >= min) || TITULOS_PRODUCTOR[TITULOS_PRODUCTOR.length - 1];
  const textoCompartir = () => { const r = resultado, f = ficha; const gano = r.resultado >= 0 ? `ganó ${M(r.resultado)}` : `perdió ${M(-r.resultado)}`; return `🎬 ${productor} presenta "${titulo}"\n${f.genero.nombre} dirigida por ${f.director.n}, con ${f.actor1.n} y ${f.actor2.n}.\n${Esp(r.espectadores)} de espectadores, ${gano}.\nCrítica ${r.critica.toFixed(1)} · Público ${r.publico.toFixed(1)}\n${r.premio}\n${r.secuela}\nhttps://${URL_JUEGO}`; };
  const textoTemporada = () => `🎬 Temporada de ${productor}: ${rango[1]}\n${pelis.map((p) => `${p.titulo} (${p.genero}): ${p.resultado >= 0 ? "ganó" : "perdió"} ${M(Math.abs(p.resultado))}`).join("\n")}\nCerré con ${M(fondos)} en caja.\n¿Te animás? https://${URL_JUEGO}`;
  const compartir = async (t) => { try { if (navigator.share) { await navigator.share({ text: t }); return; } } catch (e) {} try { await navigator.clipboard.writeText(t); setCopiado(true); } catch (e) {} };
  const sinopsis = ficha ? `${ficha.protagonista}. ${ficha.situacion.texto}. ${ficha.genero.tag}` : "";
  const tituloVisible = girado || ["mazos", "presupuesto"].includes(paso);
  const conMarquesina = ["ruleta", "mazos", "presupuesto"].includes(paso);
  const subMarq = paso === "ruleta" && !girado ? `Elegí el título de su ${genero ? genero.nombre.toLowerCase() : "película"}` : genero ? genero.nombre : "En cartel";

  return (
    <div className="min-h-screen w-full flex justify-center relative overflow-hidden" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, #1E1708, ${NEGRO} 70%)`, color: MARFIL, fontFamily: UI }}>
      <style>{CSS}</style>
      {paso !== "portada" && <Rayos />}
      <div className="w-full max-w-md px-4 py-6 relative">
        {paso === "portada" && <Portada onStart={() => irA("nombre")} />}

        {paso === "nombre" && (
          <div className="panel flex flex-col items-center text-center" style={{ marginTop: "12vh" }}>
            <Estatuilla h={70} />
            <div className="mt-6" style={{ ...versal(11), color: ORO }}>¿Cómo se llama el productor?</div>
            <Filete w={140} my={10} />
            <input value={nombreTmp} onChange={(e) => setNombreTmp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && guardarNombre()} maxLength={24} placeholder="Tu nombre" autoFocus
              className="w-full text-center mt-2" style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, letterSpacing: ".06em", color: MARFIL, background: NEGRO, border: `1px solid ${ORO}`, boxShadow: `inset 0 0 0 3px ${NEGRO}, inset 0 0 0 4px ${ORO}55`, padding: "14px 16px", outline: "none", maxWidth: 320 }} />
            <p style={{ fontSize: 12, color: GRIS, fontStyle: "italic", marginTop: 10 }}>Así va a firmar los pósters y los resultados que compartas.</p>
            <BotonOro onClick={guardarNombre} className="w-full mt-6" style={{ maxWidth: 320 }}>{nombreTmp.trim() ? "Empezar la temporada" : "Seguir como anónimo"}</BotonOro>
          </div>
        )}

        {!["portada", "nombre"].includes(paso) && (
          <>
            {/* franja de temporada */}
            <div className="flex justify-between items-center mb-4 px-1" style={{ ...versal(10), color: ORO }}>
              <span>{productor} · {paso === "temporada" ? "cierre" : `película ${Math.min(nPeli, PELIS_POR_TEMPORADA)} de ${PELIS_POR_TEMPORADA}`}</span>
              <span className="flex items-center gap-2"><Banknote size={14} strokeWidth={1.6} /> {M(fondos)} en caja</span>
            </div>
            {enCurso && !confirmarSalida && <button onClick={() => setConfirmarSalida(true)} className="block mx-auto mb-4" style={{ fontFamily: UI, fontSize: 12, color: GRIS, background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Abandonar la temporada</button>}
            {confirmarSalida && (
              <Marco fondo={LACA} pad={14} className="mb-4 text-center panel">
                <p style={{ fontSize: 14, color: MARFIL, lineHeight: 1.5 }}>Te {PELIS_POR_TEMPORADA - pelis.length === 1 ? "queda una película" : `quedan ${PELIS_POR_TEMPORADA - pelis.length} películas`} por producir y {M(fondos)} en caja. Si salís ahora, la temporada se pierde.</p>
                <div className="flex gap-3 mt-3">
                  <BotonNegro onClick={abandonar} className="flex-1">Salir igual</BotonNegro>
                  <BotonOro onClick={() => setConfirmarSalida(false)} className="flex-1">Seguir produciendo</BotonOro>
                </div>
              </Marco>
            )}
            {conMarquesina && <Marquesina encendida={tituloVisible} texto={tituloVisible ? titulo.toUpperCase() : "— — —"} sub={subMarq} />}

            <div className={saliendo ? "panel-out" : "panel"} key={paso}>
              {paso === "genero" && (
                <>
                  <div className="text-center mb-1" style={{ ...versal(11), color: ORO }}>¿Qué película quiere hacer?</div>
                  <Filete w={140} my={8} />
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {GENEROS.map((g, i) => { const Ic = ICONO_GENERO[g.id]; return (
                      <button key={g.id} onClick={() => elegirGenero(g)} className="carta px-2 py-4 flex flex-col items-center gap-2 text-center" style={{ animationDelay: `${i * 50}ms`, background: LACA, border: `1px solid ${ORO}`, boxShadow: `inset 0 0 0 3px ${LACA}, inset 0 0 0 4px ${ORO}55`, color: MARFIL, cursor: "pointer", minHeight: 96 }}>
                        <Ic size={26} color={ORO} strokeWidth={1.5} />
                        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 11.5, letterSpacing: ".03em", lineHeight: 1.2 }}>{g.nombre}</span>
                      </button>); })}
                  </div>
                </>
              )}

              {paso === "ruleta" && (
                <>
                  <div className="flex gap-4">
                    <Tambor items={SUSTANTIVOS} target={sIdx} spinId={spinId} delay={0} girado={girado} onStop={() => {}} />
                    <Tambor items={ADJETIVOS} target={aIdx} spinId={spinId} delay={0.7} girado={girado} onStop={() => { setGirando(false); setGirado(true); }} />
                  </div>
                  <div className="flex gap-3 mt-6">
                    {girado
                      ? <><BotonNegro onClick={girar} className="flex-1"><RefreshCw size={15} strokeWidth={1.8} /> Otra vez</BotonNegro><BotonOro onClick={repartir} className="flex-1 panel"><Film size={16} strokeWidth={1.8} /> Preproducción</BotonOro></>
                      : <BotonOro onClick={girar} disabled={girando} className="w-full"><RefreshCw size={16} strokeWidth={1.8} /> {girando ? "Girando" : "Girar la ruleta"}</BotonOro>}
                  </div>
                </>
              )}

              {paso === "mazos" && (
                <>
                  <div className="flex flex-col gap-2">
                    {mazos.map((m, i) => <Carta key={m.nombre} i={i} {...m} abierta={i < revelado} puede={i === revelado && tenso === null} tenso={tenso === i} onFlip={darVuelta} />)}
                  </div>
                  <div className="mt-6">
                    {revelado < mazos.length ? (
                      <BotonNegro onClick={darVuelta} className="w-full">{tenso !== null ? "…" : "Dar vuelta la próxima carta"}</BotonNegro>
                    ) : (
                      <div className="panel">
                        <Filete w={160} my={6} />
                        <p className="text-center" style={{ fontSize: 15, lineHeight: 1.55, margin: "10px 0 16px", fontStyle: "italic", color: MARFIL }}>{sinopsis}</p>
                        <BotonOro onClick={irAPresupuesto} grande className="w-full"><Banknote size={22} strokeWidth={1.8} /> Decidir el presupuesto</BotonOro>
                      </div>
                    )}
                  </div>
                </>
              )}

              {paso === "presupuesto" && ficha && (
                <>
                  <div className="text-center mb-1" style={{ ...versal(11), color: ORO }}>¿Cuánto le pone a esta película?</div>
                  <Filete w={140} my={8} />
                  <p className="text-center" style={{ fontSize: 13, color: GRIS, fontStyle: "italic", marginBottom: 14 }}>Con {ficha.director.n}, {ficha.actor1.n} y {ficha.actor2.n} en {ficha.genero.nombre.toLowerCase()}.</p>
                  <div className="flex flex-col gap-3">
                    {PRESUPUESTOS.map((pr, i) => { const c = costoDe(ficha, pr); const puede = c <= fondos; const minimo = PRESUPUESTOS[0].base * 1.5 + 3 * PRESUPUESTOS[0].factor * 1.5; const ultima = pelis.length >= PELIS_POR_TEMPORADA - 1; const todoONada = puede && fondos - c < minimo; return (
                      <button key={pr.nombre} onClick={() => puede && lanzar(pr)} disabled={!puede} className="carta text-left px-4 py-3 flex items-center gap-3" style={{ animationDelay: `${i * 70}ms`, background: puede ? LACA : NEGRO, border: `1px solid ${puede ? ORO : "#3A3320"}`, boxShadow: puede ? `inset 0 0 0 3px ${LACA}, inset 0 0 0 4px ${ORO}55` : "none", color: puede ? MARFIL : "#5C5642", cursor: puede ? "pointer" : "default", opacity: puede ? 1 : 0.6 }}>
                        <div className="flex-1">
                          <div style={{ ...versal(12), color: puede ? ORO_C : "#5C5642" }}>{pr.nombre}</div>
                          <div style={{ fontSize: 12, color: GRIS, fontStyle: "italic", marginTop: 2 }}>{pr.desc}</div>
                        </div>
                        <div className="text-right">
                          <div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 22, color: puede ? MARFIL : "#5C5642" }}>{M(c)}</div>
                          <div style={{ fontSize: 11, color: todoONada ? ROJO : GRIS, fontWeight: todoONada ? 700 : 400 }}>{!puede ? "no alcanza" : todoONada ? (ultima ? "Se juega toda la caja en la última" : "Todo o nada: si pierde, se acabó") : `quedan ${M(fondos - c)}`}</div>
                        </div>
                      </button>); })}
                  </div>
                  <p className="text-center mt-4" style={{ fontSize: 12, color: GRIS, fontStyle: "italic" }}>Incluye producción y marketing. Lo que recaude vuelve a la caja.</p>
                </>
              )}

              {paso === "poster" && resultado && (
                <>
                  <div className="text-center mb-4" style={{ ...versal(11), color: ORO }}>Su película está en cartel</div>
                  <Poster titulo={titulo} ficha={ficha} resultado={resultado} conResultado={false} productor={nombre} />
                  <BotonNegro onClick={() => irA("resultado")} className="w-full mt-3"><Ticket size={15} strokeWidth={1.8} /> Ver cómo le fue</BotonNegro>
                </>
              )}

              {paso === "resultado" && resultado && (
                <>
                  <Marco fondo={MARFIL} pad={18} style={{ color: NEGRO }}>
                    <div className="text-center" style={{ ...versal(10), color: ORO_O }}>Y el resultado es</div>
                    <Filete w={110} my={8} />
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <Dato label="Espectadores" valor={resultado.espectadores} fmt={Esp} Icono={Ticket} />
                      <Dato label="Recaudación" valor={resultado.recaudacion} fmt={M} Icono={Banknote} />
                      <Dato label="Costó" valor={resultado.costo} fmt={M} Icono={Coins} />
                      <Dato label={resultado.resultado >= 0 ? "Ganó" : "Perdió"} valor={Math.abs(resultado.resultado)} fmt={M} color={resultado.resultado >= 0 ? "#2F6B3A" : ROJO} Icono={resultado.resultado >= 0 ? TrendingUp : TrendingDown} />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <Barra label="Crítica" v={resultado.critica} texto={resultado.critText} />
                      <Barra label="Público" v={resultado.publico} texto={resultado.pubText} />
                    </div>
                    <div className="mt-4 flex flex-col gap-1" style={{ fontSize: 14, lineHeight: 1.45 }}>
                      <p className="flex items-start gap-2"><Award size={16} color={resultado.nivel > 0 ? ORO_O : resultado.nivel < 0 ? ROJO : "#9A9A9A"} strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />{resultado.premio}</p>
                      {resultado.premios.length > 0 && (
                        <div className="flex flex-col gap-1 my-1 py-2 px-3" style={{ borderTop: `1px solid ${ORO}55`, borderBottom: `1px solid ${ORO}55` }}>
                          {resultado.premios.map((pr) => <div key={pr} className="flex items-center gap-2" style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 600, letterSpacing: ".04em", color: resultado.nivel < 0 ? ROJO : pr.toLowerCase().includes("cóndor") || pr.toLowerCase().includes("premio sur") ? "#55555E" : ORO_O }}><IconoPremio texto={pr} h={24} />{pr}</div>)}
                        </div>
                      )}
                      <p className="flex items-start gap-2"><Film size={16} color="#6A6A6A" strokeWidth={1.8} style={{ marginTop: 2, flexShrink: 0 }} />{resultado.secuela}</p>
                      {resultado.notas.map((n) => <p key={n} style={{ fontStyle: "italic", color: "#4A4A4A" }}>{n}</p>)}
                    </div>
                    <div className="text-center mt-4 pt-3" style={{ borderTop: `1px solid ${ORO}55`, ...versal(10), color: ORO_O }}>Caja del productor: {M(fondos)}</div>
                  </Marco>
                  <div className="mt-4"><Poster titulo={titulo} ficha={ficha} resultado={resultado} conResultado={true} etiqueta="Compartir póster con resultado" oculto productor={nombre} /></div>
                  <div className="flex gap-3 mt-3">
                    <BotonNegro onClick={() => compartir(textoCompartir())} className="flex-1"><Share2 size={15} strokeWidth={1.8} /> {copiado ? "Copiado" : "Compartir texto"}</BotonNegro>
                    <BotonOro onClick={siguiente} className="flex-1">{pelis.length >= PELIS_POR_TEMPORADA ? "Cerrar temporada" : "Siguiente película"}</BotonOro>
                  </div>
                </>
              )}

              {paso === "temporada" && (
                <>
                  <PosterTemporada pelis={pelis} fondos={fondos} rango={rango} productor={nombre} />
                  <Marco fondo={MARFIL} pad={20} style={{ color: NEGRO }} className="text-center mt-5">
                    <div style={{ ...versal(10), color: ORO_O }}>Su temporada como productor</div>
                    <Filete w={110} my={8} />
                    <Estatuilla h={90} cls="mx-auto mt-2 destello" color={fondos < 120 ? ROJO : undefined} />
                    <div className="mt-3" style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, letterSpacing: ".06em" }}>{rango[1]}</div>
                    <p style={{ fontSize: 13, color: "#5A5A5A", fontStyle: "italic", marginTop: 4 }}>{rango[2]}</p>
                    <div className="mt-4 flex flex-col gap-2 text-left">
                      {pelis.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-3" style={{ borderTop: `1px solid ${ORO}55`, paddingTop: 8 }}>
                          <div><div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 18 }}>{p.titulo.toUpperCase()}</div><div style={{ fontSize: 12, color: "#6A6A6A" }}>{p.genero} · crítica {p.critica.toFixed(1)}</div></div>
                          <div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 18, color: p.resultado >= 0 ? "#2F6B3A" : ROJO }}>{p.resultado >= 0 ? "+" : "−"}{M(Math.abs(p.resultado))}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${ORO}` }}>
                      <div style={{ ...versal(9), color: "#6A6A6A" }}>Empezó con {M(FONDOS_INICIALES)} · cerró con</div>
                      <div style={{ fontFamily: DISPLAY, fontWeight: DW, fontSize: 34, color: fondos >= FONDOS_INICIALES ? "#2F6B3A" : ROJO }}>{M(fondos)}</div>
                    </div>
                  </Marco>
                  <div className="flex gap-3 mt-4">
                    <BotonNegro onClick={() => compartir(textoTemporada())} className="flex-1"><Share2 size={15} strokeWidth={1.8} /> {copiado ? "Copiado" : "Compartir texto"}</BotonNegro>
                    <BotonOro onClick={nuevaTemporada} className="flex-1"><RefreshCw size={15} strokeWidth={1.8} /> Nueva temporada</BotonOro>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {telon && (
        <div className="absolute inset-0 tel flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(180deg, #A5222C, ${ROJO})`, zIndex: 50 }}>
          <Rayos size={1400} alpha={0.35} top={-200} />
          <div className="clac flex items-center gap-3 relative" style={{ ...versal(30), color: ORO_C, textShadow: "0 3px 0 #4A0C12" }}><Clapperboard size={40} strokeWidth={1.5} /> Estreno</div>
        </div>
      )}
    </div>
  );
}
