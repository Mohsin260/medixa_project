'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpenText,
  Calendar,
  CircleAlert,
  Edit3,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorName: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: string | null;
  createdAt: string;
}

export function BlogsManager({ onNotify }: { onNotify?: (msg: string) => void }) {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/blogs');
      if (!res.ok) throw new Error('Failed to load blog posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/admin/blogs')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blogs');
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setPosts(data.posts || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Error fetching blogs');
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.slug.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [posts, query, statusFilter]);

  async function handleDelete(post: AdminPost) {
    if (!window.confirm(`Delete post "${post.title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      onNotify?.(`Post "${post.title}" deleted.`);
      fetchPosts();
    } catch {
      alert('Error deleting post');
    } finally {
      setActiveMenuId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Table Card */}
      <div className="rounded-2xl border border-[#e6ebe8] bg-white shadow-[0_4px_18px_rgba(20,61,54,0.04)]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#edf1ee] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#94a29c]">
              Content / Journal
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173c35]">Blog & Articles</h2>
            <p className="mt-1 text-xs text-[#81918a]">
              Publish healthcare guides, fabric technology stories, and storefront announcements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPosts}
              disabled={loading}
              className="border-[#dfe8e3] text-[#557067]"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#1f6b52] text-white hover:bg-[#185540] shadow-sm"
            >
              <Plus size={16} />
              <span>Write article</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-[#edf1ee] p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-[#9aa7a1]" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts by title or keyword…"
              className="h-9 w-full rounded-lg border border-[#dfe8e3] bg-[#fbfcfb] pl-9 pr-3 text-xs outline-none ring-[#b9d9ca] placeholder:text-[#aab5b0] focus:ring-2"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['ALL', 'PUBLISHED', 'DRAFT'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  statusFilter === st ? 'bg-[#e8f3ee] text-[#22674e]' : 'text-[#73857e] hover:bg-[#f3f6f4]',
                )}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
            <CircleAlert size={16} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left">
            <thead>
              <tr className="border-b border-[#edf1ee] text-[10px] uppercase tracking-[0.12em] text-[#9aa7a1]">
                <th className="px-5 py-3 font-semibold">Article Title</th>
                <th className="py-3 font-semibold">Author</th>
                <th className="py-3 font-semibold">Tags</th>
                <th className="py-3 font-semibold">Status</th>
                <th className="py-3 font-semibold">Date</th>
                <th className="pr-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-[#7d9089]">
                      <Loader2 size={24} className="animate-spin text-[#1f6b52]" />
                      <span>Loading articles…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#8c9e97]">
                    No articles found. Click &ldquo;Write article&rdquo; to publish your first post!
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f4f2] last:border-0 hover:bg-[#fafbfb]">
                    {/* Title */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col max-w-sm">
                        <span className="text-xs font-semibold text-[#1e423a] line-clamp-1">{p.title}</span>
                        <span className="text-[11px] text-[#7d9089] font-mono line-clamp-1">/{p.slug}</span>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 text-xs text-[#526f65]">
                      <span className="font-medium text-[#23473d]">{p.authorName}</span>
                    </td>

                    {/* Tags */}
                    <td className="py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 2).map((t) => (
                          <span key={t} className="rounded-md bg-[#f3f6f5] px-2 py-0.5 text-[10px] text-[#556e66]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold',
                          p.status === 'PUBLISHED'
                            ? 'bg-[#eaf7f0] text-[#1b7a54]'
                            : 'bg-[#fff5e5] text-[#b87823]',
                        )}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 text-[11px] text-[#80918a]">
                      {new Date(p.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="pr-5 py-3.5 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="rounded-lg p-1 text-[#81918a] hover:bg-[#f1f5f3] hover:text-[#21433a]"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {activeMenuId === p.id && (
                          <div className="absolute right-5 z-20 mt-1 w-36 rounded-xl border border-[#dfe7e2] bg-white p-1 shadow-lg">
                            <button
                              onClick={() => {
                                setEditingPost(p);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-[#2d5248] hover:bg-[#f4f7f5]"
                            >
                              <Edit3 size={14} className="text-[#1f6b52]" />
                              Edit post
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#edf1ee] p-4 text-xs text-[#81918a]">
          <span>
            Showing {filtered.length} of {posts.length} articles
          </span>
          <span className="text-[11px] text-[#9aa8a1]">Storefront FeaturePost Integration Live</span>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingPost) && (
        <BlogFormModal
          post={editingPost}
          isOpen={showAddModal || Boolean(editingPost)}
          onClose={() => {
            setShowAddModal(false);
            setEditingPost(null);
          }}
          onSuccess={(msg) => {
            fetchPosts();
            onNotify?.(msg);
          }}
        />
      )}
    </div>
  );
}

function BlogFormModal({
  post,
  isOpen,
  onClose,
  onSuccess,
}: {
  post: AdminPost | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}) {
  const isEdit = Boolean(post);
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [body, setBody] = useState(post?.body || '');
  const [tags, setTags] = useState(post ? post.tags.join(', ') : 'Medical, Scrubs, Karachi');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>(
    post?.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/blogs/${post!.id}` : '/api/admin/blogs';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          body,
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save blog post');
        return;
      }

      onSuccess(isEdit ? `Post "${title}" updated.` : `Post "${title}" published.`);
      onClose();
    } catch {
      setError('Network error saving article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#143d36]/35 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#dfe7e2] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-[#edf2ef]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#eaf4ef] text-[#1f6b52]">
              <BookOpenText size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#173c35]">
                {isEdit ? 'Edit Article' : 'Write New Article'}
              </h3>
              <p className="text-xs text-[#80918a]">Editorial journal & announcements</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#889a93] hover:bg-[#f2f6f4]">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <CircleAlert size={16} className="mt-0.5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Article Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEdit) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }}
              placeholder="e.g. The Science of High-Durability Medical Fabrics"
              required
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none transition focus:border-[#206f55] focus:bg-white focus:ring-2 focus:ring-[#206f55]/15"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="science-of-medical-fabrics"
                required
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 font-mono text-xs text-[#1e423a] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none"
              >
                <option value="PUBLISHED">Published (Visible on storefront)</option>
                <option value="DRAFT">Draft (Unpublished)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Guides, Fabric Technology, Healthcare Tips"
              className="h-10 w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] px-3 text-xs text-[#1e423a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Summary / Excerpt</label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief 1-2 sentence hook for cards and preview snippets..."
              className="w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] p-3 text-xs text-[#1e423a] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#294a41] mb-1.5">Full Article Body</label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full post here..."
              required
              className="w-full rounded-xl border border-[#dce5e0] bg-[#fafcfb] p-3 text-xs text-[#1e423a] outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#edf2ef]">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="bg-[#1f6b52] text-white hover:bg-[#185540]">
              {loading ? 'Saving…' : isEdit ? 'Update Article' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

