import { createRealtime, rawSql } from '@neon/realtime/server';

type InventoryRow = {
  id: string;
  title: string;
  slug: string;
  total_inventory: string | number;
};

let realtimeServer: ReturnType<typeof createRealtime<ReturnType<typeof inventoryQuery>>> | null = null;

function inventoryQuery() {
  return rawSql<InventoryRow>(`
    SELECT p.id, p.title, p.slug, COALESCE(SUM(v.inventory), 0)::text AS total_inventory
    FROM "Product" p
    LEFT JOIN "ProductVariant" v ON v."productId" = p.id AND v."isActive" = true
    WHERE p.status = 'ACTIVE'
    GROUP BY p.id, p.title, p.slug
    ORDER BY p.title ASC
    LIMIT 50
  `);
}

export function getRealtimeServer() {
  if (!realtimeServer) {
    realtimeServer = createRealtime({
      secret: process.env.NEON_REALTIME_SECRET!,
      db: 'neondb',
      debugMode: process.env.NODE_ENV !== 'production',
    });
  }
  return realtimeServer;
}

export async function sealInventoryQuery() {
  const server = getRealtimeServer();
  return server.seal({ query: inventoryQuery() });
}

export type { InventoryRow };
