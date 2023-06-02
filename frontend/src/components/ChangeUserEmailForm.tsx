import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../util/onInvalid";
import MyTextField from "./Form/MyTextField";

const validationSchema = createValidationSchema();
export type FormFields = z.infer<typeof validationSchema>;

export const ChangeUserEmailForm = (props: {
  id: string;
  usedForm: ReturnType<typeof useChangeUserEmailForm>;
  // formData: FormFields;
  onSubmit: (data: FormFields) => void;
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
          <MyTextField name="newEmail" type="email" label="Email" required />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useChangeUserEmailForm = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    newEmail: z.string().email(),
  });
}
