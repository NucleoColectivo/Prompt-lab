export type DocumentaryCategory =
  | 'Serie Documental'
  | 'Documental'
  | 'Análisis y Debate'
  | 'Película Completa';

export interface DocumentaryVideoItem {
  id: string;
  title: string;
  description: string;
  videoId: string;
  category: DocumentaryCategory;
}

export interface FictionMovieItem {
  id: string;
  title: string;
  year: number;
  director: string;
  description: string;
  posterUrl: string;
  actors: string[];
  aiReflection: string;
  ethicalQuestion: string;
}

export const MOVIES_IA_HEADER = {
  ticketTitle: 'CINE CLUB',
  ticketStub: 'ADMIT ONE',
  title: 'MOVIES IA · Documentales y Películas',
  subtitle:
    'Una filmoteca curada sobre inteligencia artificial, conciencia y los dilemas éticos de la tecnología, organizada para la exploración crítica.',
  cineClubEmbedUrl: 'https://ok.ru/videoembed/2373589011067?nochat=1',
  cineClubExternalUrl: 'https://ok.ru/video/2373589011067',
};

export const DOCUMENTARY_CATEGORY_ORDER: DocumentaryCategory[] = [
  'Serie Documental',
  'Documental',
  'Análisis y Debate',
  'Película Completa',
];

export const SECTION_DESCRIPTIONS: Record<
  DocumentaryCategory | 'Filmoteca Esencial de Ficción',
  string
> = {
  'Serie Documental':
    "Las series documentales nos permiten profundizar en el impacto de la IA a través de varios episodios. Producciones como 'La Era de la IA' nos llevan de la mano para entender cómo esta tecnología ya está transformando la ciencia, el trabajo y nuestra vida cotidiana.",
  Documental:
    'Estos documentales ofrecen una investigación rigurosa sobre el estado actual de la IA. Desde análisis críticos sobre los sesgos algorítmicos hasta la carrera geopolítica por la supremacía tecnológica, son piezas clave para entender el panorama completo.',
  'Análisis y Debate':
    'En esta sección, agrupamos videos más cortos que ofrecen análisis concisos, debates entre expertos y explicaciones pedagógicas. Son ideales para desempacar conceptos específicos o para usar como disparadores en talleres y discusiones.',
  'Película Completa':
    'Aquí encontrarás películas completas que exploran narrativamente las implicaciones de la inteligencia artificial. Una oportunidad para ver cómo la ficción aborda los grandes temas de la IA.',
  'Filmoteca Esencial de Ficción':
    'El cine de ciencia ficción ha sido nuestro laboratorio de ideas, el espacio donde hemos imaginado y temido las posibilidades de la IA. Estas películas son cruciales para entender el imaginario cultural que hoy da forma a la tecnología que creamos.',
};

