
// TIPOS Y DEFINICIONES DEL GRAFO
export type Coordinate = { lat: number; lng: number };
export type Profile = 'walking' | 'driving' | 'cycling';

export interface MapNode {
  id: string;
  lat: number;
  lng: number;
  tags?: string[];
}

export interface MapEdge {
  from: string;
  to: string;
  distance: number; // metros
  streetName: string;
  type: 'road' | 'path' | 'highway';
  oneWay?: boolean;
  speedLimit?: number;
}

export interface RouteResult {
  path: Coordinate[];
  distance: number;
  duration: number;
  instructions: NavigationInstruction[];
}

export interface NavigationInstruction {
  type: 'start' | 'turn_left' | 'turn_right' | 'straight' | 'arrive';
  text: string;
  distance: number;
  point: Coordinate;
}

// --- 1. DATOS REALES DE CHICOANA (GPS) ---
// Centro aprox: -25.1044, -65.5345 (Plaza)

const NODES: Record<string, MapNode> = {
  // Plaza y alrededores
  'plaza_center': { id: 'plaza_center', lat: -25.10445, lng: -65.53455 },
  'plaza_norte': { id: 'plaza_norte', lat: -25.10405, lng: -65.53455 }, // Calle El Carmen
  'plaza_sur': { id: 'plaza_sur', lat: -25.10485, lng: -65.53455 }, // Calle Libertad
  'plaza_este': { id: 'plaza_este', lat: -25.10445, lng: -65.53410 }, // Calle España
  'plaza_oeste': { id: 'plaza_oeste', lat: -25.10445, lng: -65.53500 }, // Calle 25 de Mayo
  
  // Esquinas Plaza
  'esq_no': { id: 'esq_no', lat: -25.10405, lng: -65.53500 },
  'esq_ne': { id: 'esq_ne', lat: -25.10405, lng: -65.53410 },
  'esq_so': { id: 'esq_so', lat: -25.10485, lng: -65.53500 },
  'esq_se': { id: 'esq_se', lat: -25.10485, lng: -65.53410 },

  // Puntos de interés
  'church': { id: 'church', lat: -25.10390, lng: -65.53455 }, // Iglesia San Pablo (al norte)
  'user_start': { id: 'user_start', lat: -25.10600, lng: -65.53455 }, // Un punto al sur para iniciar demo

  // Extensión de calles
  'libertad_oeste': { id: 'libertad_oeste', lat: -25.10485, lng: -65.53600 },
  'libertad_este': { id: 'libertad_este', lat: -25.10485, lng: -65.53300 },
  'espana_norte': { id: 'espana_norte', lat: -25.10300, lng: -65.53410 },
  'espana_sur': { id: 'espana_sur', lat: -25.10600, lng: -65.53410 },
};

const EDGES: MapEdge[] = [
  // Perímetro Plaza
  { from: 'esq_no', to: 'esq_ne', distance: 90, streetName: 'El Carmen', type: 'road' }, // Norte
  { from: 'esq_ne', to: 'esq_no', distance: 90, streetName: 'El Carmen', type: 'road' },
  
  { from: 'esq_ne', to: 'esq_se', distance: 90, streetName: 'España', type: 'road' }, // Este
  { from: 'esq_se', to: 'esq_ne', distance: 90, streetName: 'España', type: 'road' },

  { from: 'esq_se', to: 'esq_so', distance: 90, streetName: 'Libertad', type: 'road' }, // Sur
  { from: 'esq_so', to: 'esq_se', distance: 90, streetName: 'Libertad', type: 'road' },

  { from: 'esq_so', to: 'esq_no', distance: 90, streetName: '25 de Mayo', type: 'road' }, // Oeste
  { from: 'esq_no', to: 'esq_so', distance: 90, streetName: '25 de Mayo', type: 'road' },

  // Conexiones internas (Senderos)
  { from: 'plaza_norte', to: 'plaza_center', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_center', to: 'plaza_norte', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_sur', to: 'plaza_center', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_center', to: 'plaza_sur', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_este', to: 'plaza_center', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_center', to: 'plaza_este', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_oeste', to: 'plaza_center', distance: 45, streetName: 'Plaza', type: 'path' },
  { from: 'plaza_center', to: 'plaza_oeste', distance: 45, streetName: 'Plaza', type: 'path' },

  // Conexiones a nodos perimetrales para ruteo interno
  { from: 'esq_ne', to: 'plaza_norte', distance: 45, streetName: 'El Carmen', type: 'road' },
  { from: 'plaza_norte', to: 'esq_no', distance: 45, streetName: 'El Carmen', type: 'road' },
  { from: 'esq_se', to: 'plaza_sur', distance: 45, streetName: 'Libertad', type: 'road' },
  { from: 'plaza_sur', to: 'esq_so', distance: 45, streetName: 'Libertad', type: 'road' },

  // Calles salientes
  { from: 'esq_so', to: 'libertad_oeste', distance: 200, streetName: 'Libertad', type: 'road' },
  { from: 'libertad_oeste', to: 'esq_so', distance: 200, streetName: 'Libertad', type: 'road' },
  
  { from: 'esq_se', to: 'libertad_este', distance: 200, streetName: 'Libertad', type: 'road' },
  { from: 'libertad_este', to: 'esq_se', distance: 200, streetName: 'Libertad', type: 'road' },

  { from: 'esq_se', to: 'espana_sur', distance: 200, streetName: 'España', type: 'road' }, // Hacia el usuario start
  { from: 'espana_sur', to: 'esq_se', distance: 200, streetName: 'España', type: 'road' },
  { from: 'espana_sur', to: 'user_start', distance: 10, streetName: 'España', type: 'road' },
  { from: 'user_start', to: 'espana_sur', distance: 10, streetName: 'España', type: 'road' },
];

