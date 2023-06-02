import { TextField } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import Dropzone, { useDropzone } from "react-dropzone";

export const Upload = React.forwardRef(function Upload(props, ref) {
  const [filesWithPreview, setFilesWithPreview] = useState([]);

  return (
    <Dropzone
      multiple={false}
      accept={"image/*"}
      onDrop={(acceptedFiles) => {
        setFilesWithPreview(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          )
        );
      }}
    >
      {({ acceptedFiles, getRootProps, getInputProps }) => (
        <div>
          <div {...getRootProps()}>
            <input {...getInputProps()} {...props} ref={ref} />
            <TextField
              label="Logo"
              InputLabelProps={{
                shrink: true,
              }}
              helperText={`Max 80x80 px`}
              fullWidth
            />

            <p>Vyberte nebo přetáhněte soubor</p>
          </div>
          {filesWithPreview.map((file) => (
            <div key={file.name}>
              <div>
                <img src={file.preview} />
              </div>
            </div>
          ))}
          {acceptedFiles.map((file) => (
            <li key={file.path}>
              {file.path} - {file.size} bytes
            </li>
          ))}
        </div>
      )}
    </Dropzone>
  );
});
