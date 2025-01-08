export const CATEGORIES = [
  "capteur",
  "switch",
  "bobine",
  "solenoide",
  "bouton poussoire",
  "demarreur",
  "alternateur",
  "lampe",
  "parabole",
  "klaxon",
  "avertisseur MA",
  "fusible",
  "cable",
  "cosse +",
  "cosse -",
  "ecm",
  "tableau",
  "divers"
] as const;

export type Category = typeof CATEGORIES[number];