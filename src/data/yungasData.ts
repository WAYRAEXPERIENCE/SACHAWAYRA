
export type PackageId = 'A' | 'B' | 'C';

export interface TriviaOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

export interface TriviaQuestion {
  id: string;
  question: string;
  options: TriviaOption[];
  correctOptionId: 'A' | 'B' | 'C';
  explanation: string;
}

export interface Mission {
  id: string;
  code: string;
  qrCode: string;
  stopLabel: string;
  title: string;
  story: string;
  challenge: string;
  allowsPhoto?: boolean;
  trivia: [TriviaQuestion, TriviaQuestion];
  points: number;
  badgeTitle: string;
  isMaxMedal?: boolean;
}

export interface TravelPackage {
  id: PackageId;
  optionLabel: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  regionTag: string;
  durationLabel: string;
  image: string;
  imageAlt: string;
  missions: [Mission, Mission, Mission];
}

export const HERO_IMAGE = '/assets/aistudio/IMAGEN_7_e6e5f64e.jpg';

export const TRAVEL_PACKAGES: Record<PackageId, TravelPackage> = {
  A: {
    id: 'A',
    optionLabel: 'Opción A',
    name: 'Paquete Vivencial',
    subtitle: 'Cultura y Cosecha',
    shortDescription:
      'Camina entre tacanas junto a familias productoras, aprende la cosecha manual de la hoja verde y comparte la mesa yungueña.',
    regionTag: 'La Asunta',
    durationLabel: '3 paradas en parcela',
    image: '/assets/aistudio/images__4__d4fec66e.jpg',
    imageAlt: 'Parcela de cultivos en ladera verde rodeada de bosque en La Asunta, Yungas de La Paz',
    missions: [
      {
        id: 'A1',
        code: 'Misión A1',
        qrCode: 'YUNGAS-A1',
        stopLabel: 'Parada 1 · Cocal tradicional',
        title: 'El Secreto de la Hoja Verde',
        story: 'La coca se cosecha a mano y el acullicu es un símbolo de respeto y energía.',
        challenge: 'Pide a tu anfitrión que te enseñe a desprender la hoja y llena tu mitiña.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'A1-T1',
            question: '¿Cómo se llama el masticado tradicional?',
            options: [
              { id: 'A', text: 'Apthapi' },
              { id: 'B', text: 'Acullicu' },
              { id: 'C', text: "Ch'alla" },
            ],
            correctOptionId: 'B',
            explanation: 'El acullicu es una práctica ancestral de diálogo, respeto y energía en los Andes y Yungas.',
          },
          {
            id: 'A1-T2',
            question: '¿Por qué se cosecha a mano?',
            options: [
              { id: 'A', text: 'Por falta de máquinas' },
              { id: 'B', text: 'Para no dañar los brotes y cuidar la planta' },
              { id: 'C', text: 'Para cambiar de color' },
            ],
            correctOptionId: 'B',
            explanation: 'Desprender hoja por hoja protege los nuevos brotes para que la planta vuelva a dar frutos sanos.',
          },
        ],
        points: 100,
        badgeTitle: 'Cosechador Novato',
      },
      {
        id: 'A2',
        code: 'Misión A2',
        qrCode: 'YUNGAS-A2',
        stopLabel: 'Parada 2 · Terrazas de piedra',
        title: 'El Valor de la Tierra',
        story:
          'Las terrazas de piedra llamadas tacanas sostienen los cultivos en las laderas empinadas de los Yungas, protegiendo el suelo fértil de las lluvias.',
        challenge:
          'Recorre una tacana junto a tu anfitrión, observa cómo circula el agua de lluvia y ayuda a despejar la maleza de una planta.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'A2-T1',
            question: '¿Cómo se llaman las terrazas agrícolas tradicionales en las laderas yungueñas?',
            options: [
              { id: 'A', text: 'Chinampas' },
              { id: 'B', text: 'Tacanas' },
              { id: 'C', text: 'Bofedales' },
            ],
            correctOptionId: 'B',
            explanation: 'Las tacanas son muros de piedra escalonados que permiten cultivar en pendientes pronunciadas.',
          },
          {
            id: 'A2-T2',
            question: '¿Qué función principal cumplen los muros de piedra en la parcela?',
            options: [
              { id: 'A', text: 'Evitar la erosión y retener la humedad del suelo' },
              { id: 'B', text: 'Enfriar las hojas durante la noche' },
              { id: 'C', text: 'Impedir que crezcan flores silvestres' },
            ],
            correctOptionId: 'A',
            explanation: 'Sin los muros de piedra, las lluvias intensas arrastrarían la tierra fértil ladera abajo.',
          },
        ],
        points: 100,
        badgeTitle: 'Guardián de las Tacanas',
      },
      {
        id: 'A3',
        code: 'Misión A3',
        qrCode: 'YUNGAS-A3',
        stopLabel: 'Parada 3 · Secadero y mesa familiar',
        title: 'De la Parcela a la Mesa',
        story:
          'Tras la jornada en el campo, las hojas se tienden al sol sobre el kachi para secarse parejo mientras la comunidad comparte un apthapi con frutos de la chacra.',
        challenge:
          'Observa el secado tradicional al sol y comparte una fruta local o merienda en comunidad agradeciendo a la familia anfitriona.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'A3-T1',
            question: '¿Qué representa el apthapi en las comunidades anfitrionas?',
            options: [
              { id: 'A', text: 'Una herramienta de labranza' },
              { id: 'B', text: 'Una mesa comunitaria donde cada persona comparte alimentos' },
              { id: 'C', text: 'Un sombrero de fibra vegetal' },
            ],
            correctOptionId: 'B',
            explanation: 'El apthapi simboliza reciprocidad y encuentro: todos ponen alimentos sobre un aguayo común.',
          },
          {
            id: 'A3-T2',
            question: '¿Qué cuidado es esencial al secar las hojas bajo el sol de los Yungas?',
            options: [
              { id: 'A', text: 'Removerlas suavemente para que sequen uniforme sin quemarse' },
              { id: 'B', text: 'Rociarlas con agua fría cada hora' },
              { id: 'C', text: 'Guardarlas húmedas en sacos cerrados' },
            ],
            correctOptionId: 'A',
            explanation: 'Mover las hojas con delicadeza conserva su color verde natural, aroma y calidad.',
          },
        ],
        points: 100,
        badgeTitle: 'Embajador de la Cosecha',
      },
    ],
  },
  B: {
    id: 'B',
    optionLabel: 'Opción B',
    name: 'Paquete Cultural y Ritmo',
    subtitle: 'Saya',
    shortDescription:
      'Siente el pulso de los tambores afrobolivianos, descubre el significado de las coplas y vive la historia viva de comunidades yungueñas.',
    regionTag: 'Tocaña · Mururata · Chicaloma',
    durationLabel: '3 paradas musicales',
    image: '/assets/aistudio/images__5__fb77db01.jpg',
    imageAlt: 'Comunidad afroboliviana con vestimenta tradicional, cuancha y tambores de Saya en los Yungas',
    missions: [
      {
        id: 'B1',
        code: 'Misión B1',
        qrCode: 'YUNGAS-B1',
        stopLabel: 'Parada 1 · Patio de tambores',
        title: 'Ritmo y Raíces Afrobolivianas',
        story: 'La Saya es memoria y resistencia viva del pueblo afroboliviano en los Yungas.',
        challenge: 'Aprende el paso básico de la Saya y anímate a tocar un instrumento.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'B1-T1',
            question: '¿Qué instrumento de caña con ranuras raspa con un palito?',
            options: [
              { id: 'A', text: 'Charango' },
              { id: 'B', text: 'Cuancha' },
              { id: 'C', text: 'Zampoña' },
            ],
            correctOptionId: 'B',
            explanation: 'La cuancha es un idiófono de caña tacuara labrada que marca el pulso raspado característico de la Saya.',
          },
          {
            id: 'B1-T2',
            question: '¿Qué hacen las coplas?',
            options: [
              { id: 'A', text: 'Solo calientan la voz' },
              { id: 'B', text: 'Narran la historia y costumbres de la comunidad' },
              { id: 'C', text: 'Se cantan en silencio' },
            ],
            correctOptionId: 'B',
            explanation: 'Las coplas transmiten la memoria colectiva, alegrías, denuncias y vida cotidiana de la comunidad.',
          },
        ],
        points: 100,
        badgeTitle: 'Guardián del Ritmo',
      },
      {
        id: 'B2',
        code: 'Misión B2',
        qrCode: 'YUNGAS-B2',
        stopLabel: 'Parada 2 · Círculo de coplas',
        title: 'Memoria Ancestral en Canto',
        story:
          'En la rueda de Saya, una voz guía entona el verso con fuerza y todo el grupo responde en coro, manteniendo vivas las historias transmitidas por abuelos y abuelas.',
        challenge:
          'Escucha una copla tradicional de boca de los anfitriones, aprende el estribillo y súmate al coro cantando en grupo.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'B2-T1',
            question: '¿Cómo dialogan los cantos dentro de una pieza de Saya?',
            options: [
              { id: 'A', text: 'Una voz guía lanza la copla y el coro comunitario responde' },
              { id: 'B', text: 'Cada persona canta una canción distinta a la vez' },
              { id: 'C', text: 'Se recitan sin ningún ritmo de tambor' },
            ],
            correctOptionId: 'A',
            explanation: 'El llamado y respuesta es una herencia rítmica africana que une a cantores, bailarines y percusionistas.',
          },
          {
            id: 'B2-T2',
            question: '¿Qué papel cumplen las mujeres en la interpretación de la Saya?',
            options: [
              { id: 'A', text: 'Solo observan desde afuera' },
              { id: 'B', text: 'Lideran coplas, cantos y la danza con polleras y blusas bordadas' },
              { id: 'C', text: 'Únicamente afinan los tambores' },
            ],
            correctOptionId: 'B',
            explanation: 'Las mujeres son pilares fundamentales de la Saya tanto en el canto como en la expresión coreográfica.',
          },
        ],
        points: 100,
        badgeTitle: 'Voz de la Comunidad',
      },
      {
        id: 'B3',
        code: 'Misión B3',
        qrCode: 'YUNGAS-B3',
        stopLabel: 'Parada 3 · Encuentro cultural',
        title: 'Herencia Viva',
        story:
          'El latido de la Saya nace del diálogo entre el tambor mayor, el tambor menor y el gangango, acompañado por los cascabeles que suenan en cada paso.',
        challenge:
          'Conversa con un músico local sobre cómo se construye y cuida un tambor y despídete con un saludo rítmico compartido.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'B3-T1',
            question: '¿Qué elemento acompaña los pasos de los danzantes marcando el compás con el cuerpo?',
            options: [
              { id: 'A', text: 'Cascabeles atados en los tobillos' },
              { id: 'B', text: 'Campanas colgadas en los árboles' },
              { id: 'C', text: 'Silbatos de cerámica' },
            ],
            correctOptionId: 'A',
            explanation: 'Los cascabeles en los tobillos convierten cada paso del baile en parte viva de la percusión.',
          },
          {
            id: 'B3-T2',
            question: '¿Por qué la Saya es un patrimonio vivo tan valioso en los Yungas?',
            options: [
              { id: 'A', text: 'Porque resguarda la identidad, memoria e historia afroboliviana' },
              { id: 'B', text: 'Porque es una moda musical reciente de ciudad' },
              { id: 'C', text: 'Porque solo se interpreta una vez cada diez años' },
            ],
            correctOptionId: 'A',
            explanation: 'Cada ensayo y fiesta comunitaria fortalece la identidad afroboliviana reconocida a nivel nacional.',
          },
        ],
        points: 100,
        badgeTitle: 'Herencia Viva',
      },
    ],
  },
  C: {
    id: 'C',
    optionLabel: 'Opción C',
    name: 'Paquete Naturaleza y Trekking',
    subtitle: 'Bosque Nuboso',
    shortDescription:
      'Cruza puentes entre la neblina, descubre la transición de los Andes a la Amazonía y protege los senderos del bosque nuboso.',
    regionTag: 'Sendero del Bosque Nuboso · La Paz',
    durationLabel: '3 paradas en sendero',
    image: '/assets/aistudio/images__6__addce7d9.jpg',
    imageAlt: 'Montañas cubiertas de bosque nuboso y neblina en los Yungas de La Paz',
    missions: [
      {
        id: 'C1',
        code: 'Misión C1',
        qrCode: 'YUNGAS-C1',
        stopLabel: 'Parada 1 · Puente colgante y mirador',
        title: 'Ojos en el Bosque Nuboso',
        story: 'Los Yungas unen los Andes con la Amazonía albergando bosques nubosos y alta biodiversidad.',
        challenge: 'Cruza el puente colgante, escucha el bosque y toma una foto panorámica.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'C1-T1',
            question: '¿Cómo es la geografía yungueña?',
            options: [
              { id: 'A', text: 'Desierto seco' },
              { id: 'B', text: 'Zona de transición con bosques nubosos y valles' },
              { id: 'C', text: 'Nieve eterna' },
            ],
            correctOptionId: 'B',
            explanation: 'En pocos kilómetros, la cordillera desciende hacia valles húmedos llenos de neblina y vida.',
          },
          {
            id: 'C1-T2',
            question: '¿Cuál es la regla de oro del explorador?',
            options: [
              { id: 'A', text: 'No dejar rastro ni arrancar plantas' },
              { id: 'B', text: 'Salir del sendero' },
              { id: 'C', text: 'Alimentar animales' },
            ],
            correctOptionId: 'A',
            explanation: 'Cuidar los senderos y no extraer flora ni alterar la fauna mantiene intacto este ecosistema frágil.',
          },
        ],
        points: 100,
        badgeTitle: 'Explorador de Miradores',
      },
      {
        id: 'C2',
        code: 'Misión C2',
        qrCode: 'YUNGAS-C2',
        stopLabel: 'Parada 2 · Quebrada de helechos',
        title: 'Secretos de la Biodiversidad',
        story:
          'Entre helechos gigantes, bromelias y orquídeas silvestres, el bosque nuboso es hogar del oso jukumari y del gallito de las rocas (tunqui).',
        challenge:
          'Camina cinco minutos en silencio por el sendero, identifica al menos tres sonidos de aves o agua y observa una planta nativa sin tocarla.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'C2-T1',
            question: '¿Qué ave de plumaje rojo intenso habita en estas quebradas nubosas?',
            options: [
              { id: 'A', text: 'Flamenco andino' },
              { id: 'B', text: 'Gallito de las rocas o tunqui' },
              { id: 'C', text: 'Pingüino de Humboldt' },
            ],
            correctOptionId: 'B',
            explanation: 'El tunqui es un ave emblemática de los bosques nubosos entre los Andes y la Amazonía.',
          },
          {
            id: 'C2-T2',
            question: '¿Por qué prosperan tantas orquídeas, musgos y bromelias en las ramas?',
            options: [
              { id: 'A', text: 'Por la humedad constante de la neblina que sube de los valles' },
              { id: 'B', text: 'Porque nunca hay nubes en la región' },
              { id: 'C', text: 'Porque la tierra es completamente árida' },
            ],
            correctOptionId: 'A',
            explanation: 'La neblina diaria aporta agua en suspensión que alimenta directamente a las plantas epífitas.',
          },
        ],
        points: 100,
        badgeTitle: 'Rastreador del Bosque',
      },
      {
        id: 'C3',
        code: 'Misión C3',
        qrCode: 'YUNGAS-C3',
        stopLabel: 'Parada 3 · Mirador de las cumbres',
        title: 'Guardián del Paisaje',
        story:
          'La neblina que abraza estas montañas alimenta vertientes cristalinas y sostiene tanto a la fauna silvestre como a las comunidades que cuidan el camino.',
        challenge:
          'Verifica que toda tu basura vuelva en tu mochila, contempla el valle en calma y sella tu compromiso de viaje consciente.',
        allowsPhoto: true,
        trivia: [
          {
            id: 'C3-T1',
            question: '¿Qué función vital cumplen los bosques nubosos para las comunidades locales?',
            options: [
              { id: 'A', text: 'Captan agua de la neblina y regulan los ríos y vertientes' },
              { id: 'B', text: 'Impiden la formación de manantiales' },
              { id: 'C', text: 'Secan los valles vecinos' },
            ],
            correctOptionId: 'A',
            explanation: 'Los árboles cubiertos de musgo actúan como esponjas naturales que liberan agua limpia todo el año.',
          },
          {
            id: 'C3-T2',
            question: '¿Qué define a un verdadero Guardián del Paisaje en los Yungas?',
            options: [
              { id: 'A', text: 'Respetar los senderos, apoyar la economía local y no dejar residuos' },
              { id: 'B', text: 'Cortar ramas para abrir nuevos atajos' },
              { id: 'C', text: 'Llevarse orquídeas silvestres de recuerdo' },
            ],
            correctOptionId: 'A',
            explanation: 'Viajar con respeto deja huella positiva en las familias anfitrionas y preserva el bosque para el futuro.',
          },
        ],
        points: 100,
        badgeTitle: 'Espíritu Sacha Wayra',
        isMaxMedal: true,
      },
    ],
  },
};

export const ALL_MISSIONS: Mission[] = [
  ...TRAVEL_PACKAGES.A.missions,
  ...TRAVEL_PACKAGES.B.missions,
  ...TRAVEL_PACKAGES.C.missions,
];
