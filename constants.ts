
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCILHenv_ZFW8cIdPTU7HDKJ8ZC-Zc_5tEY-JRg-60qk-nBbaqKx7eL6pn1einLfttzeIwXLtO9mY0AabSshqKhorzNRdn6f06w09dzlx3E_TfJT2dJeRYcv2pzclIGv2YksxQ0Gm19quls3EX-45q2Xj0ehFScGnXmoLoo08yq0oDDA6lWWYf17E2j2uxs9r0APWEioGHMjpz3wLXPiz6rMDLf1by46EJ6Wi5Acb67V3bMwFiAxbINbx1cIIlvtRHhOZS1vxhfbxLZ',
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
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCILHenv_ZFW8cIdPTU7HDKJ8ZC-Zc_5tEY-JRg-60qk-nBbaqKx7eL6pn1einLfttzeIwXLtO9mY0AabSshqKhorzNRdn6f06w09dzlx3E_TfJT2dJeRYcv2pzclIGv2YksxQ0Gm19quls3EX-45q2Xj0ehFScGnXmoLoo08yq0oDDA6lWWYf17E2j2uxs9r0APWEioGHMjpz3wLXPiz6rMDLf1by46EJ6Wi5Acb67V3bMwFiAxbINbx1cIIlvtRHhOZS1vxhfbxLZ',
        distanceFromStart: '0.0 km (Inicio)',
        audioDuration: '1:30',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1560969184-10fe8719e066?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40139-424070074_large.mp4'
      },
      {
        id: 'iglesia-san-pablo',
        title: 'Iglesia San Pablo',
        description: 'Templo histórico construido en el siglo XIX, destaca por su arquitectura neoclásica y sus coloridos vitrales.',
        category: 'Religioso',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5mnCsXBbL79G6zx31UirLbifMiYtmaTs7hEINIMNYEAON8fNWwh8J0MT5mV769LcrLKjY8tn3-gBHDt3sgqYY5KQFsoQaTrP7g4biCBWnMr0sS_JXb6jhTQ6ASiRr0bifMHNOBfOTBjSsPmsvQn7tIaV3z5qxDjJrbux_7UiBc94_h4tZaXSWd0ZapQpIE7tPTm7jxXPqKXfooUjP6JPntkLJkGsQ7iirQf5ulLGVHRXFH7i48jKKAnYgr40zi65IDLBMqroAPma0',
        distanceFromStart: '0.2 km',
        audioDuration: '2:15',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1548625361-e87563ba424a?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://cdn.pixabay.com/video/2024/05/24/213399_large.mp4'
      },
      {
        id: 'casa-tradicion',
        title: 'Casa de la Tradición',
        description: 'Museo local que alberga piezas precolombinas y gauchas, testimonio vivo de las costumbres salteñas.',
        category: 'Museo',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT6F5X2v9EB236bgjLofBOu358YY9HrujPGzVGYLat7JNCofdAUILGSp0smeWKcNSQvHdsy54QzIuutJYCeNcpqPWDR-YWyV3WlR3dgEW2mo3jyCtk_UwJEV850JWnkOOTkrPtb9M3IzdYXTfmi60gnHL7DXZTmcAW_Ra3Mf-uVr6GRZWGf7X8E0s2FJWeZQcI2yjleLEWUIGUon-Jo6FkacCsl3iMklQYnN28pugVEhLbtgaw_DEWN37z320uXkMTOf1ihTmBcOLj',
        distanceFromStart: '0.5 km',
        audioDuration: '1:45',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        videoThumbnail: 'https://images.unsplash.com/photo-1583207689623-2895240a927a?auto=format&fit=crop&q=80&w=800',
        videoUrl: 'https://cdn.pixabay.com/video/2022/11/20/140995-776829731_large.mp4'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1OiEYJITdIrTe6YOXuY67xcK8gamC32Lr1coAcNqdkgW_GjrARDrw1ifOIuJaBXfCd1XvfOoltGbGqBxdOiMjeY16QL3-y5tfgLdo8p77nXFNRUTPjyuTwgJweRWzZ8nURlXeCCXbZ5HXIInIuL_0aaX9E9t7BwBWe--hAHaTzeLIwJ7y9EslGrKxWOaG1-xRaV_Xtn768cjeoEJCIDOdUoxfh-GGeAmB1Th6ftQThBXVb4egkA5NvzU38S4aIPMuQreo1VfPYEqD',
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
            image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '0.0 km',
            audioDuration: '1:10',
            videoThumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186175-877174676_large.mp4'
        },
        {
            id: 'mirador-rio',
            title: 'Mirador del Río',
            description: 'Una vista panorámica espectacular del río serpenteando entre las montañas.',
            category: 'Vista',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '2.5 km',
            audioDuration: '2:30',
            videoThumbnail: 'https://images.unsplash.com/photo-1504280506541-aca14220e80d?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2022/08/24/128989-742967169_large.mp4'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Q-tbwwGbHWlLZKpBWQn39lckzbQNFeLFNJKNy-H0BzM6eESK4hStyQ2uEEDoGsYSUJAbgYSvT6fsU4VazKxJp6ue_Rhryug4l9ROYKm_MgGBxRILsoTU7XIYOzK1wKHx-lSxLI8Zp6ktz-qK-40FXzxHGcqat9TCwzYj5_kUCa2Sedr28FRRs9jPHCpMxR7jDqMZvljeiSO8SaTKhx4uT7VYojdOSQEon32MgKnENpNtMDyntW8f-6XWsGOTI_b67igzBRIK_k6L',
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
            image: 'https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '12.0 km',
            audioDuration: '3:00',
            videoThumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2019/07/04/24933-346387037_large.mp4'
        },
        {
            id: 'valle-encantado',
            title: 'Valle Encantado',
            description: 'Un pequeño valle oculto con formaciones rocosas y lagunas temporales tras las lluvias.',
            category: 'Naturaleza',
            image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '8.0 km',
            audioDuration: '2:15',
            videoThumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2021/04/26/72223-541571217_large.mp4'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2VgVOVlPww14-hieek04pffKUp43V1mk0QxkUOlhL2lUw4Gq-NVzEIftAX7dL7uC7ompvTfYfJTxdLbTfsVuQ67uNc_qC-l1J9sz5lJ3Rfk9pt7S_mlV5VoOvjlBhSmMOgNnHFgUls8u3tImBOKBk4V4dXvxwSvM-SFIo1X2tH-Uw1Xe5lz2EnKWYmbSHWCVrcqQRJ83lMk85ap4HrRbNceFkmCrjEsW6C8i1HNktvkJuMnyt9OCgKuFkkWkrebOZEAp4vdsHqg45',
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
            image: 'https://images.unsplash.com/photo-1534234828563-0ba62eb2eb68?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '1.5 km',
            audioDuration: '1:45',
            videoThumbnail: 'https://images.unsplash.com/photo-1453815777174-899479634e9e?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2020/09/21/50630-463234509_large.mp4'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn98y4Jtsr0usNkJN1DLkeHGXnSpgIt3dzRsxJcxqJ1zXAXPVc7q1KeA896DEv1FDBfQG6hJFQXhlEJkHA49c-5_WsmacPuQ0JbHnv3ZwOpcZcj8iw6eq3pZbBZTRjsGo0yzLaClOYZeFMkKsMgO6pyWRj-AAKcuNvyiMfjZPHh5Ozgz6M_eLaBrDMWMQKd4R-ObL49j-KYXn7z5Nny2uivtWM-cDcZzlDoFxf92chmV6Dhc4JXSaQcbTnNaQqrh6UDhVNZNVCzQy_',
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
            image: 'https://images.unsplash.com/photo-1627824056285-06c88451121d?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '2.0 km',
            audioDuration: '2:50',
            videoThumbnail: 'https://images.unsplash.com/photo-1627824056158-b6113b295909?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2021/08/04/83896-583279313_large.mp4'
        },
        {
            id: 'campo-cultivo',
            title: 'Campos de Cultivo',
            description: 'Extensas plantaciones verdes que caracterizan el paisaje del Valle de Lerma.',
            category: 'Campo',
            image: 'https://images.unsplash.com/photo-1597916829826-712c525d6e47?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '5.0 km',
            audioDuration: '1:20',
            videoThumbnail: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2020/05/26/40306-424729117_large.mp4'
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
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800',
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
            image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '0.5 km',
            audioDuration: '2:10',
            videoThumbnail: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2022/10/25/136365-763959639_large.mp4'
        },
        {
            id: 'tejenderas',
            title: 'Casa de las Tejedoras',
            description: 'Mujeres que mantienen viva la técnica ancestral del telar, creando ponchos y mantas con lana de oveja y llama.',
            category: 'Textil',
            image: 'https://images.unsplash.com/photo-1606744888344-493238951221?auto=format&fit=crop&q=80&w=800',
            distanceFromStart: '1.8 km',
            audioDuration: '1:50',
            videoThumbnail: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?auto=format&fit=crop&q=80&w=800',
            videoUrl: 'https://cdn.pixabay.com/video/2020/08/18/47656-451383749_large.mp4'
        }
    ]
  }
];

export const AVAILABLE_DOWNLOADS = [
  {
    id: 'chicoana-map-pack',
    title: 'Mapa Base Offline',
    size: '150 MB',
    description: 'Calles y navegación',
    icon: 'map'
  },
  {
    id: 'audio-pack-es',
    title: 'Voces y Audios (ES)',
    size: '85 MB',
    description: 'Narración completa',
    icon: 'record_voice_over'
  },
  {
    id: 'tamales-fest',
    title: 'Guía Festival del Tamal',
    size: '45 MB',
    description: 'Guía Completa',
    icon: 'restaurant'
  },
  {
    id: 'trekking-maps',
    title: 'Mapas de Trekking',
    size: '500 MB',
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
