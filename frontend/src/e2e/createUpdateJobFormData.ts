import {
  ClickTextDefinition,
  FillFormDefinitions,
  SelectDefinition,
  FillDefinition,
} from "./myPage";
import { format } from "date-fns";

export const titleDef: FillDefinition = {
  type: "fill",
  label: "Název pozice",
  value: "Astronaut",
};

export const scopeDef: FillDefinition = {
  type: "fill",
  label: "Rozsah spolupráce (počet hodin/týden)",
  value: "půl roku",
};

export const legalTypeDef: SelectDefinition = {
  type: "select",
  label: "Forma spolupráce",
  value: "Pracovní smlouva",
};

export const textDef: FillDefinition = {
  type: "fill",
  label: "Co Tě na pozici bude čekat",
  value: "Budete cestovat po měsíci v galaxii daleko a ještě dál.",
};
export const requirementsDef: FillDefinition = {
  type: "fill",
  label: "Jaké znalosti a dovednosti bys měl/a mít?",
  value: "Měl bys mít zkušenosti v astronomii, umět dýchat ve vakuu a létat.",
};
export const benefitsDef: FillDefinition = {
  type: "fill",
  label: "Co Ti společnost může nabídnout?",
  value: "Let do vesmíru.",
};
export const salaryDef: FillDefinition = {
  type: "fill",
  label: "Výše mzdy/platu",
  value: "1000 $ / hodinu",
};

export const placeDef: ClickTextDefinition = {
  type: "clickText",
  text: "Zahraničí",
};

export const specificPlaceDef: FillDefinition = {
  type: "fill",
  label: "Upřesněné místo výkonu práce",
  value: "Kdekoli",
};

export const startDateDef: FillDefinition = {
  type: "fill",
  label: "Datum nástupu do práce",
  value: "co nejdříve",
};

export const deadlineAtDef: FillDefinition = {
  type: "fill",
  label: "Deadline/Platnost nabídky",
  value: format(new Date(), "yyyy-MM-dd"),
};
export const otherDef: FillDefinition = {
  type: "fill",
  label: "Jiné",
  value: "Jiné",
};

export const facultyTypesDef: SelectDefinition = {
  type: "select",
  label: "Vhodné pro studenty fakult",
  value: "Přírodovědecká",
};
export const fieldTypesDef: SelectDefinition = {
  type: "select",
  label: "Oblasti práce",
  value: "Administrativa",
};
export const employmentTypeDef: SelectDefinition = {
  type: "select",
  label: "Druh úvazku",
  value: "Plný úvazek",
};
export const durationTypeDef: SelectDefinition = {
  type: "select",
  label: "Doba spolupráce",
  value: "Dlouhodobá",
};
export const homeofficeDef: ClickTextDefinition = {
  type: "clickText",
  text: "Možnost homeoffice",
};

export const replyToJobDef: FillDefinition = {
  type: "fill",
  label: "Reakce zasílat na email",
  value: "test@test.cz",
};

export const validFillFormDefinitions: FillFormDefinitions = [
  titleDef,
  scopeDef,
  legalTypeDef,
  textDef,
  requirementsDef,
  benefitsDef,
  salaryDef,
  placeDef,
  specificPlaceDef,
  startDateDef,
  deadlineAtDef,
  otherDef,
  fieldTypesDef,
  facultyTypesDef,
  employmentTypeDef,
  durationTypeDef,
  homeofficeDef,
  replyToJobDef,
];
