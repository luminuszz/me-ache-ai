import { FoundItemCard } from "@/components/found-item-card";
import { db } from "@/database/db";
import { foundItems } from "@/database/schema";
import { env } from "@/lib/env";
import { desc } from "drizzle-orm";

export default async function ListFoundItensPage() {
  const results = await db.query.foundItems.findMany({
    orderBy: [desc(foundItems.created_at)],
    with: {
      images: true,
    },
  });

  const foundItemsList = results.map((item) => ({
    ...item,
    imageUrl: `${env.CLOUD_FLARE_BUCKET_PUBLIC_URL}/${item.images[0]?.fileKey}`,
  }));

  console.log(foundItemsList[0].imageUrl);

  return (
    <section className="grid grid-cols-3 gap-4 mb-10">
      {foundItemsList.map((item) => {
        return (
          <FoundItemCard
            key={item.id}
            lostItem={{
              createdAt: item.created_at,
              description: item.description,
              imageUrl: item.imageUrl,
              locationFound: item.locationDescription,
              name: item.name,
            }}
          />
        );
      })}
    </section>
  );
}
