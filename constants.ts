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
        description: 'Corazón de la ciudad.',
        category: 'Plaza',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCILHenv_ZFW8cIdPTU7HDKJ8ZC-Zc_5tEY-JRg-60qk-nBbaqKx7eL6pn1einLfttzeIwXLtO9mY0AabSshqKhorzNRdn6f06w09dzlx3E_TfJT2dJeRYcv2pzclIGv2YksxQ0Gm19quls3EX-45q2Xj0ehFScGnXmoLoo08yq0oDDA6lWWYf17E2j2uxs9r0APWEioGHMjpz3wLXPiz6rMDLf1by46EJ6Wi5Acb67V3bMwFiAxbINbx1cIIlvtRHhOZS1vxhfbxLZ',
        distanceFromStart: '0.0 km (Inicio)'
      },
      {
        id: 'iglesia-san-pablo',
        title: 'Iglesia San Pablo',
        description: 'Templo histórico.',
        category: 'Religioso',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5mnCsXBbL79G6zx31UirLbifMiYtmaTs7hEINIMNYEAON8fNWwh8J0MT5mV769LcrLKjY8tn3-gBHDt3sgqYY5KQFsoQaTrP7g4biCBWnMr0sS_JXb6jhTQ6ASiRr0bifMHNOBfOTBjSsPmsvQn7tIaV3z5qxDjJrbux_7UiBc94_h4tZaXSWd0ZapQpIE7tPTm7jxXPqKXfooUjP6JPntkLJkGsQ7iirQf5ulLGVHRXFH7i48jKKAnYgr40zi65IDLBMqroAPma0',
        distanceFromStart: '0.2 km'
      },
      {
        id: 'casa-tradicion',
        title: 'Casa de la Tradición',
        description: 'Museo local.',
        category: 'Museo',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDT6F5X2v9EB236bgjLofBOu358YY9HrujPGzVGYLat7JNCofdAUILGSp0smeWKcNSQvHdsy54QzIuutJYCeNcpqPWDR-YWyV3WlR3dgEW2mo3jyCtk_UwJEV850JWnkOOTkrPtb9M3IzdYXTfmi60gnHL7DXZTmcAW_Ra3Mf-uVr6GRZWGf7X8E0s2FJWeZQcI2yjleLEWUIGUon-Jo6FkacCsl3iMklQYnN28pugVEhLbtgaw_DEWN37z320uXkMTOf1ihTmBcOLj',
        distanceFromStart: '0.5 km'
      },
       {
        id: 'iglesia-san-jose',
        title: 'Iglesia de San José',
        description: 'This historic church serves as the spiritual heart of Chicoana.',
        category: 'Religioso',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw1_yRYOcA97EbbmFrU0zfuYuoL0o6ejdiqWj5-YPoDkD0EojnkerjkCcIX6TvBv1SwfTbdMwvMKeY3WH7Vor5qlmq2sSsiJEFjG5i7Hw1aBOTyunuzB5KnnygkFKvhQDWF5qZZAeAAjtYTcty7GFcMSt-wGkajd5YLY6RF-TeYtJs1lflyHO1lsBnZy4lXp52tXo7TRochxCdSH4AzNxgACIqCySeSTZp7nob6U900yWgHqcE3KOfVrkFhrURj8QkkEwCQfhs0JMc',
        distanceFromStart: '1.2 km',
        audioDuration: '3:45'
      }
    ]
  },
  {
    id: 'quebrada-laureles',
    title: 'Quebrada de los Laureles',
    description: 'Un recorrido natural por la quebrada.',
    distance: '5km',
    duration: '2h',
    difficulty: 'Media',
    category: 'Naturaleza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1OiEYJITdIrTe6YOXuY67xcK8gamC32Lr1coAcNqdkgW_GjrARDrw1ifOIuJaBXfCd1XvfOoltGbGqBxdOiMjeY16QL3-y5tfgLdo8p77nXFNRUTPjyuTwgJweRWzZ8nURlXeCCXbZ5HXIInIuL_0aaX9E9t7BwBWe--hAHaTzeLIwJ7y9EslGrKxWOaG1-xRaV_Xtn768cjeoEJCIDOdUoxfh-GGeAmB1Th6ftQThBXVb4egkA5NvzU38S4aIPMuQreo1VfPYEqD',
    isDownloaded: false,
    downloadSize: '80MB',
    totalSize: '150MB',
    version: '1.0',
    pois: []
  },
  {
    id: 'cuesta-obispo',
    title: 'Cuesta del Obispo',
    description: 'Vistas panorámicas impresionantes.',
    distance: '12km',
    duration: '4h',
    difficulty: 'Alta',
    category: 'Naturaleza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Q-tbwwGbHWlLZKpBWQn39lckzbQNFeLFNJKNy-H0BzM6eESK4hStyQ2uEEDoGsYSUJAbgYSvT6fsU4VazKxJp6ue_Rhryug4l9ROYKm_MgGBxRILsoTU7XIYOzK1wKHx-lSxLI8Zp6ktz-qK-40FXzxHGcqat9TCwzYj5_kUCa2Sedr28FRRs9jPHCpMxR7jDqMZvljeiSO8SaTKhx4uT7VYojdOSQEon32MgKnENpNtMDyntW8f-6XWsGOTI_b67igzBRIK_k6L',
    isDownloaded: false,
    downloadSize: '200MB',
    totalSize: '400MB',
    version: '1.0',
    pois: []
  },
  {
    id: 'sendero-cardones',
    title: 'Sendero Los Cardones',
    description: 'Caminata entre cardones gigantes.',
    distance: '3km',
    duration: '1h',
    difficulty: 'Baja',
    category: 'Naturaleza',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2VgVOVlPww14-hieek04pffKUp43V1mk0QxkUOlhL2lUw4Gq-NVzEIftAX7dL7uC7ompvTfYfJTxdLbTfsVuQ67uNc_qC-l1J9sz5lJ3Rfk9pt7S_mlV5VoOvjlBhSmMOgNnHFgUls8u3tImBOKBk4V4dXvxwSvM-SFIo1X2tH-Uw1Xe5lz2EnKWYmbSHWCVrcqQRJ83lMk85ap4HrRbNceFkmCrjEsW6C8i1HNktvkJuMnyt9OCgKuFkkWkrebOZEAp4vdsHqg45',
    isDownloaded: true,
    downloadSize: '50MB',
    totalSize: '100MB',
    version: '1.1',
    pois: []
  },
   {
    id: 'ruta-tabaco',
    title: 'Ruta del Tabaco',
    description: 'Conoce el proceso del tabaco.',
    distance: '10km',
    duration: '3h',
    difficulty: 'Media',
    category: 'Gastronomía',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn98y4Jtsr0usNkJN1DLkeHGXnSpgIt3dzRsxJcxqJ1zXAXPVc7q1KeA896DEv1FDBfQG6hJFQXhlEJkHA49c-5_WsmacPuQ0JbHnv3ZwOpcZcj8iw6eq3pZbBZTRjsGo0yzLaClOYZeFMkKsMgO6pyWRj-AAKcuNvyiMfjZPHh5Ozgz6M_eLaBrDMWMQKd4R-ObL49j-KYXn7z5Nny2uivtWM-cDcZzlDoFxf92chmV6Dhc4JXSaQcbTnNaQqrh6UDhVNZNVCzQy_',
    isDownloaded: true,
    downloadSize: '350MB',
    totalSize: '350MB',
    version: '1.1',
    pois: []
  }
];

