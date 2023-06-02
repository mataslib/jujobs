import { Alert, AlertProps } from "@mui/material";
import { useState } from "react";

export const MyAlert = (
  props: { closeable?: boolean; handleClose?: () => void } & AlertProps
) => {
  const { closeable = true, handleClose = () => {}, ...alertProps } = props;
  const [closed, setClosed] = useState(false);

  const _handleClose = () => {
    setClosed(true);
    handleClose();
  };

  if (closed) {
    return null;
  }

  return (
    <Alert onClose={_handleClose} {...alertProps}>
      {props.children}
    </Alert>
  );
};