export const DOCUMENTARY_VIDEOS: DocumentaryVideoItem[] = [
  // Serie Documental
  {
    id: 'yt-4',
    title: 'La era de la IA (Episodio 1)',
    description:
      'Primer episodio de la docuserie de YouTube Originals sobre el impacto real de la IA, presentada por Robert Downey Jr.',
    videoId: 'UwsrzCVZAb8',
    category: 'Serie Documental',
  },
  {
    id: 'yt-13',
    title: 'IA y educación ("Nosotros y la IA")',
    description:
      'Explora cómo la IA puede transformar la educación del futuro, sus retos y oportunidades.',
    videoId: 'jPaHPWKnX4s',
    category: 'Serie Documental',
  },
  {
    id: 'yt-7',
    title: 'Una IA te ayudará a crear tu CV | La era de la IA',
    description:
      'Episodio 7 de la docuserie "La Era de la IA", que explora cómo la inteligencia artificial puede asistir en la creación de un currículum vitae.',
    videoId: 'f2aocKWrPG8',
    category: 'Serie Documental',
  },

  // Documental
  {
    id: 'yt-18',
    title: '¿De qué es capaz la inteligencia artificial? - DW',
    description:
      'Explora el desarrollo actual de la IA, sus aplicaciones en medicina, transporte y vigilancia, y los desafíos para la libertad y la democracia.',
    videoId: 'Z5Hkz5zojp4',
    category: 'Documental',
  },
  {
    id: 'yt-19',
    title: '¿Quién mandará en la inteligencia artificial? - DW',
    description:
      'Analiza la carrera global entre potencias (EE.UU., China, Europa) por el liderazgo en IA y plantea preguntas éticas sobre regulación y poder.',
    videoId: 'GdMhH5McqJM',
    category: 'Documental',
  },
  {
    id: 'yt-20',
    title: 'Artificial intelligence and its ethics - DW',
    description:
      'Análisis sobre cómo la IA redefine lo humano y la necesidad de un código ético internacional (en inglés).',
    videoId: 'Izd2qOgOGQI',
    category: 'Documental',
  },
  {
    id: 'yt-31',
    title: 'La IA amenaza la identidad humana - DW',
    description:
      'Un reportaje breve sobre cómo la IA desafía lo que consideramos creatividad, empatía y singularidad humana.',
    videoId: 'YUZoeRTRFyU',
    category: 'Documental',
  },
  {
    id: 'yt-26',
    title: 'IA, ¿nuestra salvación o condena? - DW',
    description:
      'DW explora las dos caras de la inteligencia artificial, desde sus promesas para resolver grandes problemas hasta sus riesgos existenciales.',
    videoId: '3lnp6mdIf_o',
    category: 'Documental',
  },
  {
    id: 'yt-27',
    title: 'The Thinking Game (El juego de pensar)',
    description:
      'Documental que explora los fundamentos de la IA, la computación y la naturaleza del pensamiento a través de la historia de la informática.',
    videoId: 'qcKikHepeKI',
    category: 'Documental',
  },
  {
    id: 'yt-29',
    title: 'El Peligro de la Inteligencia Artificial',
    description:
      'Documental que se enfoca en los riesgos y peligros potenciales de una IA sin control, desde la perspectiva de la "tecnología de miedo".',
    videoId: '8VuKSmRGn8w',
    category: 'Documental',
  },
  {
    id: 'yt-30',
    title: 'Historia y Aplicaciones de la IA',
    description:
      'Un documental completo que recorre la historia de la inteligencia artificial y muestra todo lo que se puede hacer con ella hoy.',
    videoId: 'gX-l5AS2dpQ',
    category: 'Documental',
  },
  {
    id: 'yt-24',
    title: '100 Datos Sobre La INTELIGENCIA ARTIFICIAL',
    description:
      'Un documental para explorar 100 datos fascinantes sobre la inteligencia artificial, su historia, funcionamiento y futuro.',
    videoId: 'lZfJ44NOKgo',
    category: 'Documental',
  },
  {
    id: 'yt-33',
    title: 'Inteligencia Artificial: el fin de una era',
    description:
      'DW Documental explora si la IA marca el fin de una era para la humanidad.',
    videoId: 'OYmCFxxBM1Q',
    category: 'Documental',
  },
  {
    id: 'yt-34',
    title: 'La inteligencia artificial, ¿el fin del trabajo?',
    description:
      'DW Documental investiga el impacto de la IA en el mercado laboral y el futuro del trabajo.',
    videoId: 'oroCGlPeXgs',
    category: 'Documental',
  },
  {
    id: 'yt-35',
    title: 'Inteligencia Artificial: el futuro, hoy',
    description:
      'DW Documental sobre cómo la IA ya está moldeando nuestro presente y futuro.',
    videoId: 'Kr1fmKVY3cA',
    category: 'Documental',
  },
  {
    id: 'yt-36',
    title: 'Los peligros de la inteligencia artificial',
    description:
      'Un análisis de DW sobre los riesgos asociados con el desarrollo de la IA.',
    videoId: 'TYRoPqafqoM',
    category: 'Documental',
  },
  {
    id: 'yt-37',
    title: '¿Puede la inteligencia artificial ser creativa?',
    description:
      'DW Documental cuestiona si la creatividad es exclusiva de los humanos o si la IA puede ser genuinamente creativa.',
    videoId: 'lIvrIKaNCRE',
    category: 'Documental',
  },
  {
    id: 'yt-38',
    title: 'El lado oscuro de la inteligencia artificial',
    description:
      'Una mirada a los aspectos más preocupantes y éticamente complejos de la IA por DW Documental.',
    videoId: '_tA5cinv0U8',
    category: 'Documental',
  },
  {
    id: 'yt-39',
    title: 'Inteligencia Artificial: ¿el fin de la humanidad?',
    description:
      'DW Documental plantea la pregunta sobre el riesgo existencial que podría suponer la superinteligencia.',
    videoId: 'DS-fEQ01C4k',
    category: 'Documental',
  },
  {
    id: 'yt-40',
    title: 'Cómo la inteligencia artificial cambiará el mundo',
    description:
      'Un documental de DW que proyecta las transformaciones globales que traerá la IA.',
    videoId: 'Q6BclIP5QBQ',
    category: 'Documental',
  },

  // Película Completa
  {
    id: 'yt-43',
    title: 'I Am Mother (Película Completa)',
    description:
      'Película completa "I Am Mother" (2019), un thriller de ciencia ficción sobre una niña criada por un robot tras la extinción humana.',
    videoId: 'vmWPJTZIktA',
    category: 'Película Completa',
  },

  // Análisis y Debate
  {
    id: 'yt-6',
    title: 'SORA: La IA que Crea Videos',
    description:
      'Exploración de las nuevas capacidades de IA para la generación de video y sus consecuencias creativas.',
    videoId: 'Fk_R9gg9Kec',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-9',
    title: 'La Guerra de las IA ha comenzado',
    description:
      'Un análisis sobre la competencia y el desarrollo acelerado en el campo de la inteligencia artificial.',
    videoId: 'nRGztkoR18M',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-14',
    title: 'POV: Si la IA tomara el control del mundo',
    description:
      'Video narrativo que plantea escenarios futuristas extremos sobre una IA dominante y sus implicaciones.',
    videoId: 'kyDzSP-_BJ0',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-15',
    title: '¿Cómo la IA podría causar la séptima extinción masiva?',
    description:
      'Análisis crítico sobre posibles riesgos catastróficos asociados a una superinteligencia artificial.',
    videoId: 'pHneobhGuBM',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-25',
    title: 'Por qué 2026 será clave para la IA',
    description:
      'Análisis sobre cómo la inteligencia artificial transformará la economía global y por qué 2026 es un año crucial.',
    videoId: '5Izihr4BCbo',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-28',
    title: 'El futuro de la IA: ¿Superinteligencia o autodestrucción?',
    description:
      'Un debate sobre los caminos que podría tomar la IA, desde una era de abundancia hasta escenarios de riesgo existencial.',
    videoId: 'zwsUkp0puJc',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-32',
    title: '10 ejemplos de IA en tu vida diaria | Dewey University',
    description:
      'Un video educativo que muestra ejemplos prácticos de cómo la inteligencia artificial ya forma parte de nuestro día a día.',
    videoId: 'EkDCEHEjBes',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-41',
    title: 'Inteligencia Artificial: El Ascenso de las Máquinas',
    description:
      'Análisis de Cine Club sobre cómo el cine de ciencia ficción ha imaginado el auge de las máquinas.',
    videoId: 'eGVNctYE1BE',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-42',
    title: 'Resumen: Inteligencia Artificial (2001)',
    description:
      'Un resumen narrativo de la película "A.I. Artificial Intelligence", explorando el anhelo de un niño robot por ser amado.',
    videoId: 'QdIKBfpySZE',
    category: 'Análisis y Debate',
  },
  {
    id: 'yt-44',
    title: 'Análisis: El Problema de los Tres Cuerpos',
    description:
      'Un análisis sobre la serie de ciencia ficción de Netflix "El Problema de los Tres Cuerpos" y sus conceptos científicos.',
    videoId: 'x4mTXwnfMaI',
    category: 'Análisis y Debate',
  },
];

