type Entschuldigungen = {
  id: string;
  vorname: string;
  klassenleiter: string;
  klasse: string;
  zeitraumVon: Date;
  zeitraumBis: Date;
  begruendung: string;
  zusatzlicherKommentar: string;
  ortDatum: string;
  unterschrift: string;
};

export type { Entschuldigungen };
