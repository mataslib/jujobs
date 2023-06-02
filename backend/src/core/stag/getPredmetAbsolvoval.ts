export type StagGetPredmetAbsolvovalResponse = {
  predmetAbsolvoval: {
    osCislo: string;
    katedra: 'FEK' | 'FFI' | 'FPE' | 'FPR' | 'FRO' | 'FTE' | 'FZE' | 'FZS'; // 'FPR'
    zkratka: string; // code eg: '003'
    datum: {value: string}; // datum absolvovani, format j.m.YYYY
    semestr: 'ZS' | 'LS';
    rok: string; // eg. 2019, 2020
    absolvoval: 'A' | 'N'; // 'N' pokud zatim neabsolvovano
    znamka: null | 'S' | '1' | '1,5' | '2' | '2,5' | '3' | 'N';
    nazevPredmetu: string; // 'Úvod do studia a života na VŠ';
    pocetKreditu: number;
  }[];
};
