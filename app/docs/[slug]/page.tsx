import type { RichTextNode, RichTextTocNode } from "basehub/api-transaction";
import { RichText } from "@/components/rich-text";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { basehub } from "basehub";
import type { TOCItemType } from "fumadocs-core/server";
import { Pump } from "basehub/react-pump";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  return (
    <Pump
      queries={[
        {
          documentation: {
            __args: { filter: { slug: { eq: params.slug } } },
            item: {
              richText: {
                json: {
                  content: true,
                  toc: true,
                },
              },
              _title: true,
            },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const page = documentation.item;
        if (!page) notFound();

        return (
          <DocsPage
            toc={page.richText ? parseToc(page.richText.json.toc[0]) : []}
          >
            <DocsTitle>{page._title}</DocsTitle>
            <DocsBody className="text-sm">
              <RichText content={page.richText?.json.content} />
            </DocsBody>
          </DocsPage>
        );
      }}
    </Pump>
  );
}

function parseToc(list: RichTextTocNode, level = 0): TOCItemType[] {
  const results: TOCItemType[] = [];
  if (list.type === "text") return [];

  for (const item of list.content ?? []) {
    if (item.type === "orderedList" || item.type === "listItem") {
      results.push(...parseToc(item, level + 1));
      continue;
    }

    if (item.type !== "paragraph" || !item.content) continue;

    const nodes = findTextNode(item.content[0]);

    for (const node of nodes) {
      const mark = findLinkMark(node);
      if (!mark) continue;

      results.push({
        depth: level + 1,
        url: mark.href,
        title: (
          <RichText
            content={[node as RichTextNode]}
            // @ts-expect-error -- jsx
            components={{
              a: (props) => <span {...props} />,
            }}
          />
        ),
      });
    }
  }

  return results;
}

function findTextNode(
  n: RichTextTocNode
): Extract<RichTextTocNode, { type: "text" }>[] {
  if (n.type === "text") {
    return [n];
  }

  return n.content?.flatMap(findTextNode) ?? [];
}

function findLinkMark(n: RichTextTocNode):
  | {
      href: string;
    }
  | undefined {
  if (n.type === "text") {
    const mark = n.marks?.find((m) => m.type === "link");

    if (mark) {
      return {
        href: mark.attrs.href,
      };
    }

    return;
  }

  for (const c of n.content ?? []) {
    const result = findLinkMark(c);
    if (result) return result;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { documentation } = await basehub().query({
    documentation: {
      __args: {
        filter: {
          slug: {
            eq: params.slug,
          },
        },
        first: 1,
      },
      items: {
        _title: true,
        category: true,
      },
    },
  });
  const page = documentation.items.at(0);
  if (!page) notFound();

  return {
    title: page._title,
    description: page.category,
  };
}

export async function generateStaticParams() {
  const { documentation } = await basehub().query({
    documentation: {
      items: {
        slug: true,
      },
    },
  });

  return documentation.items
    .filter((item) => Boolean(item.slug))
    .map((item) => ({
      slug: item.slug,
    }));
}
