import { isAxiosError } from "axios";
import { useReducer } from "react";
import { ApiOrNetworkError, parseApiError } from "src/util/apiError";
import { genericErrorMessage, genericSuccessMessage } from "src/util/error";
import { v4 as uuid } from "uuid";
import { MyAlert } from "./MyAlert";

export const Alerts = (props: { usedAlerts: ReturnType<typeof useAlerts> }) => {
  return (
    <>
      {props.usedAlerts.alerts.map((alert) => (
        <MyAlert
          key={alert.id}
          severity={alert.severity}
          handleClose={() => props.usedAlerts.closeAlert(alert.id)}
        >
          {alert.message}
        </MyAlert>
      ))}
    </>
  );
};

export const useAlerts = () => {
  const [alerts, dispatch] = useReducer(reducer, []);

  return {
    alerts,
    closeAlert: (id: string) => {
      dispatch({
        type: "close",
        payload: {
          id,
        },
      });
    },
    addSuccessAlert: (message?: string) => {
      dispatch({
        type: "add",
        payload: {
          id: uuid(),
          message: message ?? genericSuccessMessage,
          severity: "success",
        },
      });
    },
    addErrorAlert: (error?: string | Error | ApiOrNetworkError) => {
      let message: string | undefined;

      //
      if (error === undefined || error === null) {
        message = genericErrorMessage;
      } else if (typeof error === "string") {
        message = error;
      } else if (isAxiosError(error)) {
        message = parseApiError(error).message;
      } else if (error?.message) {
        message = error.message;
      }

      if (!message) {
        message = genericErrorMessage;
      }

      dispatch({
        type: "add",
        payload: {
          id: uuid(),
          message,
          severity: "error",
        },
      });
    },
  };
};

function reducer(state: AlertsState, action: AlertsAction) {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "close":
      return state.filter((alert) => alert.id !== action.payload.id);
    default:
      return state;
  }
}

type Alert = {
  id: string;
  message: string;
  severity: "success" | "error";
};

type AlertsState = Alert[];
type AlertsAction =
  | {
      type: "add";
      payload: Alert;
    }
  | {
      type: "close";
      payload: {
        id: string;
      };
    };
