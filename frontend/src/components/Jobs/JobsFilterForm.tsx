import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, FormHelperText } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useUser } from "../../hooks/useUser";
import { onInvalid } from "../../util/onInvalid";
import MyCheckbox from "../Form/MyCheckbox";
import MyCheckboxGroup from "../Form/MyCheckboxGroup";
import MyMultiSelect from "../Form/MyMultiSelect";
import MyTextField from "../Form/MyTextField";
import { PlaceIcon } from "./PlaceIcon";

export type FormFields = {
  fulltext?: string;
  homeoffice?: boolean;
  place?: ("Celá Česká republika" | "Jižní Čechy" | "Zahraničí")[];
  employmentType?: (
    | "Plný úvazek"
    | "Zkrácený úvazek"
    | "Pracovní doba dle dohody"
  )[];
  legalType?: (
    | "Dohoda o provedení práce"
    | "Dohoda o provedení činnosti"
    | "Pracovní smlouva"
    | "OSVČ"
    | "Stáž"
    | "Praxe"
  )[];
  durationType?: (
    | "Krátkodobá"
    | "Krátkodobá s možností navázaní spolupráce"
    | "Dlouhodobá"
  )[];
  showOnlyNotApproved?: boolean;
};

export default function JobsFilterForm(props: {
  id: string;
  usedForm: ReturnType<typeof useJobsFilterForm>;
  onSubmit: (data: FormFields) => void;
}) {
  const { user } = useUser();

  return (
    <FormProvider {...props.usedForm}>
      <form
        id={props.id}
        style={{ overflow: "auto", padding: "16px" }}
        onSubmit={props.usedForm.handleSubmit((formData) => {
          const normalizedData = formData;
          [
            "homeoffice" as keyof FormFields,
            "place" as keyof FormFields,
          ].forEach((key) => {
            if (normalizedData[key] === false) {
              delete normalizedData[key];
            }
          });

          props.onSubmit(normalizedData);
        }, onInvalid(props.usedForm))}
        autoComplete="off"
        noValidate
      >
        <Box
          // sx={{
          //   display: "inline-flex",
          //   alignItems: "center",
          //   padding: 2,
          //   "> *": {
          //     flexShrink: 0,
          //   },
          //   width: "auto",
          //   overflow: "auto",
          // }}
          sx={{
            display: "inline-grid",
            alignItems: "center",
            gridAutoFlow: "column",
            gridAutoColumns: "max-content",
            // padding: 2,
            paddingBottom: 3, // for absolute label not to overflow
            // width: "auto",
            // overflow: "auto",
          }}
          gap={2}
        >
          <div style={{ position: "relative" }}>
            <MyTextField name="fulltext" label="V názvu / textu" />

            <FormHelperText sx={{ position: "absolute" }} variant="outlined">
              Použijte diakritiku.
            </FormHelperText>
          </div>

          {user && user.roles.includes("admin") && (
            <MyCheckbox
              name="showOnlyNotApproved"
              label="Zobrazit neschválené"
            />
          )}

          <MyCheckboxGroup
            name="place"
            label="Místo"
            options={["Celá Česká republika", "Jižní Čechy", "Zahraničí"]}
            row
            renderItemLabel={(option) => (
              <>
                {option.label}&nbsp;&nbsp;
                <PlaceIcon place={option.value} />
              </>
            )}
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

          <MyMultiSelect
            name="employmentType"
            label="Druh úvazku"
            options={[
              "Plný úvazek",
              "Zkrácený úvazek",
              "Pracovní doba dle dohody",
            ]}
          />

          <MyMultiSelect
            name="legalType"
            label="Typ spolupráce"
            options={[
              "Dohoda o provedení práce",
              "Dohoda o provedení činnosti",
              "Pracovní smlouva",
              "OSVČ",
              "Stáž",
              "Praxe",
            ]}
          />

          <MyMultiSelect
            name="durationType"
            label="Doba spolupráce"
            options={[
              "Krátkodobá",
              "Krátkodobá s možností navázaní spolupráce",
              "Dlouhodobá",
            ]}
          />
        </Box>
      </form>
    </FormProvider>
  );
}

export const useJobsFilterForm = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",

    // resolver: zodResolver(validationSchema),
  });

  return {
    ...usedForm,
    reset: (values: FormFields | {} | undefined | null) => {
      if (values && Object.values(values).length > 0) {
        usedForm.reset(values);
        return;
      }

      usedForm.reset({
        fulltext: "",
        showOnlyNotApproved: false,
        place: [],
        homeoffice: false,
        employmentType: [],
        legalType: [],
        durationType: [],
      });
    },
  };
};
