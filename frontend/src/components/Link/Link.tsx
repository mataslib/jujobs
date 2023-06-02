// @ts-nocheck performance issues
import * as React from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import MuiLink, { LinkProps as MuiLinkProps } from "@mui/material/Link";
import { styled } from "@mui/material/styles";

export type LinkProps = NextLinkProps & MuiLinkProps;

// Source:
// https://github.com/mui/material-ui/tree/HEAD/examples/nextjs-with-typescript
// https://github.com/mui/material-ui/blob/4354d98587a6e64a69a1f104ad043af2ebf947e8/examples/nextjs-with-typescript/src/Link.tsx

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  function Link(props, ref) {
    const {
      activeClassName = "active",
      as,
      className: classNameProps,
      href,
      legacyBehavior,
      linkAs: linkAsProp,
      locale,
      noLinkStyle,
      prefetch,
      replace,
      role, // Link don't have roles.
      scroll,
      shallow,
      ...other
    } = props;

    const router = useRouter();

    if (!href) {
      return props.children;
    }
    const pathname = typeof href === "string" ? href : href.pathname;
    const className = clsx(classNameProps, {
      [activeClassName]: router.pathname === pathname && activeClassName,
    });

    const isExternal =
      typeof href === "string" &&
      (href.indexOf("mailto:") === 0 ||
        (typeof window !== "undefined" &&
          href.indexOf(window.location.host) !== -1));

    if (isExternal) {
      return (
        <MuiLink
          {...(noLinkStyle ? { underline: "none", color: "inherit" } : {})}
          className={className}
          href={href}
          ref={ref}
          {...other}
        />
      );
    }

    const linkAs = linkAsProp || as;
    const nextjsProps = {
      toHref: href,
      linkAs,
      replace,
      scroll,
      shallow,
      prefetch,
      legacyBehavior,
      locale,
    };

    return (
      <MuiLink
        {...(noLinkStyle ? { underline: "none", color: "inherit" } : {})}
        component={NextLinkComposed}
        className={className}
        ref={ref}
        {...nextjsProps}
        {...other}
      />
    );
  }
);

// Add support for the sx prop for consistency with the other branches.
const Anchor = styled("a")({});

export const NextLinkComposed = React.forwardRef<
  HTMLAnchorElement,
  NextLinkComposedProps
>(function NextLinkComposed(props, ref) {
  const {
    toHref,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior = true,
    locale,
    ...other
  } = props;

  return (
    <NextLink
      href={toHref}
      prefetch={prefetch}
      as={linkAs}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref
      locale={locale}
      legacyBehavior={legacyBehavior}
    >
      <Anchor ref={ref} {...other} />
    </NextLink>
  );
});
