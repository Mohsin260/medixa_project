'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CircleAlert,
  Copy,
  ExternalLink,
  Grid,
  Image as ImageIcon,
  List,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminFullPage } from '@/components/admin/admin-full-page';

export interface AdminMedia {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  altText: string;
  createdAt: string;
}

export function MediaManager({
  onNotify,
  canDelete = true,
  onToggleSidebar,
}: {
  onNotify?: (msg: string) => void;
  canDelete?: boolean;
  onToggleSidebar?: () => void;
}) {
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
    if (!canDelete) {
      onNotify?.('Only administrators can delete media assets.');
      return;
    }
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

  if (previewMedia) {
    return (
      <AdminFullPage
        title={previewMedia.filename}
        subtitle="Media asset preview"
        icon={<ImageIcon size={20} />}
        onClose={() => setPreviewMedia(null)}
        onToggleSidebar={onToggleSidebar}
        backLabel="Back to media"
      >
        <div className="overflow-hidden rounded-2xl border border-[#dde5ec] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
          <div className="flex items-center justify-center bg-[#0f1728] p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewMedia.url}
              alt={previewMedia.filename}
              className="max-h-[60vh] object-contain"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#edf1f5] p-4 text-xs">
            <div className="min-w-0 max-w-full truncate font-mono text-[11px] text-[#7c8996]">
              {previewMedia.key}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(previewMedia.url, '_blank', 'noopener,noreferrer')}
                className="border-[#dde5ec] text-[#556572]"
              >
                <ExternalLink size={14} />
                <span>Open original</span>
              </Button>
              <Button
                size="sm"
                onClick={() => handleCopy(previewMedia.url, previewMedia.id)}
                className="bg-[#052263] text-white hover:bg-[#031849]"
              >
                <Copy size={14} />
                <span>Copy URL</span>
              </Button>
            </div>
          </div>
        </div>
      </AdminFullPage>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Dropzone Card */}      <div
        className="rounded-2xl border-2 border-dashed border-[#cfd6e7] bg-white p-8 text-center transition hover:border-[#052263] hover:bg-[#fafcfd]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#e9ecf4] text-[#052263]">
          {uploading ? <Loader2 size={26} className="animate-spin" /> : <UploadCloud size={26} />}
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#131b2e]">
          {uploading ? 'Uploading assets to S3 object storage…' : 'Drag & drop image files to upload'}
        </h3>
        <p className="mt-1 text-xs text-[#7e8a96]">
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
            className="bg-[#052263] text-white hover:bg-[#031849] shadow-sm"
          >
            <Plus size={16} />
            <span>Select files from computer</span>
          </Button>
        </div>
      </div>

      {/* Media Library View */}
      <div className="rounded-2xl border border-[#e7ecf0] bg-white shadow-[0_4px_18px_rgba(19,27,46,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1f5] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#939fa9]">
              Storage / Assets
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#131b2e]">Media Asset Library</h2>
            <p className="mt-1 text-xs text-[#7e8a96]">
              Direct S3-compatible cloud storage linked to product models and articles.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMedia}
              disabled={loading}
              className="border-[#dee7ee] text-[#556572]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex rounded-lg border border-[#dee7ee] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'rounded p-1 text-xs',
                  viewMode === 'grid' ? 'bg-[#e9ecf4] text-[#052263]' : 'text-[#8794a1]',
                )}
                aria-label="Grid view"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded p-1 text-xs',
                  viewMode === 'list' ? 'bg-[#e9ecf4] text-[#052263]' : 'text-[#8794a1]',
                )}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="border-b border-[#edf1f5] p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-[#99a5af]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets by filename or key…"
              className="h-9 w-full rounded-lg border border-[#dee7ee] bg-[#fbfcfd] pl-9 pr-3 text-xs outline-none ring-[#bcc7de] placeholder:text-[#a9b4be] focus:ring-2"
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
            <Loader2 size={24} className="mx-auto animate-spin text-[#052263]" />
            <span className="mt-2 block text-xs text-[#7c8996]">Loading media files…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8b98a4]">
            No media assets found in cloud storage. Upload one above!
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#e2e9ef] bg-[#fafcfd] transition hover:border-[#052263] hover:shadow-md"
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
                  <p className="font-semibold text-[#1e283a] truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-[#85929f] font-mono truncate">{item.mimeType}</p>

                  <div className="mt-2 flex items-center justify-between border-t border-[#edf1f5] pt-1.5">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#052263] hover:underline"
                    >
                      {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    {canDelete ? (
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-[#99a5af] hover:text-rose-600"
                        title="Delete asset"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-[#edf1f5] text-[10px] uppercase tracking-[0.12em] text-[#99a5af]">
                  <th className="px-5 py-3 font-semibold">Asset</th>
                  <th className="py-3 font-semibold">Key / Path</th>
                  <th className="py-3 font-semibold">Type</th>
                  <th className="py-3 font-semibold">Uploaded</th>
                  <th className="pr-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-[#f1f4f7] last:border-0 hover:bg-[#fafbfb]">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-lg border border-[#e1e8ee]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt="" className="size-full object-cover" />
                        </div>
                        <span className="text-xs font-semibold text-[#202a3c]">{item.filename}</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-[#7c8996] truncate max-w-xs">{item.key}</td>
                    <td className="py-3 text-xs text-[#52626f]">{item.mimeType}</td>
                    <td className="py-3 text-[11px] text-[#7f8b97]">
                      {new Date(item.createdAt).toLocaleDateString('en-US')}
                    </td>
                    <td className="pr-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleCopy(item.url, item.id)}
                          className="rounded-lg p-1 text-[#556371] hover:bg-[#eef1f7]"
                          title="Copy Link"
                        >
                          {copiedId === item.id ? <Check size={15} /> : <Copy size={15} />}
                        </button>
                        {canDelete ? (
                          <button
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-1 text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[#edf1f5] p-4 text-xs text-[#7e8a96]">
          <span>
            Showing {filtered.length} of {mediaList.length} media assets
          </span>
          <span className="text-[11px] text-[#99a5af]">S3 Lakebase Storage</span>
        </div>
      </div>
    </div>
  );
}

