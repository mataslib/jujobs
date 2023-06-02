export type StagGetStudentInfoResponse = {
  osCislo: string; // eg: B19192
  jmeno: string; // eg: Libor
  prijmeni: string; // eg: Matasek
  titulPred: null | string;
  titulZa: null | string;
  stav: 'S' | 'N' | 'P'; // S=studuje, N=nestudeje,absolvoval, P=prerusil
  userName: string; // eg: 'matasl02'
  stprIdno: string; // eg: '734'
  nazevSp: string; // eg: 'Aplikovaná informatika'
  fakultaSp: 'FEK' | 'FFI' | 'FPE' | 'FPR' | 'FRO' | 'FTE' | 'FZE' | 'FZS'; // eg: enum shortcut eg. 'FPR'
  kodSp: string; // eg: 'B1802'
  formaSp: 'P' | 'K' | 'D'; // P=prezencni, K=kombinovane, D=distancni
  typSp: string; // eg: 'B' | B=bakalar, D=doktorsky, M=magistersky, rigorozni, celozivotni, navazujici, ostatni, unverzita 3. veku, mezinarodne uznavany kurz
  typSpKey: '0' | '1' | '2' | '3' | '4' | '6' | '7' | '8'; // '0'navazujici, '1'Univerzita 3. veku, '2'Mezinarodne uznavany kurz, '3'Celozivotni, '4'Ostatni, '6'Rigorozni, '7'bakalarsky, '8'magistersky, '9'Doktorsky
  mistoVyuky: string; // eg: 'B'
  rocnik: string; // eg: '4'
  financovani: string; // eg: '1'
  oborKomb: string; // eg: '1801R001'
  oborIdnos: string; // eg: '1341'
  email: string; // eg: 'matasl02@prf.jcu.cz'
  maxDobaDatum: null | unknown;
  simsP58: null | unknown;
  simsP59: null | unknown;
  cisloKarty: string; // eg: 'E5CCF6D9
  pohlavi: string; // eg: 'M'
  rozvrhovyKrouzek: null | unknown;
  studijniKruh: null | unknown;
  evidovanBankovniUcet: 'A' | 'N';
};