// --- 2. ENGINE LOGIC (A* ALGORITHM) ---

// Distancia aproximada en grados para heurística simple
const heuristic = (a: MapNode, b: MapNode) => {
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}

export const calculateOfflineRoute = (startCoord: Coordinate, endCoord: Coordinate, profile: Profile): RouteResult | null => {
  const startNode = findNearestNode(startCoord);
  const endNode = findNearestNode(endCoord);

  if (!startNode || !endNode) return null;

  const openSet = new Set<string>([startNode.id]);
  const cameFrom: Record<string, string> = {};
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};

  Object.keys(NODES).forEach(k => {
    gScore[k] = Infinity;
    fScore[k] = Infinity;
  });

  gScore[startNode.id] = 0;
  fScore[startNode.id] = heuristic(startNode, endNode);

  while (openSet.size > 0) {
    let currentId = Array.from(openSet).reduce((a, b) => (fScore[a] < fScore[b] ? a : b));

    if (currentId === endNode.id) {
      return reconstructPath(cameFrom, currentId, profile);
    }

    openSet.delete(currentId);

    const neighbors = EDGES.filter(e => e.from === currentId);
    for (const edge of neighbors) {
      if (profile === 'driving' && edge.type === 'path') continue;
      
      const neighborId = edge.to;
      const tentativeGScore = gScore[currentId] + edge.distance; // Usamos distancia en metros para costo real

      if (tentativeGScore < gScore[neighborId]) {
        cameFrom[neighborId] = currentId;
        gScore[neighborId] = tentativeGScore;
        fScore[neighborId] = gScore[neighborId] + heuristic(NODES[neighborId], endNode) * 111000; // Convert degrees to meters approx
        openSet.add(neighborId);
      }
    }
  }

  return null;
};

const findNearestNode = (c: Coordinate): MapNode | null => {
  let minDist = Infinity;
  let nearest: MapNode | null = null;
  Object.values(NODES).forEach(n => {
    const d = Math.sqrt(Math.pow(n.lat - c.lat, 2) + Math.pow(n.lng - c.lng, 2));
    if (d < minDist) {
      minDist = d;
      nearest = n;
    }
  });
  return nearest;
};

const reconstructPath = (cameFrom: Record<string, string>, currentId: string, profile: Profile): RouteResult => {
  const pathNodes: MapNode[] = [NODES[currentId]];
  let totalDistance = 0;
  
  while (currentId in cameFrom) {
    const prevId = cameFrom[currentId];
    const edge = EDGES.find(e => e.from === prevId && e.to === currentId);
    if (edge) totalDistance += edge.distance;
    
    currentId = prevId;
    pathNodes.unshift(NODES[currentId]);
  }

  // Generar Instrucciones Básicas
  const instructions: NavigationInstruction[] = [];
  instructions.push({ type: 'start', text: 'Inicia el recorrido', distance: 0, point: { lat: pathNodes[0].lat, lng: pathNodes[0].lng } });

  for (let i = 1; i < pathNodes.length - 1; i++) {
    const prev = pathNodes[i-1];
    const curr = pathNodes[i];
    const next = pathNodes[i+1];
    
    const angle = getTurnAngle(prev, curr, next);
    const edge = EDGES.find(e => e.from === curr.id && e.to === next.id);
    const streetName = edge?.streetName || 'calle';

    if (Math.abs(angle) > 45) {
       instructions.push({
         type: angle > 0 ? 'turn_right' : 'turn_left',
         text: `${angle > 0 ? 'Gira derecha' : 'Gira izquierda'} en ${streetName}`,
         distance: 50,
         point: { lat: curr.lat, lng: curr.lng }
       });
    } else {
        const prevEdge = EDGES.find(e => e.from === prev.id && e.to === curr.id);
        if (prevEdge?.streetName !== streetName) {
            instructions.push({ type: 'straight', text: `Continúa por ${streetName}`, distance: 0, point: { lat: curr.lat, lng: curr.lng } });
        }
    }
  }
  
  instructions.push({ type: 'arrive', text: 'Has llegado a tu destino', distance: 0, point: { lat: pathNodes[pathNodes.length-1].lat, lng: pathNodes[pathNodes.length-1].lng } });

  const speedKmH = profile === 'driving' ? 30 : (profile === 'cycling' ? 15 : 5);
  const durationSeconds = (totalDistance / 1000) / speedKmH * 3600;

  return {
    path: pathNodes.map(n => ({lat: n.lat, lng: n.lng})),
    distance: totalDistance,
    duration: Math.ceil(durationSeconds),
    instructions
  };
};

const getTurnAngle = (p1: MapNode, p2: MapNode, p3: MapNode) => {
    const angle1 = Math.atan2(p2.lat - p1.lat, p2.lng - p1.lng);
    const angle2 = Math.atan2(p3.lat - p2.lat, p3.lng - p2.lng);
    let angleDiff = (angle2 - angle1) * 180 / Math.PI;
    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;
    return angleDiff;
}
