'use client';

import { createRealtimeClient, type SealedLiveQuery } from '@neon/realtime/client';
import { RealtimeProvider, useLiveQuery } from '@neon/realtime-react';
import { useCallback, useEffect, useState } from 'react';

type InventoryRow = {
  id: string;
  title: string;
  slug: string;
  total_inventory: string | number;
};

const NO_ROWS: readonly InventoryRow[] = [];

function useSealedInventory() {
  const [sealed, setSealed] = useState<SealedLiveQuery<InventoryRow> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refreshQuery = useCallback(async () => {
    const res = await fetch('/api/realtime/inventory', { method: 'POST' });
    if (!res.ok) {
      throw new Error('Failed to refresh inventory query');
    }
    return (await res.json()) as SealedLiveQuery<InventoryRow>;
  }, []);

  useEffect(() => {
    let cancelled = false;
    refreshQuery()
      .then((s) => {
        if (!cancelled) setSealed(s);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Live inventory unavailable');
      });
    return () => {
      cancelled = true;
    };
  }, [refreshQuery]);

  return { sealed, error, refreshQuery };
}

function InventoryTable({ sealed, refreshQuery }: { sealed: SealedLiveQuery<InventoryRow>; refreshQuery: () => Promise<SealedLiveQuery<InventoryRow>> }) {
  const { data, status, error } = useLiveQuery(sealed, { refreshQuery });
  const rows = data ?? NO_ROWS;

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Live inventory</h2>
          <p className="text-xs text-gray-500">Streams from Neon Realtime</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
            status === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${status === 'error' ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}
          />
          {status === 'error' || status === 'closed' ? 'Disconnected' : status === 'live' ? 'Live' : 'Connecting…'}
        </span>
      </div>

      {status === 'error' ? (
        <p className="px-4 py-6 text-sm text-red-600" role="alert">
          {error instanceof Error ? error.message : 'Live updates stopped'}
        </p>
      ) : rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-gray-500">No active products</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-gray-400 bg-gray-50">
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-2.5 text-gray-800">{row.title}</td>
                <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">
                  {String(row.total_inventory)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function LiveInventory() {
  const { sealed, error, refreshQuery } = useSealedInventory();
  const realtimeUrl = process.env.NEXT_PUBLIC_NEON_REALTIME_URL;

  const [client, setClient] = useState<ReturnType<typeof createRealtimeClient> | null>(null);

  useEffect(() => {
    if (!realtimeUrl) return;
    queueMicrotask(() => setClient(createRealtimeClient({ url: realtimeUrl })));
  }, [realtimeUrl]);

  if (error || !realtimeUrl || !client) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
        {error ?? (realtimeUrl ? 'Connecting…' : 'NEXT_PUBLIC_NEON_REALTIME_URL is not set')}
      </div>
    );
  }

  if (!sealed) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-6 text-sm text-gray-500">
        Loading live inventory…
      </div>
    );
  }

  return (
    <RealtimeProvider client={client}>
      <InventoryTable sealed={sealed} refreshQuery={refreshQuery} />
    </RealtimeProvider>
  );
}
