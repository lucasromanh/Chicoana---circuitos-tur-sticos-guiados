
import { Circuit, DownloadItem } from './types';

export const CIRCUITS: Circuit[] = [
  {
    id: 'historic-center',
    title: 'Circuito Histórico',
    description: 'Recorre las calles empedradas y descubre la rica historia colonial de Chicoana. Un paseo ideal para familias y amantes de la fotografía.',
    distance: '5 km',
    duration: '2 h',
    difficulty: 'Baja',
    category: 'Históricos',
    image: 'https://picsum.photos/800/600?random=1',
    isDownloaded: false,
    downloadSize: '120MB',
    totalSize: '250MB',
    version: '2.0',
    pois: [
      {
        id: 'plaza-principal',
        title: 'Plaza Principal',
        description: 'Corazón de la ciudad. Un espacio verde rodeado de arquitectura colonial donde transcurre la vida social del pueblo.',
        category: 'Plaza',
        image: 'https://picsum.photos/800/600?random=3',
        distanceFromStart: '0.0 km (Inicio)',
        audioDuration: '1:30',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      },
      {
        id: 'iglesia-san-pablo',
        title: 'Iglesia San Pablo',
        description: 'Templo histórico construido en el siglo XIX, destaca por su arquitectura neoclásica y sus coloridos vitrales.',
        category: 'Religioso',
        image: 'https://picsum.photos/800/600?random=4',
        distanceFromStart: '0.2 km',
        audioDuration: '2:15',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1548625361-e87563ba424a?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      },
      {
        id: 'casa-tradicion',
        title: 'Casa de la Tradición',
        description: 'Museo local que alberga piezas precolombinas y gauchas, testimonio vivo de las costumbres salteñas.',
        category: 'Museo',
        image: 'https://picsum.photos/800/600?random=5',
        distanceFromStart: '0.5 km',
        audioDuration: '1:45',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      }
    ]
  },
  {
    id: 'quebrada-laureles',
    title: 'Quebrada de los Laureles',
    description: 'Un recorrido natural por la quebrada, rodeado de vegetación autóctona y formaciones rocosas únicas.',
    distance: '5km',
    duration: '2h',
    difficulty: 'Media',
    category: 'Naturaleza',
    image: 'https://picsum.photos/800/600?random=2',
    isDownloaded: false,
    downloadSize: '80MB',
    totalSize: '150MB',
    version: '1.0',
    pois: [
        {
            id: 'inicio-sendero',
            title: 'Inicio del Sendero',
            description: 'Punto de partida rodeado de laureles centenarios. Aquí comienza la aventura hacia el corazón de la quebrada.',
            category: 'Naturaleza',
            image: 'https://picsum.photos/800/600?random=6',
            distanceFromStart: '0.0 km',
            audioDuration: '1:10',
            videoThumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        },
        {
            id: 'mirador-rio',
            title: 'Mirador del Río',
            description: 'Una vista panorámica espectacular del río serpenteando entre las montañas.',
            category: 'Vista',
            image: 'https://picsum.photos/800/600?random=7',
            distanceFromStart: '2.5 km',
            audioDuration: '2:30',
            videoThumbnail: 'https://images.unsplash.com/photo-1504280506541-aca14220e80d?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
        }
    ]
  },
  {
    id: 'cuesta-obispo',
    title: 'Cuesta del Obispo',
    description: 'Vistas panorámicas impresionantes en un camino de montaña sinuoso que asciende hasta las nubes.',
    distance: '12km',
    duration: '4h',
    difficulty: 'Alta',
    category: 'Naturaleza',
    image: 'https://picsum.photos/800/600?random=8',
    isDownloaded: false,
    downloadSize: '200MB',
    totalSize: '400MB',
    version: '1.0',
    pois: [
        {
            id: 'piedra-molino',
            title: 'Piedra del Molino',
            description: 'El punto más alto del recorrido, a 3348 msnm. Siente el viento fresco y observa el vuelo de los cóndores.',
            category: 'Hito',
            image: 'https://picsum.photos/800/600?random=9',
            distanceFromStart: '12.0 km',
            audioDuration: '3:00',
            videoThumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        },
        {
            id: 'valle-encantado',
            title: 'Valle Encantado',
            description: 'Un pequeño valle oculto con formaciones rocosas y lagunas temporales tras las lluvias.',
            category: 'Naturaleza',
            image: 'https://picsum.photos/800/600?random=10',
            distanceFromStart: '8.0 km',
            audioDuration: '2:15',
            videoThumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
        }
    ]
  },
  {
    id: 'sendero-cardones',
    title: 'Sendero Los Cardones',
    description: 'Caminata entre cardones gigantes, testigos silenciosos del paso del tiempo en el parque nacional.',
    distance: '3km',
    duration: '1h',
    difficulty: 'Baja',
    category: 'Naturaleza',
    image: 'https://picsum.photos/800/600?random=11',
    isDownloaded: false,
    downloadSize: '50MB',
    totalSize: '100MB',
    version: '1.1',
    pois: [
        {
            id: 'cardon-abuelo',
            title: 'El Cardón Abuelo',
            description: 'Un ejemplar de más de 200 años de antigüedad que domina el paisaje.',
            category: 'Flora',
            image: 'https://picsum.photos/800/600?random=12',
            distanceFromStart: '1.5 km',
            audioDuration: '1:45',
            videoThumbnail: 'https://images.unsplash.com/photo-1453815777174-899479634e9e?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
        }
    ]
  },
   {
    id: 'ruta-tabaco',
    title: 'Ruta del Tabaco',
    description: 'Conoce el proceso del tabaco, desde la plantación hasta el secado, una tradición clave en la economía local.',
    distance: '10km',
    duration: '3h',
    difficulty: 'Media',
    category: 'Gastronomía',
    image: 'https://picsum.photos/800/600?random=13',
    isDownloaded: false,
    downloadSize: '350MB',
    totalSize: '350MB',
    version: '1.1',
    pois: [
        {
            id: 'estufa-tabaco',
            title: 'Estufa de Secado',
            description: 'Estructuras tradicionales donde se realiza el curado de las hojas de tabaco.',
            category: 'Industria',
            image: 'https://picsum.photos/800/600?random=14',
            distanceFromStart: '2.0 km',
            audioDuration: '2:50',
            videoThumbnail: 'https://images.unsplash.com/photo-1627824056158-b6113b295909?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4'
        },
        {
            id: 'campo-cultivo',
            title: 'Campos de Cultivo',
            description: 'Extensas plantaciones verdes que caracterizan el paisaje del Valle de Lerma.',
            category: 'Campo',
            image: 'https://picsum.photos/800/600?random=15',
            distanceFromStart: '5.0 km',
            audioDuration: '1:20',
            videoThumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
        }
    ]
  },
  {
    id: 'ruta-artesanos',
    title: 'Ruta de los Artesanos',
    description: 'Descubre la magia de las manos que trabajan el cuero, la madera y el tejido en Chicoana. Visita los talleres y conoce a los maestros.',
    distance: '3 km',
    duration: '1.5 h',
    difficulty: 'Baja',
    category: 'Cultura',
    image: 'https://picsum.photos/800/600?random=16',
    isDownloaded: false,
    downloadSize: '90MB',
    totalSize: '190MB',
    version: '1.0',
    pois: [
        {
            id: 'taller-cuero',
            title: 'Taller de Talabartería',
            description: 'Observa cómo se trabaja el cuero crudo para crear monturas, lazos y guardamontes típicos del gaucho salteño.',
            category: 'Artesanía',
            image: 'https://picsum.photos/800/600?random=17',
            distanceFromStart: '0.5 km',
            audioDuration: '2:10',
            videoThumbnail: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
        },
        {
            id: 'tejenderas',
            title: 'Casa de las Tejedoras',
            description: 'Mujeres que mantienen viva la técnica ancestral del telar, creando ponchos y mantas con lana de oveja y llama.',
            category: 'Textil',
            image: 'https://picsum.photos/800/600?random=18',
            distanceFromStart: '1.8 km',
            audioDuration: '1:50',
            videoThumbnail: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
    ]
  }
];

export const AVAILABLE_DOWNLOADS: DownloadItem[] = [
  {
    id: 'chicoana-map-pack',
    title: 'Mapa Base Offline',
    size: '150 MB',
    status: 'not_downloaded',
    version: '2024.1',
    image: '',
    type: 'map',
    description: 'Calles y navegación',
    icon: 'map'
  },
  {
    id: 'audio-pack-es',
    title: 'Voces y Audios (ES)',
    size: '85 MB',
    status: 'not_downloaded',
    version: '1.2',
    image: '',
    type: 'guide',
    description: 'Narración completa',
    icon: 'record_voice_over'
  },
  {
    id: 'tamales-fest',
    title: 'Guía Festival del Tamal',
    size: '45 MB',
    status: 'not_downloaded',
    version: '2024',
    image: '',
    type: 'guide',
    description: 'Guía Completa',
    icon: 'restaurant'
  },
  {
    id: 'trekking-maps',
    title: 'Mapas de Trekking',
    size: '500 MB',
    status: 'not_downloaded',
    version: '1.0',
    image: '',
    type: 'map',
    description: 'Topográficos',
    icon: 'hiking'
  }
];

export const AVATARS = [
  { id: 'gaucho', icon: '🤠', bg: 'bg-orange-100', label: 'Gaucho' },
  { id: 'tamal', icon: '🫔', bg: 'bg-yellow-100', label: 'Tamal' },
  { id: 'condor', icon: '🦅', bg: 'bg-slate-200', label: 'Cóndor' },
  { id: 'cactus', icon: '🌵', bg: 'bg-green-100', label: 'Cardón' },
  { id: 'puma', icon: '🐆', bg: 'bg-orange-200', label: 'Puma' },
];
