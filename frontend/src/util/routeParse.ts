import { Router } from "next/router";

/**
 * Given path spec /first/second/[token]/third/[id],
 * Given currentUrl is /first/second/tokenParam/third/idParam,
 * Output is { token: "tokenParam", id: "idParam" }
 * @param pathPart
 */
export function parsePathParams(pathSpec: string, currentPath: string) {
  const specParts = pathSpec.split("/");
  const currentParts = currentPath.split("/");

  if (specParts.length !== currentParts.length) {
    return undefined;
  }

  let parsed = {};
  const parseDynamicPart = (pathPart: string) => {
    const matches = /\[(?<paramName>\w+)\]/.exec(pathPart);
    return matches?.groups?.paramName ?? undefined;
  };

  for (const idx in specParts) {
    const specPart = specParts[idx];
    const currentPart = currentParts[idx];
    const partName = parseDynamicPart(specPart);
    const isDynamicPart = partName !== undefined;

    if (isDynamicPart) {
      parsed = {
        ...(parsed ?? {}),
        [partName]: currentPart,
      };
      continue;
    }

    if (specPart !== currentPart) {
      return undefined;
    }
  }

  return parsed;
}

// function clientRouteParamsParse(router: Router) {
//   const parsePathParam = (pathPart: string) => {
//     pathPart.match(/\[(\w)\]/g)

//     return !== null;
//   };

//   router.pathname.split("/").forEach((path) => {

//   });

//   ("/registrace/overeni/[token]");
// }
