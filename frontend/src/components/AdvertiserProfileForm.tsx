import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { onInvalid } from "../util/onInvalid";
import MyTextField from "./Form/MyTextField";
import MyUploadField from "./Form/MyUploadField";

const validationSchema = createValidationSchema();
export type AdvertiserProfileFormFields = z.infer<typeof validationSchema>;

export const AdvertiserProfileForm = (props: {
  id: string;
  usedForm: ReturnType<typeof useAdvertiserProfileForm>;
  onSubmit: (data: AdvertiserProfileFormFields) => void;
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
            name="name"
            label="Název"
            required
            // InputLabelProps={{required: true}}
          />
          <MyTextField
            name="about"
            label="O vás"
            multiline
            maxRows={Infinity}
            minRows={4}
          />
          <MyTextField name="web" label="Váš web" type="url" />

          <MyUploadField name="logo" label="Logo" />
        </Stack>
      </form>
    </FormProvider>
  );
};

export const useAdvertiserProfileForm = () => {
  const usedForm = useForm<AdvertiserProfileFormFields>({
    mode: "onTouched",
    resolver: zodResolver(validationSchema),
  });

  return usedForm;
};

function createValidationSchema() {
  return z.object({
    name: z.string().min(1, `povinné`).optional(),
    about: z.string().nullish().optional(),
    web: z.string().url().nullish().optional(),
    logo: z
      .undefined() // no value
      .or(z.literal(false)) // deleted
      .or(z.string()) // current url
      .or(
        // @ts-expect-error until async type guard are implemented by tsc
        z.any().refine<File>(async (file) => {
          return new Promise((resolve, reject) => {
            if (typeof file !== "object") {
              return resolve(false);
            }

            if (!file) {
              // file is optional
              return resolve(true);
            }

            const previewUrl = URL.createObjectURL(file);
            let img = new Image();
            img.onload = () => {
              if (img.width > 80 || img.height > 80) {
                return resolve(false);
              }
              return resolve(true);
            };
            img.onerror = (e) => {
              return resolve(false);
            };
            img.src = previewUrl;
          });
        }, `File is invalid, max 80x80 px`)
      ),
  });
}
