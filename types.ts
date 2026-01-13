export interface Circuit {
  id: string;
  title: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: string;
  category: 'Históricos' | 'Naturaleza' | 'Gastronomía' | 'Cultura';
  image: string;
  isDownloaded: boolean;
  downloadSize: string;
  totalSize: string;
  version: string;
  pois: POI[];
}

export interface POI {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  distanceFromStart: string;
  audioDuration?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  status: 'downloaded' | 'update_available' | 'not_downloaded';
  size: string;
  version: string;
  image: string;
  type: 'circuit' | 'guide' | 'map';
}

export enum AppRoute {
  SPLASH = '/',
  HOME = '/home',
  CIRCUIT_DETAIL = '/circuit/:id',
  MAP_OVERVIEW = '/map',
  ACTIVE_NAVIGATION = '/navigation',
  POI_DETAIL = '/poi/:id',
  DOWNLOADS = '/downloads',
  SETTINGS = '/settings'
}