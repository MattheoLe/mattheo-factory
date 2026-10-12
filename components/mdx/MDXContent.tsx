import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "./components";

type MDXModule = { default: React.ComponentType<{ components?: typeof mdxComponents }> };

/** Velite compiles MDX to a function body; evaluate it with the JSX runtime. */
function getMDXComponent(code: string) {
  const factory = new Function(code) as (scope: typeof runtime) => MDXModule;
  return factory({ ...runtime }).default;
}

export function MDXContent({ code }: { code: string }) {
  const Content = getMDXComponent(code);
  // eslint-disable-next-line react-hooks/static-components -- compiled MDX is evaluated once per server render
  return <Content components={mdxComponents} />;
}