export const DOWNLOADS: DownloadItem[] = [
  {
    id: 'historic-center',
    title: 'Circuito Histórico',
    status: 'downloaded',
    size: '120 MB',
    version: '2.0',
    type: 'circuit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTr-r69-lA9NTHmdC0qcTueM3MkDs5Lqxn3C7zvzBI7WZRy7BUGLc4aK_uJwocw9RVNjdpQVv_hPdusOUG5K5TzCHdWM5DNXcaKwGrCgV-v0RrMi7IrN4l3DB3U9xgHMYPOUlf_fDmyRZ9xUTQGBCghWdAq6mCMzyLJTnF6pDFG4QlajxvNCeDD8dSmyW-zqw7zDOLOtzkz_njXMZSWnT8LRYbrM9LbEwl0LPVVBdmZoOkIaKUgKkJHWa2IPl6pdjYyJyJnICKtFo5'
  },
  {
    id: 'tobacco-route',
    title: 'Ruta del Tabaco',
    status: 'update_available',
    size: '350 MB',
    version: '1.1',
    type: 'circuit',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC10eJJyJ04ck0UCIh-e0znDQjYPGpVzCfDvfcyq8IJzRbG0Ci0C6Um__dZhlsxk3zAcWSSj8KXezEH0eYV6u5LYu8Es47vivPQGSIxNLin4YYbp7Y-FGeAeLOXmtxOIaRKdb3AWV7wozBAtPMDmqxHUqMjyLFphy6M3m8eHMwnlDOgkaTCCujkcDXmxbVw7OQ_NKHz6kHeP_-lRBSBrFWrCITQuSOUweT_9DZ0_BGPYfto1MX9Q2bzpO4wsm9qja0dOYvKpk0zNXgY'
  }
];

export const AVATARS = [
  { id: 'gaucho', icon: '🤠', bg: 'bg-orange-100', label: 'Gaucho' },
  { id: 'tamal', icon: '🫔', bg: 'bg-yellow-100', label: 'Tamal' },
  { id: 'condor', icon: '🦅', bg: 'bg-slate-200', label: 'Cóndor' },
  { id: 'cactus', icon: '🌵', bg: 'bg-green-100', label: 'Cardón' },
  { id: 'puma', icon: '🐆', bg: 'bg-orange-200', label: 'Puma' },
];