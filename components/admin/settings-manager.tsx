'use client';

import { useEffect, useState } from 'react';
import {
  Banknote,
  Building,
  CircleAlert,
  Loader2,
  Save,
  Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SettingsManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [storeName, setStoreName] = useState('Medixa Pakistan');
  const [tagline, setTagline] = useState('Precision-engineered medical apparel for healthcare professionals who demand excellence in medical scrubs across Pakistan.');
  const [supportEmail, setSupportEmail] = useState('info@medixa.pk');
  const [supportPhone, setSupportPhone] = useState('+92 343 511 4065');
  const [whatsapp, setWhatsapp] = useState('+92 343 511 4065');
  const [address, setAddress] = useState('Karachi & Lahore, Pakistan');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/medixa.pk');
  const [facebookUrl, setFacebookUrl] = useState('https://facebook.com/medixa.pk');

  const [deliveryFee, setDeliveryFee] = useState('250');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('10000');
  const [deliveryDays, setDeliveryDays] = useState('3-5 Working Days');

  const [codEnabled, setCodEnabled] = useState(true);
  const [jazzcashEnabled, setJazzcashEnabled] = useState(true);
  const [easypaisaEnabled, setEasypaisaEnabled] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/settings')
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: { settings?: Record<string, unknown> }) => {
        if (!ignore && data.settings) {
          const s = data.settings;
          if (s.storeName) setStoreName(String(s.storeName));
          if (s.tagline) setTagline(String(s.tagline));
          if (s.supportEmail) setSupportEmail(String(s.supportEmail));
          if (s.supportPhone) setSupportPhone(String(s.supportPhone));
          if (s.whatsapp) setWhatsapp(String(s.whatsapp));
          if (s.address) setAddress(String(s.address));
          if (s.instagramUrl) setInstagramUrl(String(s.instagramUrl));
          if (s.facebookUrl) setFacebookUrl(String(s.facebookUrl));
          if (s.standardDeliveryFee !== undefined) setDeliveryFee(String(s.standardDeliveryFee));
          if (s.freeShippingThreshold !== undefined) setFreeShippingThreshold(String(s.freeShippingThreshold));
          if (s.estimatedDeliveryDays) setDeliveryDays(String(s.estimatedDeliveryDays));
          if (s.codEnabled !== undefined) setCodEnabled(Boolean(s.codEnabled));
          if (s.jazzcashEnabled !== undefined) setJazzcashEnabled(Boolean(s.jazzcashEnabled));
          if (s.easypaisaEnabled !== undefined) setEasypaisaEnabled(Boolean(s.easypaisaEnabled));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error loading settings');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        storeName,
        tagline,
        supportEmail,
        supportPhone,
        whatsapp,
        address,
        instagramUrl,
        facebookUrl,
        standardDeliveryFee: Number(deliveryFee),
        freeShippingThreshold: Number(freeShippingThreshold),
        estimatedDeliveryDays: deliveryDays,
        codEnabled,
        jazzcashEnabled,
        easypaisaEnabled,
      };

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      onNotify?.('Store settings updated successfully.');
    } catch {
      setError('Error saving settings. Check network connection.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e7ecf0] bg-white p-12 text-center shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <Loader2 size={24} className="mx-auto animate-spin text-[#052263]" />
        <span className="mt-2 block text-xs text-[#7c8996]">Loading store configuration…</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* General Store Details */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white p-6 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1f5]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
            <Building size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#131b2e]">General Storefront Information</h3>
            <p className="text-xs text-[#7f8b97]">Branding, support channels and business metadata</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Store Display Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Contact Phone</label>
            <input
              type="tel"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">WhatsApp Orders Number</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Store Hub / Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Karachi & Lahore, Pakistan"
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Instagram Profile URL</label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/medixa.pk"
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Facebook Page URL</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/medixa.pk"
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-[#293447] mb-1.5">Store Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>
        </div>
      </div>

      {/* Shipping & Delivery */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white p-6 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1f5]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
            <Truck size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#131b2e]">Shipping & Nationwide Logistics</h3>
            <p className="text-xs text-[#7f8b97]">Delivery rates, transit expectations, and thresholds</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 text-xs">
          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Standard Delivery Fee (PKR)</label>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Free Shipping Over (PKR)</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#293447] mb-1.5">Estimated Delivery Window</label>
            <input
              type="text"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#dbe4eb] bg-[#fafcfd] px-3 text-[#1d2739] outline-none focus:ring-2 focus:ring-[#052263]/15"
            />
          </div>
        </div>
      </div>

      {/* Payment Gateways */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white p-6 shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        <div className="flex items-center gap-3 pb-4 border-b border-[#edf1f5]">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#e9ecf4] text-[#052263]">
            <Banknote size={20} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#131b2e]">Payment Gateways & Options</h3>
            <p className="text-xs text-[#7f8b97]">Enable payment methods visible on customer checkout</p>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-xs">
          <label className="flex items-center justify-between rounded-xl border border-[#e5ebf1] p-3.5 cursor-pointer hover:bg-[#fafcfd]">
            <div>
              <p className="font-semibold text-[#202a3c]">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-[#788694]">Pay with cash upon nationwide delivery across Pakistan.</p>
            </div>
            <input
              type="checkbox"
              checked={codEnabled}
              onChange={(e) => setCodEnabled(e.target.checked)}
              className="size-4 accent-[#052263]"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-[#e5ebf1] p-3.5 cursor-pointer hover:bg-[#fafcfd]">
            <div>
              <p className="font-semibold text-[#202a3c]">JazzCash Gateway</p>
              <p className="text-[11px] text-[#788694]">Accept JazzCash mobile wallets and debit/credit cards.</p>
            </div>
            <input
              type="checkbox"
              checked={jazzcashEnabled}
              onChange={(e) => setJazzcashEnabled(e.target.checked)}
              className="size-4 accent-[#052263]"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border border-[#e5ebf1] p-3.5 cursor-pointer hover:bg-[#fafcfd]">
            <div>
              <p className="font-semibold text-[#202a3c]">EasyPaisa Payment Gateway</p>
              <p className="text-[11px] text-[#788694]">Allow direct checkout with EasyPaisa accounts.</p>
            </div>
            <input
              type="checkbox"
              checked={easypaisaEnabled}
              onChange={(e) => setEasypaisaEnabled(e.target.checked)}
              className="size-4 accent-[#052263]"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <CircleAlert size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-[#052263] text-white hover:bg-[#031849] shadow-sm px-6 h-11"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Saving settings…</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save store settings</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
