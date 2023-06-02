import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectProps,
} from "@mui/material";
import { ReactElement, ReactNode } from "react";
import { useController } from "react-hook-form";
import { widthByLabel } from "../../util/utils";

type MySelectProps = SelectProps & {
  name: string;
  label?: string | JSX.Element;
  required?: boolean;
  options:
    | string[]
    | {
        label: string;
        value: any;
      }[];
};

const anchorSelectDropdownLeftMenuProps = {
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
};
const selectCheckMenuProps = {
  // PaperProps: {
  //   style: {
  //     maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  //   },
  // },
  ...anchorSelectDropdownLeftMenuProps,
};

export default function MySelect(props: MySelectProps): ReactElement {
  const { name, label, options, required, ...restProps } = props;

  const optionsNormalized = options?.map((option) => {
    if (typeof option === "string") {
      return {
        value: option,
        label: option,
      };
    }

    return option;
  });

  const usedController = useController({
    name: name,
    // !important otherwise indexOf not on array
    defaultValue: [],
  });

  return (
    <FormControl
      required={required}
      error={!!usedController.fieldState.error}
      sx={{
        minWidth: widthByLabel(label),
      }}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...restProps}
        label={label}
        onChange={usedController.field.onChange}
        onBlur={usedController.field.onBlur}
        inputRef={usedController.field.ref}
        value={usedController.field.value ?? ""}
        input={<OutlinedInput label={label} />}
        MenuProps={selectCheckMenuProps}
        autoWidth
      >
        {optionsNormalized.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {!!usedController.fieldState.error && (
        <FormHelperText>
          {usedController.fieldState.error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}
