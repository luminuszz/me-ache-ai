import { env } from "@/lib/env";
import { Pool } from "@neondatabase/serverless";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";

import * as schema from "./schema";

import { drizzle, NeonQueryResultHKT } from "drizzle-orm/neon-serverless";

export const db = drizzle({
  schema,
  connection: env.DATABASE_URL,
});

type TransactionType = PgTransaction<NeonQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export const createDbTransaction = async <TransactionResponse>(call: (context: TransactionType) => Promise<TransactionResponse>) => {
  const connectionPool = new Pool({ connectionString: env.DATABASE_URL });

  const currentDbConnection = drizzle({
    schema,
    client: connectionPool,
  });

  const results = await currentDbConnection.transaction(async (tx) => {
    return call(tx);
  });

  await connectionPool.end();

  return results;
};
