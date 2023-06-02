export type UpdateStudyRequestBody = {
  studyId: string;
  // Study
  nazevSp: string;
  fakultaSp: "FEK" | "FPR" | "FPE" | "FTE" | "FRO" | "FZE" | "FFI" | "FZS";
  typSpKey: "0" | "1" | "2" | "3" | "4" | "6" | "7" | "8" | "9";
  predmetAbsolvoval: {
    znamka: "1" | "2" | "3" | "S" | "1,5" | "2,5" | "N";
    nazevPredmetu: string;
  }[];
};
export type UpdateStudyResultBody = {
  studyId: string;
};

