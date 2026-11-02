'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CircleAlert,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Grid,
  Image as ImageIcon,
  List,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminMedia {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  altText: string;
  createdAt: string;
}

export function MediaManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [mediaList, setMediaList] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<AdminMedia | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/media');
      if (!res.ok) throw new Error('Failed to load media');
      const data = await res.json();
      setMediaList(data.media || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/media')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load media');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setMediaList(data.media || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching media');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return mediaList.filter((m) => {
      return (
        m.filename.toLowerCase().includes(query.toLowerCase()) ||
        m.altText.toLowerCase().includes(query.toLowerCase()) ||
        m.key.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [mediaList, query]);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload ${file.name}`);
        }
      }
      onNotify?.(`${files.length} asset(s) uploaded successfully.`);
      fetchMedia();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(item: AdminMedia) {
    if (!window.confirm(`Delete "${item.filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete media asset');
      onNotify?.(`Asset "${item.filename}" deleted.`);
      fetchMedia();
      if (previewMedia?.id === item.id) setPreviewMedia(null);
    } catch {
      alert('Error deleting asset');
    }
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onNotify?.('Image link copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Upload Dropzone Card */}
      <div
        className="rounded-2xl border-2 border-dashed border-[#cbe0d5] bg-white p-8 text-center transition hover:border-[#1f6b52] hover:bg-[#fafcfb]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#eaf4ef] text-[#1f6b52]">
          {uploading ? <Loader2 size={26} className="animate-spin" /> : <UploadCloud size={26} />}
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#173c35]">
          {uploading ? 'Uploading assets to S3 object storage…' : 'Drag & drop image files to upload'}
        </h3>
        <p className="mt-1 text-xs text-[#81918a]">
          Supports WebP, PNG, JPG, AVIF up to 10MB each. Direct link auto-generated.
        </p>

        <div className="mt-5 flex items-center justify-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[#1f6b52] text-white hover:bg-[#185540] shadow-sm"
          >
            <Plus size={16} />
            <span>Select files from computer</span>
          </Button>
        </div>
      </div>

      {/* Media Library View */}
      <div className="rounded-2xl border border-[#e6ebe8] bg-white shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">
              Storage / Assets
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173c35]">Media Asset Library</h2>
            <p className="mt-1 text-xs text-[#81918a]">
              Direct S3-compatible cloud storage linked to product models and articles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMedia}
              disabled={loading}
              className="border-[#dfe8e3] text-[#557067]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex rounded-lg border border-[#dfe8e3] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded p-1 text-xs',
                  viewMode === 'grid' ? 'bg-[#e8f3ee] text-[#1f6b52]' : 'text-[#889b94]',
                )}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded p-1 text-xs',
                  viewMode === 'list' ? 'bg-[#e8f3ee] text-[#1f6b52]' : 'text-[#889b94]',
                )}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="border-b border-[#edf1ee] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#9aa7a1]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets by filename or key…"
              className="h-9 w-full rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none ring-[#b9d9ca] placeholder:text-[#aab5b0] focus:ring-2"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-[#1f6b52]" />
            <span className="mt-2 block text-xs text-[#7d9089]">Loading media files…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8c9e97]">
            No media assets found in cloud storage. Upload one above!
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e2eae5] bg-[#fafcfb] transition hover:border-[#1f6b52] hover:shadow-md"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => setPreviewMedia(item)}
                  className="aspect-square w-full cursor-pointer overflow-hidden bg-[#f0f4f2]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="size-full object-cover transition group-hover:scale-105"
                  />
                </div>

                {/* Info & quick actions */}
                <div className="p-2.5 text-xs">
                  <p className="font-semibold text-[#1f473c] truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-[#869791] font-mono truncate">{item.mimeType}</p>

                  <div className="mt-2 flex items-center justify-between border-t border-[#edf2ef] pt-1.5">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#1f6b52] hover:underline"
                    >
                      {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="text-[#9aa7a1] hover:text-rose-600"
                      title="Delete asset"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-[#edf1ee] text-[10px] uppercase tracking-[0.12em] text-[#9aa7a1]">
                  <th className="px-5 py-3 font-semibold">Asset</th>
                  <th className="py-3 font-semibold">Key / Path</th>
                  <th className="py-3 font-semibold">Type</th>
                  <th className="py-3 font-semibold">Uploaded</th>
                  <th className="pr-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#f1f4f2] last:border-0 hover:bg-[#fafbfb]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-lg border border-[#e1e9e4]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt="" className="size-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-[#21433a]">{item.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-[#7d9089] truncate max-w-xs">{item.key}</td>
                    <td className="py-3 text-xs text-[#526f65]">{item.mimeType}</td>
                    <td className="py-3 text-[11px] text-[#80918a]">
                      {new Date(item.createdAt).toLocaleDateString('en-US')}
                    </td>
                    <td className="pr-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopy(item.url, item.id)}
                          className="rounded-lg p-1 text-[#556e66] hover:bg-[#edf4f0]"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg p-1 text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#edf1ee] p-4 text-xs text-[#81918a]">
          <span>
            Showing {filtered.length} of {mediaList.length} media assets
          </span>
          <span className="text-[11px] text-[#9aa8a1]">S3 Lakebase Storage</span>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#143d36]/50 backdrop-blur-sm" onClick={() => setPreviewMedia(null)} />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#edf2ef] p-4">
              <span className="font-semibold text-xs text-[#1e423a] truncate">{previewMedia.filename}</span>
              <button
                onClick={() => setPreviewMedia(null)}
                className="rounded-lg p-1 text-[#889a93] hover:bg-[#f2f6f4]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-auto bg-[#0f1d19] p-2 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewMedia.url} alt={previewMedia.filename} className="max-h-[55vh] object-contain" />
            </div>
            <div className="flex items-center justify-between p-4 text-xs">
              <div className="font-mono text-[11px] text-[#7d9089] truncate max-w-sm">{previewMedia.key}</div>
              <Button
                size="sm"
                onClick={() => handleCopy(previewMedia.url, previewMedia.id)}
                className="bg-[#1f6b52] text-white hover:bg-[#185540]"
              >
                <Copy size={14} />
                <span>Copy URL</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

