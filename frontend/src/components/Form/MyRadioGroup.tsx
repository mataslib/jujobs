import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";
import { ChangeEvent } from "react";
import { useController } from "react-hook-form";

type MyRadioGroupProps = {
  name: string;
  label?: string;
  row?: boolean;
  required?: boolean;
  options: string[] | NormalizedOption[];
  renderItemLabel?: (option: NormalizedOption) => JSX.Element;
};

export default function MyRadioGroup(props: MyRadioGroupProps): JSX.Element {
  const { name, renderItemLabel, options, label, row, required, ...restProps } =
    props;

  const usedController = useController({
    name: name,
    defaultValue: undefined,
  });
  const normalizedOptions: NormalizedOption[] = options.map((option) => {
    if (typeof option === "string") {
      return { label: option, value: option };
    }

    return option;
  });

  const isChecked = (normalizedOption: NormalizedOption) => {
    const currValue = usedController.field.value ?? undefined;
    return currValue === normalizedOption.value;
  };

  const onChange = (normalizedOption: NormalizedOption) => {
    return (e: ChangeEvent) => {
      const optionValue = normalizedOption.value;
      const currentValue = usedController.field.value ?? undefined;

      const isChecked = currentValue === optionValue;

      if (isChecked) {
        return;
      }

      const newValue = optionValue;
      usedController.field.onChange(newValue);
    };
  };

  return (
    <FormControl required={required} error={!!usedController.fieldState.error}>
      {label && <FormLabel>{label}</FormLabel>}

      <RadioGroup row={row}>
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
              <Radio
                checked={isChecked(normalizedOption)}
                onChange={onChange(normalizedOption)}
              />
            }
          />
        ))}
      </RadioGroup>
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
