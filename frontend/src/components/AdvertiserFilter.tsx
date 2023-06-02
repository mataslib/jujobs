import { Box, Button, FormHelperText, Paper } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import MyTextField from "./Form/MyTextField";

type FormFields = {
  fulltext: string;
};

type JobsFilterProps = {
  onSubmit: (data: FormFields) => void;
  data: FormFields;
};

export default function AdvertiserFilter(props: JobsFilterProps) {
  const { onSubmit: parentOnSubmit, data: initialData } = props;

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data, errors);
    parentOnSubmit(data);
  };

  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    defaultValues: initialData,
  });

  useEffect(() => {
    usedForm.reset(initialData);
  }, [initialData]);

  const {
    handleSubmit,
    formState: { errors },
  } = usedForm;

  return (
    <Paper sx={{ padding: 0 }}>
      <FormProvider {...usedForm}>
        <form
          style={{ overflow: "auto", padding: "16px" }}
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
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
          </Box>

          <Button
            type="submit"
            variant="outlined"
            sx={{ display: "flex", marginTop: 1, position: "sticky", left: 0 }}
          >
            Hledat
          </Button>
        </form>
      </FormProvider>
    </Paper>
  );
}
