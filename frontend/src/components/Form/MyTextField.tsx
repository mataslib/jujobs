import { TextField, TextFieldProps } from "@mui/material";
import { ReactElement } from "react";
import { useController } from "react-hook-form";

type MyTextFieldProps = TextFieldProps & {
  name: string;
};

export default function MyTextField(props: MyTextFieldProps): ReactElement {
  const { name, ...restProps } = props;

  const usedController = useController({
    name: name,
    defaultValue: "",
  });

  return (
    <TextField
      {...restProps}
      onChange={usedController.field.onChange}
      onBlur={usedController.field.onBlur}
      inputRef={usedController.field.ref}
      value={usedController.field.value ?? ""}
      name={name}
      error={!!usedController.fieldState.error}
      helperText={usedController.fieldState.error?.message ?? props.helperText}
    />
  );
}
