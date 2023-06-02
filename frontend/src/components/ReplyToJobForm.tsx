import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "../hooks/useUser";
import { onInvalid } from "../util/onInvalid";
import MyCheckbox from "./Form/MyCheckbox";
import MyTextField from "./Form/MyTextField";
import { Link } from "./Link/Link";

const validationSchema = createValidationSchema();
export type FormFields = z.infer<typeof validationSchema>;

export const ReplyToJobForm = (props: {
  id?: string;
  usedForm: ReturnType<typeof useReplyToJobForm>;
  onSubmit: (data: FormFields) => void;
}) => {
  const { user } = useUser();

  return (
    <FormProvider {...props.usedForm}>
      <form
        id={props.id ?? "replyToJobForm"}
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
          <TextField label="Váš email" disabled value={user?.email} />

          <MyTextField
            required
            multiline={true}
            maxRows={Infinity}
            minRows={4}
            name="text"
            label="Zpráva, motivační dopis"
          />
          <MyCheckbox
            name="attachStudentProfile"
            label={
              <>
                Připojit odkaz na svůj{" "}
                <Link
                  target={"_blank"}
                  href={`/student/${user?.studentId}/profil`}
                >
                  studentský profil
                </Link>
              </>
            }
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useReplyToJobForm = () => {
  const usedForm = useForm<FormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    text: z.string().min(1, `required`),
    attachStudentProfile: z.boolean(),
  });
}
