import { TextField, TextFieldProps } from "@mui/material";
import { format } from "date-fns";
import { ReactElement } from "react";
import { useController } from "react-hook-form";

type MyDateField = TextFieldProps & {
  name: string;
};

/**
 * Accepts string or Date value.
 *  Input - string yyyy-mm-dd ISO8601 https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
 *  corresponds to html date input value spec.
 */
export default function MyDateField(props: MyDateField): ReactElement {
  const { name, ...restProps } = props;

  const usedController = useController({
    name: name,
    defaultValue: "",
  });

  return (
    <TextField
      type="date"
      {...restProps}
      onChange={(event) => {
        const stringDate = event.currentTarget?.value;
        // Date | null will be available in formState such as useForm.watch('deadlineAt');
        usedController.field.onChange(stringDate ?? "");
      }}
      onBlur={usedController.field.onBlur}
      inputRef={usedController.field.ref}
      value={dateValueToDateInputValue(usedController.field.value)}
      name={name}
      error={!!usedController.fieldState.error}
      helperText={usedController.fieldState.error?.message ?? props.helperText}
    />
  );
}

export function dateValueToDateInputValue(value: unknown) {
  if (!value) {
    // undefined, null, falsy
    return ""; // input will be empty
  }

  // string date or Date instance
  return format(new Date(value), "yyyy-MM-dd");
}
