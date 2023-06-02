import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormLabel, Stack } from "@mui/material";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../util/onInvalid";
import MySelect from "./Form/MySelect";
import MyTextField from "./Form/MyTextField";

const validationSchema = createValidationSchema();
export type StudyFormFields = z.infer<typeof validationSchema>;

export const StudyForm = (props: {
  id: string;
  usedForm: ReturnType<typeof useStudyForm>;
  // formData: FormFields;
  onSubmit: (data: StudyFormFields) => void;
}) => {
  const subjects = useFieldArray({
    control: props.usedForm.control,
    name: "predmetAbsolvoval",
  });

  return (
    <FormProvider {...props.usedForm}>
      <form
        id={props.id}
        onSubmit={props.usedForm.handleSubmit(
          props.onSubmit,
          onInvalid(props.usedForm)
        )}
        noValidate
      >
        <Stack spacing={2}>
          <MyTextField
            name="nazevSp"
            label="Název studovaného programu"
            required
          />
          <MySelect
            name="fakultaSp"
            label="Fakulta"
            required
            options={[
              {
                label: "Ekonomická fakulta",
                value: "FEK",
              },
              {
                label: "Filozofická fakulta",
                value: "FFI",
              },
              {
                label: "Pedagogická fakulta",
                value: "FPE",
              },
              {
                label: "Přírodovědecká fakulta",
                value: "FPR",
              },
              {
                label: "Fakulta rybářství a ochrany vod",
                value: "FRO",
              },
              {
                label: "Teologická fakulta",
                value: "FTE",
              },
              {
                label: "Fakulta zemědělská a technologická",
                value: "FZE",
              },
              {
                label: "Zdravotně sociální fakulta",
                value: "FZS",
              },
            ]}
          />
          <MySelect
            name="typSpKey"
            label="Typ studia"
            required
            options={[
              {
                label: "Navazující",
                value: "0",
              },
              {
                label: "Univerzita 3. věku",
                value: "1",
              },
              {
                label: "Mezinárodně uznávaný kurz",
                value: "2",
              },
              {
                label: "Celoživotní",
                value: "3",
              },
              {
                label: "Ostatní",
                value: "4",
              },
              {
                label: "Rigorózní",
                value: "6",
              },
              {
                label: "Bakalářské",
                value: "7",
              },
              {
                label: "Magisterské",
                value: "8",
              },
              {
                label: "Doktorské",
                value: "9",
              },
            ]}
          />

          <FormLabel>Předměty</FormLabel>
          <Box sx={{ p: 1 }}>
            {subjects.fields.map((field, idx) => (
              <Box
                sx={{ my: 1, display: "flex", alignItems: "center" }}
                key={field.id}
              >
                <MyTextField
                  name={`predmetAbsolvoval.${idx}.nazevPredmetu`}
                  label="Název předmětu"
                  required
                />

                <MySelect
                  name={`predmetAbsolvoval.${idx}.znamka`}
                  label="Známka"
                  options={[
                    {
                      value: null,
                      label: "\u00A0",
                    },
                    {
                      value: "S",
                      label: "Splněno",
                    },
                    {
                      value: "1",
                      label: "1",
                    },
                    {
                      value: "1,5",
                      label: "1,5",
                    },
                    {
                      value: "2",
                      label: "2",
                    },
                    {
                      value: "2,5",
                      label: "2,5",
                    },
                    {
                      value: "3",
                      label: "3",
                    },
                    {
                      value: "N",
                      label: "Nesplněno",
                    },
                  ]}
                />
                {/* <StudySubjectField /> */}
                <Button onClick={() => subjects.remove(idx)}>Odebrat</Button>
              </Box>
            ))}
            <Button
              onClick={() =>
                subjects.append({
                  znamka: undefined,
                  nazevPredmetu: undefined,
                })
              }
            >
              Přidat předmět
            </Button>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useStudyForm = () => {
  const usedForm = useForm<StudyFormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    nazevSp: z.string().min(1, "required"),
    fakultaSp: z.union([
      z.literal("FEK"),
      z.literal("FPR"),
      z.literal("FPE"),
      z.literal("FTE"),
      z.literal("FRO"),
      z.literal("FZE"),
      z.literal("FFI"),
      z.literal("FZS"),
    ]),
    typSpKey: z.union([
      z.literal("0"),
      z.literal("1"),
      z.literal("2"),
      z.literal("3"),
      z.literal("4"),
      z.literal("6"),
      z.literal("7"),
      z.literal("8"),
      z.literal("9"),
    ]),
    predmetAbsolvoval: z.array(
      z.object({
        znamka: z
          .union([
            z.literal("S"),
            z.literal("1"),
            z.literal("1,5"),
            z.literal("2"),
            z.literal("2,5"),
            z.literal("3"),
            z.literal("N"),
          ])
          .nullable()
          .optional(),
        nazevPredmetu: z.string(),
        // semestr: z
        //   .union([z.literal(semestrType.winter), z.literal(semestrType.summer)])
        //   .optional(),
        // rok: z.string().optional(),
        // absolvoval: z
        //   .union([z.literal(absolvovalType.yes), z.literal(absolvovalType.no)])
        //   .optional(),
      })
    ),
  });
}
