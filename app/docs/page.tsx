import { Pump } from "basehub/react-pump";
import { RichText } from "basehub/react-rich-text";
import { Card, Cards } from "fumadocs-ui/components/card";
import { DocsBody, DocsPage, DocsTitle } from "fumadocs-ui/page";

export default async function Page() {
  return (
    <Pump
      queries={[
        {
          documentation: {
            items: {
              _slug: true,
              _title: true,
              richText: {
                json: {
                  content: true,
                },
              },
            },
          },
        },
      ]}
    >
      {async ([{ documentation }]) => {
        "use server";

        const [home, ...items] = documentation.items;

        return (
          <DocsPage>
            <DocsTitle>Introduction</DocsTitle>
            <DocsBody className="text-sm">
              <RichText content={home.richText?.json.content} />
              <Cards>
                {items.map((item) => (
                  <Card
                    key={item._slug}
                    href={`/docs/${item._slug}`}
                    title={item._title}
                  />
                ))}
              </Cards>
            </DocsBody>
          </DocsPage>
        );
      }}
    </Pump>
  );
}
