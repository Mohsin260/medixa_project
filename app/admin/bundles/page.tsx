import type { Metadata } from 'next';
import { BundleOfferManager } from '@/components/admin/bundle-offer-form';

export const instant = false;

export const metadata: Metadata = {
  title: 'Bundles | Medixa Admin Studio',
  description: 'Manage native product bundles and quantity-break discounts.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBundlesPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] p-5 sm:p-8">
      <BundleOfferManager />
    </main>
  );
}
