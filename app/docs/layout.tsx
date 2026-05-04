import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { Pump } from "basehub/react-pump";
import type * as PageTree from "fumadocs-core/page-tree";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <Pump
      queries={[
        {
          documentation: {
            items: { _slug: true, _title: true, category: true },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const items: PageTree.Node[] = [];

        for (const item of documentation.items) {
          let idx = items.length;

          if (item.category && item.category !== "Root") {
            idx = items.findIndex((parent) => parent.name === item.category);

            if (idx === -1) {
              items.push({
                type: "separator",
                name: item.category,
              });

              idx = items.length;
            }
          }

          items.splice(idx, 0, {
            type: "page",
            name: item._title,
            url: item._slug === "index" ? "/docs" : `/docs/${item._slug}`,
          });
        }

        return (
          <DocsLayout
            tree={{
              name: "Docs",
              children: items,
            }}
            {...baseOptions}
          >
            {children}
          </DocsLayout>
        );
      }}
    </Pump>
  );
}
