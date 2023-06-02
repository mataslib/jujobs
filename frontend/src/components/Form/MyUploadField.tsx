import { TextField } from "@mui/material";
import { useState } from "react";
import { useController } from "react-hook-form";
import MyTextField from "./MyTextField";

// solution comes from
// - no name attribute and field spread on input
// - custom onChange
// - otherwiser submitted data contains something like: "C://fakepath/image.png",
//  but we need File|FileList object
// https://github.com/react-hook-form/react-hook-form/discussions/5394
// https://codesandbox.io/s/long-sun-nsfbk?file=/src/App.js:378-480
export default function MyUploadField(props) {
  const [inputValue, setInputValue] = useState("");
  const { name, ...restProps } = props;
  const usedController = useController({
    name: name,
    // defaultValue: "",
  });

  return (
    <>
      {(typeof usedController.field.value === "string" ||
        usedController.field.value) && (
        <div>
          <ImgPreview img={usedController.field.value} />
          <br />
          <a
            onClick={() => {
              usedController.field.onChange(false);
              setInputValue("");
            }}
          >
            Odstranit
          </a>
        </div>
      )}
      <TextField
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          usedController.field.onChange(e.target.files[0]);
        }}
        onBlur={usedController.field.onBlur}
        inputRef={usedController.field.ref}
        error={!!usedController.fieldState.error}
        helperText={usedController.fieldState.error?.message}
        fullWidth
        accept="image/*"
        type="file"
        InputLabelProps={{
          shrink: true,
        }}
        {...restProps}
      />
    </>
  );
}

const ImgPreview = ({ img }: { img: string | FileList | File }) => {
  let src;

  if (typeof img === "string") {
    src = img;
  } else {
    src = URL.createObjectURL(img?.[0] ?? img);
  }

  return <img width="80" src={src} />;
};
