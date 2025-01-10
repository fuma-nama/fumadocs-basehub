import { RichTextNode, RichTextTocNode } from "basehub/api-transaction";
import { RichText } from "@/components/rich-text";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { basehub } from "basehub";
import { TOCItemType } from "fumadocs-core/server";
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

function parseToc(list: RichTextTocNode): TOCItemType[] {
  if (!list.content || !Array.isArray(list.content)) {
    return [];
  }

  const results: TOCItemType[] = [];

  for (const item of list.content) {
    if (item.type === "orderedList" || item.type === "listItem") {
      results.push(...parseToc(item));
      continue;
    }

    if (!item.content?.length) continue;

    const textNodes = findTextNode(item.content[0]);

    for (const node of textNodes) {
      const linkInfo = findLinkMark(node);
      if (!linkInfo) continue;

      results.push({
        depth: 1,
        url: linkInfo.href,
        title: (
          <RichText
            content={[node as RichTextNode]}
            // @ts-expect-error -- jsx
            components={{
              a: (props) => {
                return <a {...props} />;
              },
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

function findLinkMark(
  n: RichTextTocNode
): { href: string; target?: string } | undefined {
  if (n.type === "text") {
    const mark = n.marks?.find((m) => m.type === "link");

    if (mark?.attrs?.href) {
      return {
        href: mark.attrs.href,
      };
    }
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
