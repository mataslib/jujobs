import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  FormHelperText,
  OutlinedInput,
  Select,
} from "@mui/material";
import { useController } from "react-hook-form";
import { widthByLabel } from "../../util/utils";

type MyMultiSelectProps = {
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const selectCheckMenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
  ...anchorSelectDropdownLeftMenuProps,
};

const selectChipRenderValue = (selected) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
    {selected.map((value) => (
      <Chip key={value} label={value} />
    ))}
  </Box>
);

export default function MyMultiSelect(props: MyMultiSelectProps): JSX.Element {
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
        onChange={usedController.field.onChange}
        onBlur={usedController.field.onBlur}
        inputRef={usedController.field.ref}
        value={usedController.field.value}
        // required
        multiple
        input={<OutlinedInput label={label} />}
        renderValue={(selectedValues) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selectedValues?.map((selectedValue) => (
                <Chip
                  key={selectedValue}
                  label={
                    optionsNormalized.find(
                      (option) => option.value === selectedValue
                    )?.label
                  }
                />
              ))}
            </Box>
          );
        }}
        MenuProps={selectCheckMenuProps}
        autoWidth
      >
        {optionsNormalized.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox
              checked={usedController.field.value.indexOf(option.value) !== -1}
            />
            <ListItemText primary={option.label} />
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
