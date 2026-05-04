import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { useId } from "react";

function Logo() {
  const id = useId();
  const clipId = `${id}-clip`;

  return (
    <svg
      width="16"
      height="22"
      viewBox="0 0 23 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>BaseHub Logo</title>
      <g clipPath={clipId}>
        <rect
          y="0.90625"
          width="22.7813"
          height="29.4375"
          rx="4.6875"
          fill="var(--color-fd-background)"
        ></rect>
        <rect
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 8.07422 37.1143)"
          fill="var(--color-fd-primary)"
          fillOpacity="0.6"
        ></rect>
        <rect
          opacity="0.5"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 8.07422 33.7915)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.4"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 4.74902 33.7915)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.35"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 1.4248 33.7915)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.3"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 0.475586 31.417)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.25"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 0.000976562 28.5684)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.2"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 -1.42383 26.6689)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.15"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 -4.74707 26.6689)"
          fill="var(--color-fd-primary)"
        ></rect>
        <rect
          opacity="0.1"
          width="44.6311"
          height="2.374"
          transform="matrix(0.707108 -0.707105 0.707108 0.707105 -8.07129 26.6689)"
          fill="var(--color-fd-primary)"
        ></rect>
      </g>
      <rect
        x="0.712199"
        y="1.61845"
        width="21.3569"
        height="28.0131"
        rx="3.9753"
        stroke="var(--color-fd-primary)"
        strokeWidth="1.4244"
      ></rect>
      <defs>
        <clipPath id={clipId}>
          <rect
            y="0.90625"
            width="22.7813"
            height="29.4375"
            rx="4.6875"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Logo />
        Fumadocs/BaseHub
      </>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
    {
      text: "Fumadocs",
      url: "https://fumadocs.vercel.app",
      external: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      ),
    },
  ],
};
