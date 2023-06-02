import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from "@mui/material";
import { ChangeEvent } from "react";
import { useController } from "react-hook-form";

type MyCheckboxGroupProps = {
  name: string;
  label?: string;
  row?: boolean;
  required?: boolean;
  options: string[] | NormalizedOption[];
  renderItemLabel?: (option: NormalizedOption) => JSX.Element;
};

export default function MyCheckboxGroup(
  props: MyCheckboxGroupProps
): JSX.Element {
  const { name, renderItemLabel, options, label, row, required, ...restProps } =
    props;

  const usedController = useController({
    name: name,
    defaultValue: [],
  });

  const normalizedOptions: NormalizedOption[] = options.map((option) => {
    if (typeof option === "string") {
      return { label: option, value: option };
    }

    return option;
  });

  const isChecked = (normalizedOption: NormalizedOption) => {
    const currValue = usedController.field.value ?? [];
    return currValue.includes(normalizedOption.value);
  };

  const onChange = (normalizedOption: NormalizedOption) => {
    return (e: ChangeEvent) => {
      const optionValue = normalizedOption.value;
      const currentValue = [...(usedController.field.value ?? [])];
      const isChecked = usedController.field.value.includes(optionValue);
      let newValue = [];
      if (isChecked) {
        newValue = currentValue.filter((val) => val !== optionValue);
      } else {
        newValue = [...currentValue, optionValue];
      }
      usedController.field.onChange(newValue);
    };
  };

  return (
    <FormControl required={required} error={!!usedController.fieldState.error}>
      {label && <FormLabel>{label}</FormLabel>}

      <FormGroup row={row}>
        {normalizedOptions.map((normalizedOption) => (
          <FormControlLabel
            key={normalizedOption.value}
            label={
              renderItemLabel
                ? renderItemLabel(normalizedOption)
                : normalizedOption.label
            }
            onBlur={usedController.field.onBlur}
            inputRef={usedController.field.ref}
            control={
              <Checkbox
                checked={isChecked(normalizedOption)}
                onChange={onChange(normalizedOption)}
              />
            }
          />
        ))}
      </FormGroup>
      {usedController.fieldState.error?.message && (
        <FormHelperText>
          {usedController.fieldState.error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

type NormalizedOption = {
  label: string;
  value: any;
};
