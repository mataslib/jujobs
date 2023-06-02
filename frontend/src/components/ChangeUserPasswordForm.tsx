import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../util/onInvalid";
import MyTextField from "./Form/MyTextField";

const validationSchema = createValidationSchema();
export type FormFields = z.infer<typeof validationSchema>;

export const ChangeUserPasswordForm = (props: {
  id: string;
  usedForm: ReturnType<typeof useChangeUserPasswordForm>;
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
          <MyTextField name="password" type="password" label="Heslo" required />
          <MyTextField
            name="passwordRepeat"
            type="password"
            label="Heslo znovu"
            required
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useChangeUserPasswordForm = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z
    .object({
      password: z.string().min(8, `Alespoň 8 znaků`),
      passwordRepeat: z.string(),
    })
    .refine((data) => data.password === data.passwordRepeat, {
      message: "Hesla se neshodují",
      path: ["passwordRepeat"],
    });
}
