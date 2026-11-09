// Sprites of the 404 page minigame: Illyrio, the healer of Partaros, runs from the Barghest, the "Demon of the Desert".
// Each sprite is drawn one character per pixel; '.' is transparent, every other character is a colour of BARGHEST_COLORI.

export const BARGHEST_COLORI: Record<string, string> = {
  // Illyrio
  T: '#b6a6d9', // lilac turban
  t: '#8a7bb6',
  H: '#3a2a1f', // hair
  S: '#e2b48d', // skin
  s: '#c38e69',
  G: '#1b1f2a', // glasses
  B: '#5a3e2b', // beard
  C: '#717986', // grey scarf
  c: '#4b525d',
  K: '#1d1c23', // black cloak
  k: '#38353f',
  R: '#b8282d', // red lining
  W: '#f5f2ea', // white robe
  w: '#cbc4b3',
  L: '#0e0d11', // belt
  Y: '#c9a35a', // the book in his hands
  P: '#dcd5c5', // trousers
  O: '#8b5a34', // shoes
  D: '#4b3527', // staff
  d: '#6e5139',
  // Barghest
  X: '#16121b',
  x: '#3a3142',
  E: '#ff3b2f', // glowing eyes
  M: '#7d1717', // mouth
  F: '#f4efe2', // fangs
  // Desert
  r: '#8d7a63', // rock
  q: '#ab9677',
  Q: '#665443',
  V: '#5f7a3a', // cactus
  v: '#7e9a4f',
  b: '#ece4cf', // bone
  n: '#b9ad91',
  N: '#3b2e25',
  // Vulture
  A: '#3d2b23',
  a: '#5b4234',
  I: '#c98b7f', // bare head
  J: '#e0c070', // beak
  // Potion jars of the life meter
  g: '#3b2e3f', // glass edge
  h: '#fffaf0', // glint
  e: '#efe1c4', // empty glass
  u: '#c7262c', // healing draught
  U: '#86161b',
  o: '#9a6a3d', // cork
  // The warrior who comes to Illyrio's aid
  p: '#4d2c27', // dark brown hood
  y: '#321b18',
  m: '#262930', // chainmail
  l: '#858b97', // its rings catching the light
  i: '#c3c7cf', // steel
  j: '#7c818b',
  z: '#3f7a4a', // green pendant
  Z: '#28232e', // dark trousers
}

// Upper body of Illyrio, shared by the running and standing frames
const ILLYRIO_BUSTO = [
  '...D....tTTTt.....',
  '...dD..tTTTTTt....',
  '....dDtTTtTTTTt...',
  '....dDtTTTTtTTt...',
  '.....dttTTTTTtt...',
  '.....dDHHSSSSSS...',
  '.....dDHSGGSGGS...',
  '......dHSSSSSSS...',
  '......dDBSBBBS....',
  '.......dDBBBBs....',
  '.....kKdDCCCCCKk..',
  '....kKKKdcCCCcKKk.',
  '....KKKKKDcccWRKk.',
  '...kKKKKKKWWWWRK..',
  '...KKKKKKKWWWYYYs.',
  '...KKKKKKKWWsYYYs.',
  '...KKKKKKKLLLLRK..',
  '...kKKKKKKWWWWRK..',
  '....KKKKKKWWwWRK..',
  '....KKKKKKWWwWWRK.',
  '....kKKKKKWwWWWRK.',
  '.....KKKKKWwWWWWRK',
  '.....kKKKKwWWWWWRk',
]

export const ILLYRIO_FERMO = [
  ...ILLYRIO_BUSTO,
  '.........PP.PP....',
  '.........PP.PP....',
  '.........PP.PP....',
  '........OOO.OOO...',
]

export const ILLYRIO_CORSA = [
  [...ILLYRIO_BUSTO, '........PP...PP...', '.......PP.....PP..', '......PP.......PP.', '.....OOO.......OOO'],
  [...ILLYRIO_BUSTO, '..........PPP.....', '.........PPPP.....', '.........PP.PP....', '........OOO.OOO...'],
]

const ILLYRIO_CHINO_BUSTO = [
  '..............tTTTt...',
  '.............tTTTTTt..',
  '.............tTTtTTTt.',
  '..D..........ttTTTtt..',
  '...dD.....kKKHSSSSSS..',
  '....dD..kKKKKHSGGSGG..',
  '.....dDkKKKKKKSSSSSSs.',
  '....kKKdDKKKKCCBSBBS..',
  '...kKKKKKdDKKCcBBBB...',
  '..kKKKKKKKKKKWWWYYYs..',
  '.kKKKKKKKKKKKWWsYYYs..',
  '.KKKKKKKKKKKKLLLLRK...',
  '.kKKKKKKKKKKWWWWWRK...',
  '..kKKKKKKKKWwWWWWRk...',
]

export const ILLYRIO_CHINO = [
  [...ILLYRIO_CHINO_BUSTO, '.......PPP.....PPP....', '......OOO.......OOO...'],
  [...ILLYRIO_CHINO_BUSTO, '.........PPPPPP.......', '........OOO..OOO......'],
]

