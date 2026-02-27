"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Globe, Lock, Loader2 } from "lucide-react";

type ContentType = "NEWSLETTER" | "BLOG" | "ARTICLE";
type ContentAccess = "FREE" | "PAID";

function NewContentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as ContentType) || "BLOG";

  const [formData, setFormData] = useState({
    type: initialType,
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    access: "FREE" as ContentAccess,
    tags: "",
    coverImageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleSave = async (submitForReview: boolean) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/author/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
          status: submitForReview ? "PENDING_REVIEW" : "DRAFT",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save content");
      }

      router.push("/author/dashboard");
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const contentTypeLabels = {
    NEWSLETTER: { label: "Newsletter", desc: "Send to your subscribers" },
    BLOG: { label: "Blog Post", desc: "Share your thoughts" },
    ARTICLE: { label: "Article", desc: "In-depth content" },
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-white/10 bg-[#04070D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/author/dashboard" 
              className="inline-flex items-center gap-2 text-stone-400 hover:text-[#E4E9F2] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving || !formData.title}
                className="inline-flex items-center gap-2 px-4 py-2 text-stone-400 hover:text-[#E4E9F2] hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving || !formData.title || !formData.body}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Eye className="h-4 w-4" />
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Content Type Selector */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Content Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(["NEWSLETTER", "BLOG", "ARTICLE"] as ContentType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.type === type
                      ? "bg-calm-500/20 border-calm-500/50 text-[#E4E9F2]"
                      : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                  }`}
                >
                  <p className="font-medium">{contentTypeLabels[type].label}</p>
                  <p className="text-xs mt-1 opacity-70">{contentTypeLabels[type].desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter a compelling title..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] text-xl font-medium placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">URL Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
            />
          </div>

          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-3">Access Level</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, access: "FREE" }))}
                className={`flex-1 p-4 rounded-xl border flex items-center gap-3 transition-all ${
                  formData.access === "FREE"
                    ? "bg-green-500/20 border-green-500/50 text-[#E4E9F2]"
                    : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                }`}
              >
                <Globe className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Free</p>
                  <p className="text-xs opacity-70">Anyone can read</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, access: "PAID" }))}
                className={`flex-1 p-4 rounded-xl border flex items-center gap-3 transition-all ${
                  formData.access === "PAID"
                    ? "bg-purple-500/20 border-purple-500/50 text-[#E4E9F2]"
                    : "bg-white/5 border-white/10 text-stone-400 hover:bg-white/10"
                }`}
              >
                <Lock className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Paid</p>
                  <p className="text-xs opacity-70">Subscribers only</p>
                </div>
              </button>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Excerpt (optional)</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="A brief summary of your content..."
              rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all resize-none"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Content</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Write your content here... (Markdown supported)"
              rows={20}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all resize-y font-mono text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="wellness, mindfulness, productivity"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-2">Cover Image URL (optional)</label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 focus:ring-1 focus:ring-calm-500/50 transition-all"
            />
          </div>
        </div>
      </main>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#04070D] flex items-center justify-center">
      <Loader2 className="h-8 w-8 text-calm-500 animate-spin" />
    </div>
  );
}

export default function NewContentPage() {
  return (
    <div className="min-h-screen bg-[#04070D]">
      <Suspense fallback={<LoadingFallback />}>
        <NewContentForm />
      </Suspense>
    </div>
  );
}
