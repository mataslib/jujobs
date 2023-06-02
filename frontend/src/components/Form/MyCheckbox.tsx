import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from "@mui/material";
import { useController } from "react-hook-form";

type MyCheckboxProps = {
  name: string;
  label?: string | JSX.Element;
  required?: boolean;
};

export default function MyCheckbox(props: MyCheckboxProps): JSX.Element {
  const { name, label, required, ...restProps } = props;

  const usedController = useController({
    name: name,
  });

  return (
    <FormControl required={required} error={!!usedController.fieldState.error}>
      <FormGroup row>
        <FormControlLabel
          label={label}
          onBlur={usedController.field.onBlur}
          inputRef={usedController.field.ref}
          control={
            <Checkbox
              checked={Boolean(usedController.field.value)}
              onChange={usedController.field.onChange}
            />
          }
        />
        {usedController.fieldState.error?.message && (
          <FormHelperText>
            {usedController.fieldState.error?.message}
          </FormHelperText>
        )}
      </FormGroup>
    </FormControl>
  );
}
