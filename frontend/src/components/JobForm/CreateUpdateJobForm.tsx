import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { addMonths, format, startOfDay } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../../util/onInvalid";
import MyCheckbox from "../Form/MyCheckbox";
import MyDateField from "../Form/MyDateField";
import MyMultiSelect from "../Form/MyMultiSelect";
import MyRadioGroup from "../Form/MyRadioGroup";
import MyTextField from "../Form/MyTextField";
import { PlaceIcon } from "../Jobs/PlaceIcon";

const validationSchema = createValidationSchema();
export type CreateUpdateJobFormFieldsOutput = z.infer<typeof validationSchema>;
export type CreateUpdateJobFormFields = Omit<
  CreateUpdateJobFormFieldsOutput,
  "deadlineAt"
> & {
  deadlineAt: string;
};

export const CreateUpdateJobForm = (props: {
  id?: string;
  usedForm: ReturnType<typeof useCreateUpdateJobForm>;
  onSubmit: (data: CreateUpdateJobFormFieldsOutput) => void;
}) => {
  return (
    <FormProvider {...props.usedForm}>
      <form
        id={props.id ?? "CreateJobForm"}
        onSubmit={props.usedForm.handleSubmit(
          props.onSubmit,
          onInvalid(props.usedForm)
        )}
        noValidate
      >
        <Stack
          spacing={2}
          // alignItems="flex-start"
        >
          <MyTextField
            name="title"
            label="Název pozice"
            required
            // InputLabelProps={{required: true}}
          />

          <MyTextField
            name="scope"
            label="Rozsah spolupráce (počet hodin/týden)"
            required
          />

          <MyMultiSelect
            name="legalType"
            label="Forma spolupráce"
            required
            options={[
              "Dohoda o provedení práce",
              "Dohoda o provedení činnosti",
              "Pracovní smlouva",
              "OSVČ",
              "Stáž",
              "Praxe",
            ]}
          />

          <MyTextField
            name="text"
            label="Co Tě na pozici bude čekat"
            required
            multiline
            maxRows={Infinity}
            minRows={4}
          />

          <MyTextField
            name="requirements"
            label="Jaké znalosti a dovednosti bys měl/a mít?"
            required
            multiline
            maxRows={Infinity}
            minRows={4}
          />

          <MyTextField
            name="benefits"
            label="Co Ti společnost může nabídnout?"
            required
            multiline
            maxRows={Infinity}
            minRows={4}
          />

          <MyTextField
            name="other"
            label="Jiné"
            multiline
            maxRows={Infinity}
            minRows={4}
          />

          <MyTextField name="salary" label="Výše mzdy/platu" />

          <MyRadioGroup
            name="place"
            label="Místo"
            required
            options={["Celá Česká republika", "Jižní Čechy", "Zahraničí"]}
            renderItemLabel={(option) => (
              <>
                {option.label}&nbsp;&nbsp;
                <PlaceIcon place={option.value} />
              </>
            )}
          />

          <MyTextField
            name="specificPlace"
            label="Upřesněné místo výkonu práce"
            required
          />

          <MyTextField
            name="startDate"
            label="Datum nástupu do práce"
            required
          />

          <MyDateField
            name="deadlineAt"
            label="Deadline/Platnost nabídky"
            required
            inputProps={{
              min: format(new Date(), "yyyy-MM-dd"),
              max: format(addMonths(new Date(), 3), "yyyy-MM-dd"),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={
              {
                // width: "180px",
              }
            }
            helperText="Po tomto datu bude nabídka automaticky archivovaná."
          />

          <MyMultiSelect
            name="fieldTypes"
            label="Oblasti práce"
            required
            options={[
              "Administrativa",
              "Doprava",
              "Finance",
              "Informační technologie",
              "Kultura a sport",
              "Management",
              "Obchod a cestovní ruch",
              "Obrana a ochrana",
              "Právo",
              "Služby",
              "Stavebnictví",
              "Věda a výzkum",
              "Výchova a vzdělávání",
              "Výroba a provoz",
              "Zdravotnictví",
              "Zemědělství a lesnictví",
              "Jiné",
            ]}
          />

          <MyMultiSelect
            name="facultyTypes"
            label="Vhodné pro studenty fakult"
            options={[
              "Ekonomická",
              "Přírodovědecká",
              "Pedagogická",
              "Teologická",
              "Rybářství a ochrany vod",
              "Zemědělská a technologická",
              "Filozofická",
              "Zdravotně sociální",
            ]}
          />

          <MyMultiSelect
            name="employmentType"
            label="Druh úvazku"
            required
            options={[
              "Plný úvazek",
              "Zkrácený úvazek",
              "Pracovní doba dle dohody",
            ]}
          />

          <MyMultiSelect
            name="durationType"
            label="Doba spolupráce"
            required
            options={[
              "Krátkodobá",
              "Krátkodobá s možností navázaní spolupráce",
              "Dlouhodobá",
            ]}
          />

          <MyCheckbox
            name="homeoffice"
            label={
              <>
                Možnost homeoffice&nbsp;&nbsp;
                <FontAwesomeIcon icon={faWifi} fixedWidth />
              </>
            }
          />

          <MyTextField
            name="replyToEmail"
            label="Reakce zasílat na email"
            required
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useCreateUpdateJobForm = () => {
  const usedForm = useForm<CreateUpdateJobFormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    title: z.string().min(1, `povinné`),
    scope: z.string().min(1, `povinné`),
    text: z.string().min(1, `povinné`),
    requirements: z.string().min(1, `povinné`),
    benefits: z.string().min(1, `povinné`),
    salary: z.string(),
    place: z.union([
      z.literal("Celá Česká republika"),
      z.literal("Jižní Čechy"),
      z.literal("Zahraničí"),
    ]),
    specificPlace: z.string().min(1, `povinné`),
    startDate: z.string().min(1, `povinné`),
    deadlineAt: z.coerce
      .date()
      .max(
        addMonths(new Date(), 3),
        `Může být nastaven maximálně 3 měsíce v budoucnu`
      )
      .min(startOfDay(new Date()), "Nelze nastavit v minulosti"),
    other: z.string().optional(),
    legalType: z
      .array(
        z.union([
          z.literal("Dohoda o provedení práce"),
          z.literal("Dohoda o provedení činnosti"),
          z.literal("Pracovní smlouva"),
          z.literal("OSVČ"),
          z.literal("Stáž"),
          z.literal("Praxe"),
        ])
      )
      .nonempty("povinné"),
    durationType: z
      .array(
        z.union([
          z.literal("Krátkodobá"),
          z.literal("Krátkodobá s možností navázaní spolupráce"),
          z.literal("Dlouhodobá"),
        ])
      )
      .nonempty("povinné"),
    employmentType: z
      .array(
        z.union([
          z.literal("Plný úvazek"),
          z.literal("Zkrácený úvazek"),
          z.literal("Pracovní doba dle dohody"),
        ])
      )
      .nonempty("povinné"),
    fieldTypes: z
      .array(
        z.union([
          z.literal("Administrativa"),
          z.literal("Doprava"),
          z.literal("Finance"),
          z.literal("Informační technologie"),
          z.literal("Kultura a sport"),
          z.literal("Management"),
          z.literal("Obchod a cestovní ruch"),
          z.literal("Obrana a ochrana"),
          z.literal("Právo"),
          z.literal("Služby"),
          z.literal("Stavebnictví"),
          z.literal("Věda a výzkum"),
          z.literal("Výchova a vzdělávání"),
          z.literal("Výroba a provoz"),
          z.literal("Zdravotnictví"),
          z.literal("Zemědělství a lesnictví"),
          z.literal("Jiné"),
        ])
      )
      .nonempty("povinné"),
    facultyTypes: z
      .array(
        z.union([
          z.literal("Ekonomická"),
          z.literal("Přírodovědecká"),
          z.literal("Pedagogická"),
          z.literal("Teologická"),
          z.literal("Rybářství a ochrany vod"),
          z.literal("Zemědělská a technologická"),
          z.literal("Filozofická"),
          z.literal("Zdravotně sociální"),
        ])
      )
      .optional(),
    homeoffice: z.coerce.boolean(),
    replyToEmail: z.string().email().min(1, `povinné`),
  });
}