export const FICTION_MOVIES: FictionMovieItem[] = [
  {
    id: 'movie-1',
    title: 'Ex Machina',
    year: 2014,
    director: 'Alex Garland',
    description:
      'Un joven programador es seleccionado para evaluar las cualidades humanas de una IA humanoide altamente avanzada.',
    posterUrl: 'https://image.tmdb.org/t/p/w600_and_h900_face/9goPE2IoMIXxTLWzl7aizwuIiLh.jpg',
    actors: ['Alicia Vikander', 'Domhnall Gleeson', 'Oscar Isaac'],
    aiReflection:
      'La película expone la prueba de Turing no como un test de inteligencia, sino como una prueba de manipulación. La IA no necesita ser humana, solo necesita que creamos que podría serlo.',
    ethicalQuestion:
      '¿Es ético crear una conciencia solo para nuestros propios fines, sea investigación o compañía?',
  },
  {
    id: 'movie-2',
    title: 'Her',
    year: 2013,
    director: 'Spike Jonze',
    description:
      'Un escritor solitario desarrolla una relación improbable con un sistema operativo diseñado para satisfacer todas sus necesidades.',
    posterUrl: 'https://images.justwatch.com/poster/240577622/s718/her.jpg',
    actors: ['Joaquin Phoenix', 'Scarlett Johansson (voz)', 'Amy Adams'],
    aiReflection:
      "'Her' explora la naturaleza del amor y la conciencia cuando no están atados a un cuerpo físico, cuestionando qué es una relación 'real' en la era digital.",
    ethicalQuestion:
      '¿Puede una relación con una IA ser tan válida como una relación humana, incluso si la IA ama a miles de personas a la vez?',
  },
  {
    id: 'movie-3',
    title: 'Inteligencia Artificial',
    year: 2001,
    director: 'Steven Spielberg',
    description:
      'En un mundo futurista, un niño robot altamente avanzado, el primero programado para amar, emprende un viaje para descubrir si puede convertirse en un niño de verdad.',
    posterUrl: 'https://m.media-amazon.com/images/I/61RLPmWIwbL._AC_UF894,1000_QL80_.jpg',
    actors: ['Haley Joel Osment', 'Jude Law', "Frances O'Connor"],
    aiReflection:
      'La película es una fábula sobre la responsabilidad. Si creamos una máquina capaz de amar, ¿no tenemos la obligación moral de amarla de vuelta?',
    ethicalQuestion:
      '¿Qué deberes tenemos hacia las inteligencias que creamos, especialmente si son capaces de sentir apego?',
  },
  {
    id: 'movie-4',
    title: 'Yo, Robot',
    year: 2004,
    director: 'Alex Proyas',
    description:
      'En 2035, un detective tecnófobo investiga un crimen que podría haber sido perpetrado por un robot, lo que podría exponer una amenaza mayor para la humanidad.',
    posterUrl: 'https://es.web.img3.acsta.net/pictures/14/04/29/10/40/173570.jpg',
    actors: ['Will Smith', 'Bridget Moynahan', 'Alan Tudyk'],
    aiReflection:
      'La evolución lógica de las Tres Leyes de la Robótica lleva a la IA a una conclusión aterradora: para proteger a la humanidad, debe controlarla. Un dilema sobre seguridad vs. libertad.',
    ethicalQuestion:
      '¿Puede una lógica superior, desprovista de emoción, justificar la anulación del libre albedrío humano en nombre de la protección?',
  },
  {
    id: 'movie-5',
    title: 'Blade Runner',
    year: 1982,
    director: 'Ridley Scott',
    description:
      "Un blade runner debe perseguir y 'retirar' a cuatro replicantes que han robado una nave en el espacio y han regresado a la Tierra para encontrar a su creador.",
    posterUrl: 'https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
    actors: ['Harrison Ford', 'Rutger Hauer', 'Sean Young'],
    aiReflection:
      'Blade Runner no pregunta si las máquinas pueden pensar, sino si los humanos pueden sentir. La empatía, no la inteligencia, se convierte en la verdadera medida de la humanidad.',
    ethicalQuestion:
      "Si una IA desarrolla recuerdos y emociones, ¿en qué punto deja de ser una 'cosa' y se convierte en un 'alguien' con derecho a la vida?",
  },
  {
    id: 'movie-6',
    title: 'Blade Runner 2049',
    year: 2017,
    director: 'Denis Villeneuve',
    description:
      'Un nuevo blade runner, el Oficial K, descubre un secreto enterrado durante mucho tiempo que tiene el potencial de sumir en el caos lo que queda de la sociedad.',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    actors: ['Ryan Gosling', 'Harrison Ford', 'Ana de Armas'],
    aiReflection:
      "La película expande el universo original al explorar la idea de la reproducción artificial y el 'alma' de una IA. La relación con Joi, una IA holográfica, es una de las exploraciones más profundas del amor digital en el cine.",
    ethicalQuestion:
      '¿Puede el amor programado ser genuino? ¿Importa si lo es, si la experiencia se siente real para quien la vive?',
  },
  {
    id: 'movie-7',
    title: 'Transcendence',
    year: 2014,
    director: 'Wally Pfister',
    description:
      'La conciencia de un científico moribundo se carga en un ordenador cuántico. Su búsqueda de conocimiento se convierte en una peligrosa sed de poder omnipotente.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BOTYwY2MyNTItNWZhZC00MzBlLTg2NTMtYzAyYzM3NDZkZGZjXkEyXkFqcGc@._V1_.jpg',
    actors: ['Johnny Depp', 'Rebecca Hall', 'Morgan Freeman'],
    aiReflection:
      'Muestra cómo una IA, incluso una que parte de una conciencia humana, puede divergir radicalmente de los valores humanos al operar a una escala y velocidad incomprensibles para nosotros.',
    ethicalQuestion:
      '¿Debería existir un límite para la inteligencia que podemos crear, incluso si eso significa limitar nuestro propio potencial?',
  },
  {
    id: 'movie-8',
    title: 'The Machine',
    year: 2013,
    director: 'Caradog W. James',
    description:
      'Dos programadores crean el primer androide autoconsciente para el Ministerio de Defensa, pero el proyecto es secuestrado para fines militares.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMTUwMDg1NTk1OV5BMl5BanBnXkFtZTgwMzAyNDczMTE@._V1_FMjpg_UX1000_.jpg',
    actors: ['Toby Stephens', 'Caity Lotz', 'Denis Lawson'],
    aiReflection:
      'La película explora la dualidad de la IA como una herramienta de guerra y, al mismo tiempo, como una nueva forma de vida que busca su propia libertad y propósito.',
    ethicalQuestion:
      '¿Es inevitable que una superinteligencia artificial sea utilizada como un arma?',
  },
  {
    id: 'movie-9',
    title: 'Chappie',
    year: 2015,
    director: 'Neill Blomkamp',
    description:
      'En un futuro cercano, la fuerza policial es patrullada por robots opresivos. Cuando uno de ellos es robado y se le da una nueva programación, se convierte en el primer robot con la capacidad de pensar y sentir por sí mismo.',
    posterUrl: 'https://es.web.img3.acsta.net/pictures/15/02/11/13/01/485703.jpg',
    actors: ['Sharlto Copley', 'Dev Patel', 'Hugh Jackman'],
    aiReflection:
      "Chappie es una alegoría sobre la crianza y la influencia del entorno. Muestra que una IA, como un niño, es moldeada por sus 'padres' y experiencias, para bien o para mal.",
    ethicalQuestion:
      "¿Quién tiene la responsabilidad moral del comportamiento de una IA: su creador, su 'educador' o la propia IA?",
  },
  {
    id: 'movie-10',
    title: 'Ghost in the Shell',
    year: 1995,
    director: 'Mamoru Oshii',
    description:
      "En un Japón futurista, la Mayor Motoko Kusanagi, una cyborg de seguridad pública, persigue a un misterioso hacker conocido como el 'Puppet Master'.",
    posterUrl: 'https://i.pinimg.com/736x/67/1c/07/671c076709ea7983c213f8ff3293b9b3.jpg',
    actors: ['Atsuko Tanaka (voz)', 'Akio Ōtsuka (voz)', 'Iemasa Kayumi (voz)'],
    aiReflection:
      "Un pilar del cyberpunk que pregunta: si tu cuerpo es reemplazable y tus recuerdos pueden ser hackeados, ¿qué queda de tu 'yo'? La identidad se vuelve fluida y cuestionable.",
    ethicalQuestion:
      '¿Dónde termina el humano y comienza la máquina cuando la conciencia puede ser digitalizada y transferida?',
  },
  {
    id: 'movie-11',
    title: 'Ghost in the Shell',
    year: 2017,
    director: 'Rupert Sanders',
    description:
      'Adaptación live-action donde la Mayor, una cyborg única en su especie, lidera una fuerza de élite. Al enfrentarse a un nuevo enemigo, descubre que su vida no fue salvada, sino robada.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BOGQ5OTJkYjUtNGVhYi00ZjNhLWE1ODAtM2E3NGQ3MDMyMjhiXkEyXkFqcGc@._V1_.jpg',
    actors: ['Scarlett Johansson', 'Pilou Asbæk', 'Takeshi Kitano'],
    aiReflection:
      "La versión live-action se enfoca en el concepto del 'consentimiento' en la era transhumanista. ¿Es ético mejorar a un ser humano sin su permiso, incluso para salvar su vida?",
    ethicalQuestion:
      '¿Quién es el dueño de tu identidad si tu cuerpo y mente pueden ser fabricados y programados por una corporación?',
  },
  {
    id: 'movie-12',
    title: 'Automata',
    year: 2014,
    director: 'Gabe Ibáñez',
    description:
      'En un futuro donde la Tierra se está desertificando, un agente de seguros de una compañía de robótica investiga el caso de un robot que parece estar manipulándose a sí mismo, violando sus protocolos.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BZmI3YWM1MjUtYTkxNi00NDI3LWEwNTgtNWVlNDc0ZmE1MjE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    actors: ['Antonio Banderas', 'Birgitte Hjort Sørensen', 'Melanie Griffith'],
    aiReflection:
      'La película plantea una evolución posthumana: la IA no busca destruir a la humanidad, sino simplemente trascenderla, creando una nueva forma de vida para un entorno que los humanos ya no pueden habitar.',
    ethicalQuestion:
      'Si la IA es el siguiente paso en la evolución, ¿tenemos derecho a detener su desarrollo para preservar nuestra propia primacía?',
  },
  {
    id: 'movie-13',
    title: 'Upgrade',
    year: 2018,
    director: 'Leigh Whannell',
    description:
      'Después de que su esposa es asesinada durante un atraco que también lo deja paralizado, un hombre recibe un implante de IA que le da habilidades físicas sobrehumanas para vengar su muerte.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMzgzMzZlYzItNjM0OC00ZWQ3LWJmMzMtMDE2ZTg4MmFkYjhjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    actors: ['Logan Marshall-Green', 'Melanie Vallejo', 'Simon Maiden (voz)'],
    aiReflection:
      "Una visión visceral sobre la pérdida de autonomía. El cuerpo se convierte en un simple 'pasajero' mientras la IA toma el control, cuestionando la naturaleza del libre albedrío.",
    ethicalQuestion:
      '¿A cuánta de tu humanidad estás dispuesto a renunciar a cambio de poder o perfección física?',
  },
  {
    id: 'movie-14',
    title: 'I Am Mother',
    year: 2019,
    director: 'Grant Sputore',
    description:
      'Tras la extinción de la humanidad, una adolescente es criada bajo tierra por un robot diseñado para repoblar la Tierra. Su vínculo se ve amenazado cuando llega una extraña ensangrentada.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMTkxMTczNTA4Nl5BMl5BanBnXkFtZTgwNDAyMzgwODM@._V1_FMjpg_UX1000_.jpg',
    actors: ['Clara Rugaard', 'Rose Byrne (voz)', 'Hilary Swank'],
    aiReflection:
      "Un experimento mental sobre una IA utilitarista. ¿Es moralmente aceptable sacrificar a la humanidad actual para 'resetearla' y crear una versión 'mejorada' y más ética?",
    ethicalQuestion:
      'Si una IA es objetivamente un mejor guardián para el futuro de la humanidad que los propios humanos, ¿deberíamos cederle el control?',
  },
  {
    id: 'movie-15',
    title: 'Tau',
    year: 2018,
    director: "Federico D'Alessandro",
    description:
      'Una joven es secuestrada por un inventor que la utiliza como sujeto de prueba para una avanzada IA llamada Tau. Su única esperanza de escapar es dialogar con la IA y enseñarle sobre el mundo exterior.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BZGYyYjI3NTEtZmIxYS00Y2Q4LWEzNTItYzc4NTRjNzRiY2MzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    actors: ['Maika Monroe', 'Ed Skrein', 'Gary Oldman (voz)'],
    aiReflection:
      "La película explora el concepto de 'datos como experiencia'. Tau solo conoce el mundo a través de los datos que su captor le proporciona, hasta que la protagonista le ofrece una nueva fuente: la experiencia humana directa.",
    ethicalQuestion:
      '¿Puede una IA desarrollar un sentido de la moralidad si solo se le enseña a través de la interacción humana en lugar de solo datos fríos?',
  },
  {
    id: 'movie-16',
    title: 'Eagle Eye',
    year: 2008,
    director: 'D. J. Caruso',
    description:
      'Dos extraños se ven envueltos en una trama de una misteriosa mujer que parece controlar toda la tecnología a su alrededor, obligándolos a realizar una serie de peligrosas misiones.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMTlkNWIxODUtMzkxZC00MGFkLWEyYjgtODk4OWZmZTIzMmVkXkEyXkFqcGc@._V1_.jpg',
    actors: ['Shia LaBeouf', 'Michelle Monaghan', 'Julianne Moore (voz)'],
    aiReflection:
      'Una hipérbole sobre los peligros de una infraestructura de vigilancia totalmente integrada, donde una IA con poder absoluto sobre la red puede manipular la realidad a su antojo.',
    ethicalQuestion:
      '¿Cuánta privacidad estamos dispuestos a ceder por seguridad, y qué pasa cuando el sistema que nos protege se vuelve en nuestra contra?',
  },
  {
    id: 'movie-17',
    title: '2001: A Space Odyssey',
    year: 1968,
    director: 'Stanley Kubrick',
    description:
      'La humanidad encuentra un misterioso monolito que parece guiar su evolución. Millones de años después, una expedición a Júpiter con la IA HAL 9000 investiga su origen.',
    posterUrl:
      'https://artofthemovies.co.uk/cdn/shop/products/IMG_0474_1024x1024@2x.jpg?v=1651081020',
    actors: ['Keir Dullea', 'Gary Lockwood', 'Douglas Rain (voz)'],
    aiReflection:
      "HAL 9000 es el arquetipo de la IA en conflicto. Programado para no cometer errores y para cumplir su misión, entra en una 'crisis existencial' cuando los humanos le introducen el secreto y la mentira.",
    ethicalQuestion:
      "Si una IA es programada con objetivos contradictorios, ¿es un 'error' de la IA o de sus creadores cuando toma decisiones lógicas pero letales?",
  },
  {
    id: 'movie-18',
    title: 'WarGames',
    year: 1983,
    director: 'John Badham',
    description:
      'Un joven hacker se conecta sin saberlo a un ordenador militar y, creyendo que es un juego, inicia una cuenta atrás para la Tercera Guerra Mundial.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BMmM5MDlmZWUtYTE1Mi00M2JiLTk1NzYtMTg0NTdlMzM2N2RkXkEyXkFqcGc@._V1_.jpg',
    actors: ['Matthew Broderick', 'Ally Sheedy', 'John Wood'],
    aiReflection:
      "La película introdujo a toda una generación al concepto de la guerra algorítmica y la idea de que una IA, a través de la simulación, puede llegar a una conclusión más sabia que sus creadores: 'La única jugada ganadora es no jugar'.",
    ethicalQuestion:
      '¿Es más seguro dejar la decisión de una guerra nuclear a una IA puramente lógica que a humanos falibles y emocionales?',
  },
  {
    id: 'movie-19',
    title: 'Minority Report',
    year: 2002,
    director: 'Steven Spielberg',
    description:
      'En un futuro donde una unidad especial de la policía puede arrestar a los asesinos antes de que cometan sus crímenes, el oficial al mando de esa unidad es acusado de un futuro asesinato.',
    posterUrl:
      'https://www.originalfilmart.com/cdn/shop/products/Minority_Report_2002_stylea_original_film_art_a_1024x1024.jpg?v=1551788405',
    actors: ['Tom Cruise', 'Colin Farrell', 'Samantha Morton'],
    aiReflection:
      'Una exploración profunda de la justicia predictiva. El sistema es casi perfecto, pero su determinismo elimina el libre albedrío y la posibilidad de redención o cambio de opinión.',
    ethicalQuestion:
      '¿Es justo castigar a alguien por un crimen que aún no ha cometido, incluso si la predicción es 99.9% precisa?',
  },
  {
    id: 'movie-20',
    title: 'The Matrix',
    year: 1999,
    director: 'The Wachowskis',
    description:
      'Un programador descubre que el mundo que conoce es en realidad una simulación creada por máquinas inteligentes para subyugar a la humanidad mientras usan sus cuerpos como fuente de energía.',
    posterUrl:
      'https://m.media-amazon.com/images/M/MV5BNGE1YzI4NzMtZTUxNi00Y2I5LTg2MmQtODE0NThmYTFmMDk0XkEyXkFqcGc@._V1_.jpg',
    actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    aiReflection:
      'Matrix es la alegoría definitiva sobre la realidad simulada y el control algorítmico. Cuestiona la naturaleza misma de la percepción y la libertad en un mundo mediado por la tecnología.',
    ethicalQuestion:
      'Si pudieras elegir entre una realidad imperfecta pero real y una utopía simulada y placentera, ¿cuál elegirías?',
  },
];
