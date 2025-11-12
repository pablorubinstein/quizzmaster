import { drizzle } from "drizzle-orm/mysql2";
import { quizzes } from "./drizzle/schema.ts";
import 'dotenv/config'; // Loads .env file at the start


const db = drizzle(process.env.DATABASE_URL);

const sampleQuizzes = [
  // {
  //   title: "General Knowledge Quiz",
  //   description: "Test your knowledge on various topics",
  //   content: JSON.stringify({
  //       title: "General Knowledge Quiz",
  //       description: "Test your knowledge on various topics",
  //       questions: [
  //         {
  //           question: "What is the capital of France?",
  //           options: ["London", "Paris", "Berlin", "Madrid"],
  //           correctAnswer: "Paris",
  //         },
  //         {
  //           question: "Which planet is known as the Red Planet?",
  //           options: ["Venus", "Mars", "Jupiter", "Saturn"],
  //           correctAnswer: "Mars",
  //         },
  //       {
  //         question: "What is the largest ocean on Earth?",
  //         options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
  //         correctAnswer: "Pacific Ocean",
  //       },
  //       {
  //         question: "Who wrote 'Romeo and Juliet'?",
  //         options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
  //         correctAnswer: "William Shakespeare",
  //       },
  //       {
  //         question: "What is the chemical symbol for Gold?",
  //         options: ["Go", "Gd", "Au", "Ag"],
  //         correctAnswer: "Au",
  //       },
  //     ],
  //   }),
  // },
  // {
  //   title: "Science Quiz",
  //   description: "Questions about biology, chemistry, and physics",
  //   content: JSON.stringify({
  //     title: "Science Quiz",
  //     description: "Questions about biology, chemistry, and physics",
  //     questions: [
  //       {
  //         question: "What is the powerhouse of the cell?",
  //         options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
  //         correctAnswer: "Mitochondria",
  //       },
  //       {
  //         question: "What is the pH of pure water at 25°C?",
  //         options: ["5", "6", "7", "8"],
  //         correctAnswer: "7",
  //       },
  //       {
  //         question: "What is the SI unit of force?",
  //         options: ["Joule", "Watt", "Newton", "Pascal"],
  //         correctAnswer: "Newton",
  //       },
  //       {
  //         question: "How many bones are in the adult human body?",
  //         options: ["186", "206", "226", "246"],
  //         correctAnswer: "206",
  //       },
  //       {
  //         question: "What is the most abundant element in the universe?",
  //         options: ["Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
  //         correctAnswer: "Hydrogen",
  //       },
  //     ],
  //   }),
  // },
  // {
  //   title: "History Quiz",
  //   description: "Questions about world history and events",
  //   content: JSON.stringify({
  //     title: "History Quiz",
  //     description: "Questions about world history and events",
  //     questions: [
  //       {
  //         question: "In what year did World War II end?",
  //         options: ["1943", "1944", "1945", "1946"],
  //         correctAnswer: "1945",
  //       },
  //       {
  //         question: "Who was the first President of the United States?",
  //         options: ["Thomas Jefferson", "George Washington", "John Adams", "James Madison"],
  //         correctAnswer: "George Washington",
  //       },
  //       {
  //         question: "In which year did the Titanic sink?",
  //         options: ["1910", "1911", "1912", "1913"],
  //         correctAnswer: "1912",
  //       },
  //       {
  //         question: "Which empire built the Great Wall of China?",
  //         options: ["Han Dynasty", "Ming Dynasty", "Qin Dynasty", "Tang Dynasty"],
  //         correctAnswer: "Ming Dynasty",
  //       },
  //       {
  //         question: "In what year did the Berlin Wall fall?",
  //         options: ["1987", "1988", "1989", "1990"],
  //         correctAnswer: "1989",
  //       },
  //     ],
  //   }),
  // },

  {
    "title": "Surtido 1",
    "description": "navegación, meteorología, mareas y reglamentación marítima.",
    content: JSON.stringify({
      "title": "Surtido 1",
      "description": "navegación, meteorología, mareas y reglamentación marítima.",
      "questions": [
        {
          "question": "¿Qué instrumento se utiliza para determinar el rumbo magnético?",
          "options": ["Barómetro", "Compás", "Anemómetro", "Sextante"],
          "correctAnswer": "Compás"
        },
        {
          "question": "¿Qué indica la marca de tope de un enfilamiento en una carta náutica?",
          "options": ["Una boya de peligro aislado", "Una alineación de dos puntos para mantener el rumbo", "Una zona de pesca", "Una corriente"],
          "correctAnswer": "Una alineación de dos puntos para mantener el rumbo"
        },
        {
          "question": "¿Qué significan las siglas GPS?",
          "options": ["Global Positioning System", "General Position Signal", "Geographical Projection System", "Ground Path System"],
          "correctAnswer": "Global Positioning System"
        },
        {
          "question": "¿Qué se entiende por 'deriva' en navegación?",
          "options": ["El desplazamiento del barco por efecto del viento", "El desvío de la derrota por efecto de la corriente o el viento", "El rumbo verdadero", "El movimiento del timón"],
          "correctAnswer": "El desvío de la derrota por efecto de la corriente o el viento"
        },
        {
          "question": "¿Qué rumbo se obtiene al corregir el rumbo magnético por declinación?",
          "options": ["Rumbo verdadero", "Rumbo de aguja", "Rumbo de marcación", "Rumbo de corriente"],
          "correctAnswer": "Rumbo verdadero"
        },
        {
          "question": "¿Qué color indica estribor en las luces de navegación?",
          "options": ["Rojo", "Verde", "Blanco", "Amarillo"],
          "correctAnswer": "Verde"
        },
        {
          "question": "¿Qué representa la rosa de los vientos en una carta náutica?",
          "options": ["Las corrientes", "Los rumbos y orientaciones magnéticas", "Las alturas de marea", "Las profundidades"],
          "correctAnswer": "Los rumbos y orientaciones magnéticas"
        },
        {
          "question": "¿Qué instrumento se utiliza para medir la velocidad del viento?",
          "options": ["Barómetro", "Anemómetro", "Higrómetro", "Ecosonda"],
          "correctAnswer": "Anemómetro"
        },
        {
          "question": "¿Qué nubes indican la posible llegada de un frente frío?",
          "options": ["Cúmulos", "Cirros", "Estratos", "Cumulonimbos"],
          "correctAnswer": "Cumulonimbos"
        },
        {
          "question": "¿Qué mide un barómetro?",
          "options": ["La humedad", "La presión atmosférica", "La dirección del viento", "La temperatura del aire"],
          "correctAnswer": "La presión atmosférica"
        },
        {
          "question": "¿Qué viento sopla del sudeste en el Río de la Plata?",
          "options": ["Pampero", "Sudestada", "Norte", "Zonda"],
          "correctAnswer": "Sudestada"
        },
        {
          "question": "¿Qué indica una rápida caída de la presión barométrica?",
          "options": ["Mejoría del tiempo", "Aproximación de un frente frío o tormenta", "Viento en calma", "Cambio de corriente"],
          "correctAnswer": "Aproximación de un frente frío o tormenta"
        },
        {
          "question": "¿Qué tipo de nubes suelen asociarse con buen tiempo y viento moderado?",
          "options": ["Cúmulos", "Cumulonimbos", "Estratos", "Nimbostratos"],
          "correctAnswer": "Cúmulos"
        },
        {
          "question": "¿Qué fenómeno meteorológico provoca aumento del nivel del río en el Río de la Plata?",
          "options": ["Pampero", "Sudestada", "Frente cálido", "Alta presión"],
          "correctAnswer": "Sudestada"
        },
        {
          "question": "¿Qué se observa en un anemómetro cuando pasa un frente frío?",
          "options": ["Disminuye la velocidad del viento", "El viento rota al sudoeste y aumenta su intensidad", "El viento se calma", "El viento gira al norte"],
          "correctAnswer": "El viento rota al sudoeste y aumenta su intensidad"
        },
        {
          "question": "¿Qué es la amplitud de marea?",
          "options": ["La diferencia de hora entre pleamar y bajamar", "La diferencia de altura entre pleamar y bajamar", "El tiempo que dura la pleamar", "La corriente superficial"],
          "correctAnswer": "La diferencia de altura entre pleamar y bajamar"
        },
        {
          "question": "¿Qué es una pleamar?",
          "options": ["El momento de mayor altura de la marea", "El momento de menor altura de la marea", "El cambio de corriente", "El paso del frente frío"],
          "correctAnswer": "El momento de mayor altura de la marea"
        },
        {
          "question": "¿Qué son las corrientes de marea?",
          "options": ["Corrientes producidas por el viento", "Corrientes periódicas debidas al movimiento de las mareas", "Corrientes permanentes de fondo", "Ondas de presión atmosférica"],
          "correctAnswer": "Corrientes periódicas debidas al movimiento de las mareas"
        },
        {
          "question": "¿Qué factores influyen en la altura de la marea?",
          "options": ["Fase lunar y presión atmosférica", "Temperatura del agua y viento", "Latitud y longitud", "Salinidad"],
          "correctAnswer": "Fase lunar y presión atmosférica"
        },
        {
          "question": "¿Cuántas pleamares hay generalmente en un día lunar?",
          "options": ["Una", "Dos", "Tres", "Cuatro"],
          "correctAnswer": "Dos"
        },
        {
          "question": "¿Qué ocurre durante las mareas vivas?",
          "options": ["Las mareas tienen menor amplitud", "Las mareas tienen mayor amplitud", "No hay corrientes", "Las corrientes se invierten"],
          "correctAnswer": "Las mareas tienen mayor amplitud"
        },
        {
          "question": "¿Qué es la bajamar?",
          "options": ["El momento de menor altura del nivel del mar", "El cambio de corriente", "El aumento de presión atmosférica", "La corriente de deriva"],
          "correctAnswer": "El momento de menor altura del nivel del mar"
        },
        {
          "question": "¿Qué indica el RIPA cuando dos veleros se aproximan con riesgo de abordaje y ambos con viento en bandas opuestas?",
          "options": ["El que recibe el viento por babor debe maniobrar", "El que recibe el viento por estribor debe maniobrar", "Ambos deben virar", "El de mayor tamaño tiene prioridad"],
          "correctAnswer": "El que recibe el viento por babor debe maniobrar"
        },
        {
          "question": "Según el RIPA, ¿qué significa una luz roja y una luz verde vistas simultáneamente?",
          "options": ["Se observa la popa de una embarcación", "Se aproxima una embarcación de frente", "Embarcación fondeada", "Embarcación en navegación de vuelta encontrada"],
          "correctAnswer": "Se aproxima una embarcación de frente"
        },
        {
          "question": "¿Qué indica una boya roja cilíndrica (tipo ‘lateral babor’) en el sistema de balizamiento A?",
          "options": ["Dejarla por estribor al ingresar al puerto", "Dejarla por babor al ingresar al puerto", "Zona prohibida", "Peligro aislado"],
          "correctAnswer": "Dejarla por babor al ingresar al puerto"
        },
        {
          "question": "¿Qué documento regula las condiciones para habilitar una embarcación deportiva en Argentina?",
          "options": ["RIPA", "REGINAVE", "Ley de Navegación Comercial", "Código Civil"],
          "correctAnswer": "REGINAVE"
        },
        {
          "question": "¿Qué elemento es obligatorio según el REGINAVE para embarcaciones de vela?",
          "options": ["Extintor de incendios", "Aro salvavidas", "Ancla con cabo y cadena", "Todos los anteriores"],
          "correctAnswer": "Todos los anteriores"
        },
        {
          "question": "¿Qué indica una señal sonora de cinco pitadas cortas?",
          "options": ["Maniobra a estribor", "Desacuerdo o peligro", "Inicio de navegación", "Vuelta encontrada"],
          "correctAnswer": "Desacuerdo o peligro"
        },
        {
          "question": "¿Qué luces debe exhibir un velero navegando de noche?",
          "options": ["Luz blanca todo horizonte", "Luz roja a babor, verde a estribor y blanca de alcance", "Dos luces blancas verticales", "Solo luz de tope"],
          "correctAnswer": "Luz roja a babor, verde a estribor y blanca de alcance"
        },
        {
          "question": "¿Cuál es la obligación principal del patrón según el REGINAVE?",
          "options": ["Usar el chaleco salvavidas", "Garantizar la seguridad de la embarcación y su tripulación", "Llevar la documentación al día", "Conocer los nudos marineros"],
          "correctAnswer": "Garantizar la seguridad de la embarcación y su tripulación"
        }
      ]
    })
  },
  {
    "title": "Boyas y Señales Marítimas I",
    "description": "Preguntas sobre características, colores, formas y luces de las boyas según el Sistema IALA Región A.",
    content: JSON.stringify({
      "title": "Boyas y Señales Marítimas",
      "description": "Preguntas sobre características, colores, formas y luces de las boyas según el Sistema IALA Región A.",
      "questions": [
        {
          "question": "¿Qué sistema de balizamiento utiliza Argentina?",
          "options": ["IALA Región A", "IALA Región B", "Sistema Internacional OMI", "Ninguno"],
          "correctAnswer": "IALA Región A"
        },
        {
          "question": "En el sistema IALA Región A, ¿de qué color son las boyas de babor?",
          "options": ["Rojas", "Verdes", "Amarillas", "Negras"],
          "correctAnswer": "Rojas"
        },
        {
          "question": "¿De qué forma son las boyas laterales de babor?",
          "options": ["Cilíndrica (tipo lata)", "Cónica", "Esférica", "En cruz"],
          "correctAnswer": "Cilíndrica (tipo lata)"
        },
        {
          "question": "¿De qué color son las boyas laterales de estribor en la Región A?",
          "options": ["Rojas", "Verdes", "Negras", "Amarillas"],
          "correctAnswer": "Verdes"
        },
        {
          "question": "¿Qué forma tiene la boya lateral de estribor?",
          "options": ["Cilíndrica", "Cónica", "Esférica", "De castillete"],
          "correctAnswer": "Cónica"
        },
        {
          "question": "Al ingresar a un puerto, ¿por qué banda deben dejarse las boyas rojas en el sistema IALA A?",
          "options": ["Babor", "Estribor", "Indistinto", "Depende del viento"],
          "correctAnswer": "Babor"
        },
        {
          "question": "¿Qué color y forma tiene una boya de peligro aislado?",
          "options": ["Negra con una o dos franjas rojas, esférica", "Roja con franja verde, cónica", "Amarilla, cilíndrica", "Verde con franja blanca, castillete"],
          "correctAnswer": "Negra con una o dos franjas rojas, esférica"
        },
        {
          "question": "¿Qué tope tiene una boya de peligro aislado?",
          "options": ["Dos esferas negras verticales", "Dos conos negros base con base", "Dos conos negros vértice con vértice", "Una cruz amarilla"],
          "correctAnswer": "Dos esferas negras verticales"
        },
        {
          "question": "¿Qué característica tiene la luz de una boya de peligro aislado?",
          "options": ["Dos destellos blancos", "Destellos rojos rápidos", "Luz fija verde", "Destellos amarillos continuos"],
          "correctAnswer": "Dos destellos blancos"
        },
        {
          "question": "¿Qué indica una boya de aguas seguras?",
          "options": ["Canal principal", "Peligro aislado", "Fondo rocoso", "Zona de fondeo"],
          "correctAnswer": "Canal principal"
        },
        {
          "question": "¿De qué color es una boya de aguas seguras?",
          "options": ["Roja y blanca vertical", "Negra y roja horizontal", "Amarilla", "Verde"],
          "correctAnswer": "Roja y blanca vertical"
        },
        {
          "question": "¿Qué tope tiene una boya de aguas seguras?",
          "options": ["Una esfera roja", "Dos conos negros vértice con vértice", "Una cruz amarilla", "Una esfera negra"],
          "correctAnswer": "Una esfera roja"
        },
        {
          "question": "¿Qué luz exhibe una boya de aguas seguras?",
          "options": ["Luz blanca isofase o Morse 'A'", "Luz roja fija", "Luz amarilla centelleante", "Dos destellos verdes"],
          "correctAnswer": "Luz blanca isofase o Morse 'A'"
        },
        {
          "question": "¿Qué indica una boya de peligro especial o zona especial?",
          "options": ["Área de recreo, cables submarinos u obras", "Canal principal", "Peligro aislado", "Puerto deportivo"],
          "correctAnswer": "Área de recreo, cables submarinos u obras"
        },
        ]
    })
  },

   {
    "title": "Boyas y Señales Luminosas II",
    "description": "Sistema de balizamiento marítimo IALA Región A, tipos de boyas, colores, formas y señales luminosas",
    content: JSON.stringify({
      "title": "Boyas y Señales Luminosas II",
      "description": "Sistema de balizamiento marítimo IALA Región A, tipos de boyas, colores, formas y señales luminosas",
      "questions": [
        {
          "question": "¿Qué color identifica a las boyas de babor en el sistema IALA Región A?",
          "options": ["Rojo", "Verde", "Amarillo", "Negro"],
          "correctAnswer": "Rojo"
        },
        {
          "question": "¿Qué color identifica a las boyas de estribor en el sistema IALA Región A?",
          "options": ["Verde", "Rojo", "Amarillo", "Blanco"],
          "correctAnswer": "Verde"
        },
        {
          "question": "¿Qué forma tiene una boya lateral de babor?",
          "options": ["Cónica", "Cilíndrica (castillete)", "Esférica", "Piramidal"],
          "correctAnswer": "Cilíndrica (castillete)"
        },
        {
          "question": "¿Qué forma tiene una boya lateral de estribor?",
          "options": ["Cónica", "Cilíndrica", "Esférica", "Bastón"],
          "correctAnswer": "Cónica"
        },
        {
          "question": "¿Qué significa una boya con bandas rojas y verdes verticales?",
          "options": ["Canal preferido", "Peligro aislado", "Aguas seguras", "Zona de anclaje"],
          "correctAnswer": "Canal preferido"
        },
        {
          "question": "Si la boya tiene bandas rojas y verdes y la franja superior es roja, ¿por qué lado debe dejarse?",
          "options": ["Por babor", "Por estribor", "Por el centro del canal", "Depende del viento"],
          "correctAnswer": "Por babor"
        },
        {
          "question": "¿Qué indica una boya de peligro aislado?",
          "options": ["Un obstáculo rodeado de aguas navegables", "El límite del canal", "Zona de fondeo", "Aguas seguras"],
          "correctAnswer": "Un obstáculo rodeado de aguas navegables"
        },
        {
          "question": "¿Qué color y marca superior tiene una boya de peligro aislado?",
          "options": ["Negra con una o dos bandas rojas y dos bolas negras", "Roja con una cruz", "Amarilla con dos conos opuestos", "Blanca con banda azul"],
          "correctAnswer": "Negra con una o dos bandas rojas y dos bolas negras"
        },
        {
          "question": "¿Qué indica una boya de aguas seguras?",
          "options": ["Zona libre de peligros y navegable en todos los sentidos", "Entrada a puerto", "Zona de fondeo", "Canal preferido a babor"],
          "correctAnswer": "Zona libre de peligros y navegable en todos los sentidos"
        },
        {
          "question": "¿De qué color es una boya de aguas seguras?",
          "options": ["Roja y blanca a franjas verticales", "Negra y amarilla", "Amarilla", "Verde y blanca"],
          "correctAnswer": "Roja y blanca a franjas verticales"
        },
        {
          "question": "¿Qué característica luminosa tiene una boya de aguas seguras?",
          "options": ["Destellos blancos cada 10 segundos", "Luz blanca isofásica o Morse A", "Luz roja fija", "Luz amarilla intermitente"],
          "correctAnswer": "Luz blanca isofásica o Morse A"
        },
        {
          "question": "¿Qué indica una boya amarilla?",
          "options": ["Zona especial o de uso restringido", "Canal lateral de estribor", "Peligro aislado", "Aguas seguras"],
          "correctAnswer": "Zona especial o de uso restringido"
        },
        {
          "question": "¿Qué marca superior tiene una boya especial?",
          "options": ["Una X amarilla", "Dos conos negros", "Dos bolas rojas", "Una cruz blanca"],
          "correctAnswer": "Una X amarilla"
        },
        {
          "question": "¿Qué indica una boya cardinal norte?",
          "options": ["Aguas seguras al norte de la boya", "Aguas seguras al sur", "Aguas seguras al este", "Aguas seguras al oeste"],
          "correctAnswer": "Aguas seguras al norte de la boya"
        },
        {
          "question": "¿Qué colores tiene una boya cardinal norte?",
          "options": ["Negro arriba y amarillo abajo", "Amarillo arriba y negro abajo", "Negro con banda roja", "Amarillo con cruz negra"],
          "correctAnswer": "Negro arriba y amarillo abajo"
        },
        {
          "question": "¿Qué característica luminosa tiene una boya cardinal norte?",
          "options": ["Luz blanca continua", "Destellos continuos rápidos o muy rápidos", "Dos destellos blancos", "Cuatro destellos blancos"],
          "correctAnswer": "Destellos continuos rápidos o muy rápidos"
        },
        {
          "question": "¿Qué indica una boya cardinal sur?",
          "options": ["Aguas seguras al sur de la boya", "Peligro al sur", "Canal preferido al sur", "Zona especial"],
          "correctAnswer": "Aguas seguras al sur de la boya"
        },
        {
          "question": "¿Qué colores tiene una boya cardinal sur?",
          "options": ["Amarillo arriba y negro abajo", "Negro arriba y amarillo abajo", "Negro con banda roja", "Rojo con banda verde"],
          "correctAnswer": "Amarillo arriba y negro abajo"
        },
        {
          "question": "¿Qué característica luminosa tiene una boya cardinal sur?",
          "options": ["Seis destellos rápidos seguidos de uno largo", "Dos destellos blancos", "Cuatro destellos blancos", "Luz roja intermitente"],
          "correctAnswer": "Seis destellos rápidos seguidos de uno largo"
        },
        {
          "question": "¿Qué indica una boya cardinal este?",
          "options": ["Aguas seguras al este de la boya", "Canal preferido al este", "Zona especial", "Aguas restringidas"],
          "correctAnswer": "Aguas seguras al este de la boya"
        },
        {
          "question": "¿Qué colores tiene una boya cardinal este?",
          "options": ["Negro - amarillo - negro", "Amarillo - negro - amarillo", "Rojo - blanco - rojo", "Negro con cruz amarilla"],
          "correctAnswer": "Negro - amarillo - negro"
        },
        {
          "question": "¿Qué característica luminosa tiene una boya cardinal este?",
          "options": ["Tres destellos blancos", "Dos destellos blancos", "Cuatro destellos blancos", "Luz continua blanca"],
          "correctAnswer": "Tres destellos blancos"
        },
        {
          "question": "¿Qué indica una boya cardinal oeste?",
          "options": ["Aguas seguras al oeste de la boya", "Zona de fondeo", "Canal lateral", "Peligro aislado"],
          "correctAnswer": "Aguas seguras al oeste de la boya"
        },
        {
          "question": "¿Qué colores tiene una boya cardinal oeste?",
          "options": ["Amarillo - negro - amarillo", "Negro - amarillo - negro", "Rojo - blanco - rojo", "Amarillo con cruz negra"],
          "correctAnswer": "Amarillo - negro - amarillo"
        },
        {
          "question": "¿Qué característica luminosa tiene una boya cardinal oeste?",
          "options": ["Nueve destellos blancos", "Dos destellos blancos", "Cuatro destellos blancos", "Luz fija blanca"],
          "correctAnswer": "Nueve destellos blancos"
        },
        {
          "question": "¿Qué tipo de boya marca la entrada principal a un puerto?",
          "options": ["Boya de aguas seguras", "Boya cardinal norte", "Boya especial", "Boya de peligro aislado"],
          "correctAnswer": "Boya de aguas seguras"
        },
        {
          "question": "¿Qué significa la abreviatura 'Fl' en la descripción de una luz?",
          "options": ["Flash (destello)", "Fixed light (luz fija)", "Flicker (parpadeo rápido)", "Floating light (luz flotante)"],
          "correctAnswer": "Flash (destello)"
        },
        {
          "question": "¿Qué significa 'Oc' en la descripción de una luz?",
          "options": ["Ocultación (más tiempo encendida que apagada)", "Oscilación", "Ocasional", "Oblicua"],
          "correctAnswer": "Ocultación (más tiempo encendida que apagada)"
        },
        {
          "question": "¿Qué significa 'Iso' en la descripción de una luz?",
          "options": ["Isofásica (tiempos iguales de luz y oscuridad)", "Isolada (peligro aislado)", "Isométrica", "Intermitente"],
          "correctAnswer": "Isofásica (tiempos iguales de luz y oscuridad)"
        },
        {
          "question": "¿Qué indica una boya con luz amarilla intermitente simple?",
          "options": ["Zona especial", "Aguas seguras", "Peligro aislado", "Canal preferido"],
          "correctAnswer": "Zona especial"
        }
      ]
    })
  },

  //  {
  //   "title": "x",
  //   "description": "y",
  //   content: JSON.stringify({
  //     "title": "x",
  //     "description": "y",
  //     "questions": [
  //       {
  //         "question": "z",
  //         "options": ["a", "b", "c", "d"],
  //         "correctAnswer": "a"
  //       },
  //     ]
  //   })
  // },
];

async function seed() {
  try {
    console.log("Seeding database with sample quizzes...");
    
    for (const quiz of sampleQuizzes) {
      await db.insert(quizzes).values(quiz);
      console.log(`✓ Added quiz: ${quiz.title}`);
    }
    
    console.log("\n✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();