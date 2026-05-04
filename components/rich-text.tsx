import { RichText as Primitive } from "basehub/react-rich-text";
import { ServerCodeBlock } from "fumadocs-ui/components/codeblock.rsc";
import { ComponentProps, useMemo } from "react";

const components = {
  pre(props) {
    return <ServerCodeBlock lang={props.language} code={props.code} />;
  },
} as ComponentProps<typeof Primitive>["components"];

export function RichText(props: ComponentProps<typeof Primitive>) {
  return (
    <Primitive
      {...props}
      components={useMemo(
        () => ({ ...components, ...props.components }),
        [props.components],
      )}
    />
  );
}
