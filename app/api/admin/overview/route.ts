import { NextResponse } from 'next/server';
import { requireStaff } from '@/lib/auth/require-admin';
import { db } from '@/lib/db';

export async function GET() {
  const authCheck = await requireStaff();
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const [
      totalProducts,
      publishedBlogs,
      mediaAssets,
      totalOrders,
      ordersAggregate,
      recentOrders,
      neonUsers,
    ] = await Promise.all([
      db.product.count(),
      db.post.count({ where: { status: 'PUBLISHED' } }),
      db.media.count(),
      db.order.count(),
      db.order.aggregate({
        where: { status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          shipFullName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),
      db.$queryRaw<Array<{ count: bigint }>>`SELECT COUNT(*) as count FROM neon_auth."user"`,
    ]);

    const userCount = Number(neonUsers[0]?.count || 0);
    const grossSales = Number(ordersAggregate._sum.total || 0);

    return NextResponse.json({
      metrics: {
        totalProducts,
        publishedBlogs,
        mediaAssets,
        totalCustomers: userCount,
        totalOrders,
        grossSales,
      },
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.shipFullName,
        total: Number(o.total),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error('Failed to get overview metrics:', err);
    return NextResponse.json({ error: 'Failed to retrieve overview' }, { status: 500 });
  }
}
