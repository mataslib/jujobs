import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { parsePathParams } from "../util/routeParse";

export const usePathParams = () => {
  const router = useRouter();
  const [state, setState] = React.useState({
    isLoading: true,
  });

  useEffect(() => {
    const parsed = parsePathParams(router.pathname, window.location.pathname);
    setState({
      isLoading: false,
      ...parsed,
    });
  }, []);

  return state;
};