const BARGHEST_CORPO = [
  '......................x..x......',
  '.....................xX.xX......',
  '....................xXXXXXX.....',
  '...................xXXXXEXXX....',
  '..x...............xXXXXXXXXXXx..',
  '...xx..........xxXXXXXXXXMMMMM..',
  '.....xx....xxxXXXXXXXXXXXFMFMF..',
  '......xXxxxXXXXXXXXXXXXXXMMMM...',
  '.......XXXXXXXXXXXXXXXXXXXX.....',
  '......xXXXXXXXXXXXXXXXXXXX......',
  '.....xXXXXXXXXXXXXXXXXXXX.......',
  '.....XXXXxXXXXXXXXXXXXXXX.......',
  '....XXXx..XXXXXXXXXXXXXX........',
]

export const BARGHEST_CORSA = [
  [
    ...BARGHEST_CORPO,
    '...XXx.....XXX.....XXx.xXX......',
    '..XXx.......XXX.....xXX..XXx....',
    '.XXx.........XXx.....XX...XXx...',
    'XXx...........XX......x....XX...',
  ],
  [
    ...BARGHEST_CORPO,
    '......XXx..XXX.....XXXXX........',
    '.......XXxXXX......XX.XX........',
    '........XXXX......XX...XX.......',
    '.........XX......XX.....XX......',
  ],
]

export const OSTACOLI = {
  sasso: ['..qqrr..', '.qqrrrr.', 'qqrrrrrQ', 'qrrrrrQQ', 'rrrrrQQQ'],
  masso: [
    '.....qqqr.....',
    '...qqqrrrrr...',
    '..qqrrrrrrrQ..',
    '.qqrrrrrrrrrQ.',
    '.qrrrrrrrrrrQQ',
    'qqrrrrrrrrrQQQ',
    'qrrrrrrrrrrQQQ',
    'rrrrrrrrrrQQQQ',
    'rrrrrrrrrQQQQQ',
  ],
  cactus: [
    '...vV...',
    '..vVVV..',
    '..vVVV..',
    '..vVVV.v',
    'v.vVVV.V',
    'V.vVVV.V',
    'VvvVVVvV',
    '.VvVVVVV',
    '..vVVV..',
    '..vVVV..',
    '..vVVV..',
    '..vVVV..',
    '..vVVV..',
  ],
  teschio: ['b........b', 'bn......nb', '.bbbbbbbb.', '..bNbbNb..', '..bbbbbb..', '...bnnb...', '...bNNb...'],
}

// The warrior: short dark hair, brown hood, black chainmail over a black cloak, the hilt of a sword over the shoulder
// and a green stone on a cord. Drawn facing right, mirrored when he comes in from the right
const GUERRIERO_BUSTO = [
  '.......HHHHH......',
  '...i..HHHHHHH.....',
  '...ij.HHHHHHHH....',
  '....L.HHSSSSSS....',
  '....L.HSSGSSGS....',
  '....L.HSSSSSSSS...',
  '....L..sSSSSSS....',
  '....L..sSSssS.....',
  '....L.ppSSSSp.....',
  '..jiiippppppyp....',
  '...kKmmmmmmmmKk...',
  '..kKmlmlmlmlmlKk..',
  '..KKmmmmmmpmmmKK..',
  '..KKmlmlmpmlmmSK..',
  '..KKmmmmzzmmmmSK..',
  '..KKmlmlzzmlmlKK..',
  '..KKmmmmmmmmmmKK..',
  '...KmlmlmlmlmlK...',
  '...KmmmmmmmmmmK...',
  '...KKKKKKKKKKKK...',
]

export const GUERRIERO_FERMO = [
  ...GUERRIERO_BUSTO,
  '.....ZZ...ZZ......',
  '.....ZZ...ZZ......',
  '.....ZZ...ZZ......',
  '....OOO...OOO.....',
]

export const GUERRIERO_CORSA = [
  [...GUERRIERO_BUSTO, '....ZZ.....ZZ.....', '...ZZ.......ZZ....', '..ZZ.........ZZ...', '.OOO.........OOO..'],
  [...GUERRIERO_BUSTO, '.......ZZZ........', '......ZZZZ........', '......ZZ.ZZ.......', '.....OOO.OOO......'],
]

// The blow: the sword is out of its scabbard and held straight ahead
export const GUERRIERO_COLPO = GUERRIERO_FERMO.map((riga, j) => {
  const corpo = riga.replace(/[ijL]/g, '.')
  if (j === 10 || j === 12) return corpo.slice(0, 17) + 'j'
  if (j === 11) return corpo.slice(0, 16) + 'Sjiiiiiiiiiiii'
  return corpo
})

// Life meter: square jars of healing draught, one emptied by each hit
export const VASO_PIENO = [
  '..ooooo..',
  '..ooooo..',
  '.ggggggg.',
  '..gehhg..',
  'ggggggggg',
  'ghuuuuuug',
  'ghuuuuuug',
  'guuuuuuUg',
  'guuuuuuUg',
  'guuuuuUUg',
  'ggggggggg',
]

export const VASO_VUOTO = VASO_PIENO.map((riga, j) => (j > 1 ? riga.replace(/[uU]/g, 'e') : riga.replace(/o/g, '.')))

export const AVVOLTOIO = [
  [
    '..aa............',
    '..aAaa..........',
    '...aAAaa........',
    '....aAAAa....IJ.',
    '.....AAAAAAAIIJJ',
    '....AAAAAAAAAI..',
    '...AAAAAAAA.....',
    '..AA............',
  ],
  [
    '................',
    '................',
    '.............IJ.',
    '.....aAAAAAAIIJJ',
    '...aAAAAAAAAAI..',
    '..aAAAaAAAA.....',
    '.aAAa..aA.......',
    'aAa......a......',
  ],
]
