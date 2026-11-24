import { LINES } from './lines';

const RAW_STATIONS = [
  // [id, nombre, x, y, líneas, posición del nombre en el mapa (opcional, 'right' por defecto)]
  // Línea 1
  ['talleres', 'Talleres', 593, 388, ['L1']],
  ['san-bernabe', 'San Bernabé', 651, 437, ['L1']],
  ['unidad-modelo', 'Unidad Modelo', 709, 480, ['L1']],
  ['aztlan', 'Aztlán', 761, 522, ['L1']],
  ['penitenciaria', 'Penitenciaría', 863, 588, ['L1']],
  ['alfonso-reyes', 'Alfonso Reyes', 863, 648, ['L1']],
  ['mitras', 'Mitras', 863, 712, ['L1']],
  ['simon-bolivar', 'Simón Bolívar', 863, 786, ['L1']],
  ['hospital', 'Hospital', 863, 862, ['L1'], 'left'],
  ['edison', 'Edison', 930, 866, ['L1'], 'below'],
  ['central', 'Central', 1005, 870, ['L1'], 'below'],
  ['cuauhtemoc', 'Cuauhtémoc', 1077, 878, ['L2', 'L1'], 'topRight'],
  ['del-golfo', 'Del Golfo', 1170, 902, ['L1'], 'topRight'],
  ['felix-u-gomez', 'Félix U. Gómez', 1265, 920, ['L3', 'L1'], 'topRight'],
  ['parque-fundidora', 'Parque Fundidora', 1355, 960, ['L1'], 'below'],
  ['y-griega', 'Y Griega', 1443, 990, ['L1'], 'below'],
  ['eloy-cavazos', 'Eloy Cavazos', 1537, 1000, ['L1'], 'below'],
  ['lerdo-de-tejada', 'Lerdo de Tejada', 1619, 1008, ['L1'], 'below'],
  ['exposicion', 'Exposición', 1697, 1008, ['L1'], 'below'],
  // Línea 2
  ['sendero', 'Sendero', 1258, 248, ['L2']],
  ['santiago-tapia', 'Santiago Tapia', 1252, 312, ['L2']],
  ['san-nicolas', 'San Nicolás', 1226, 383, ['L2']],
  ['anahuac', 'Anáhuac', 1193, 485, ['L2']],
  ['universidad', 'Universidad', 1163, 552, ['L2']],
  ['ninos-heroes', 'Niños Héroes', 1136, 636, ['L2']],
  ['regina', 'Regina', 1111, 714, ['L2']],
  ['general-anaya', 'General Anaya', 1090, 792, ['L2']],
  ['alameda', 'Alameda', 1073, 955, ['L2']],
  ['fundadores', 'Fundadores', 1060, 1025, ['L2']],
  ['padre-mier', 'Padre Mier', 1087, 1080, ['L2'], 'below'],
  ['general-zaragoza', 'General I. Zaragoza', 1147, 1083, ['L2', 'L3'], 'below'],
  // Línea 3
  ['hospital-metropolitano', 'Hospital Metropolitano', 1478, 640, ['L3']],
  ['los-angeles', 'Los Ángeles', 1422, 684, ['L3']],
  ['ruiz-cortines', 'Ruiz Cortines', 1367, 724, ['L3']],
  ['colonia-moderna', 'Colonia Moderna', 1300, 780, ['L3']],
  ['metalurgicos', 'Metalúrgicos', 1277, 843, ['L3']],
  ['colonia-obrera', 'Colonia Obrera', 1236, 992, ['L3'], 'left'],
  ['santa-lucia', 'Santa Lucía', 1212, 1050, ['L3']],
];

export const STATIONS = RAW_STATIONS.map(([value, label, x, y, lineIds, labelAt]) => ({
  value,
  label,
  labelAt,
  x,
  y,
  lines: lineIds.map((id) => LINES[id]),
}));

export const STATION_OPTIONS = [...STATIONS].sort((a, b) => a.label.localeCompare(b.label, 'es'));
