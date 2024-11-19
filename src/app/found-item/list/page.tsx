import { FoundItemCard } from "@/app/found-item/components/found-item-card";
import { db } from "@/database/db";
import { foundItems } from "@/database/schema";
import { env } from "@/lib/env";
import { count, desc } from "drizzle-orm";
import { FoundItemPagination } from "../components/found-list-pagination";

interface ListItensPageParams {
  page: number;
  pageSize: number;
}

interface ListFoundItensPageProps {
  searchParams: ListItensPageParams;
}

export default async function ListFoundItensPage({ searchParams }: ListFoundItensPageProps) {
  const { page = 1, pageSize = 10 } = searchParams;

  const results = await db.query.foundItems.findMany({
    orderBy: [desc(foundItems.created_at)],
    with: {
      images: true,
    },
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  const [{ count: totalOfRows }] = await db.select({ count: count() }).from(foundItems);

  const totalPages = Math.ceil(totalOfRows / pageSize);

  const foundItemsList = results.map((item) => ({
    ...item,
    imageUrl: `${env.CLOUD_FLARE_BUCKET_PUBLIC_URL}/${item.images[0]?.fileKey}`,
  }));

  return (
    <>
      <section className="grid grid-cols-4 gap-4 mb-10">
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
      <div className="flex justify-center mb-10">
        <FoundItemPagination totalPages={totalPages} currentPage={page} />
      </div>
    </>
  );
}
