import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputAdornment, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../util/onInvalid";
import MyTextField from "./Form/MyTextField";

const validationSchema = createValidationSchema();
export type StudentFormFields = z.infer<typeof validationSchema>;

export const StudentForm = (props: {
  id: string;
  usedForm: ReturnType<typeof useStudentForm>;
  // formData: FormFields;
  onSubmit: (data: StudentFormFields) => void;
}) => {
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
            name="linkedin"
            type="url"
            label="Odkaz na linkedin"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faLinkedin} />
                </InputAdornment>
              ),
            }}
          />
          <MyTextField
            name="cv"
            type="url"
            label="Odkaz na Životopis"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faFileAlt} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useStudentForm = () => {
  const usedForm = useForm<StudentFormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    linkedin: z.string().url().optional(),
    cv: z.string().url().optional(),
  });
}
