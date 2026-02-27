"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Mail, BookOpen, FileText, Eye, Loader2 } from "lucide-react";

type ContentType = "NEWSLETTER" | "BLOG" | "ARTICLE";

interface ContentWithAuthor {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  access: string;
  tags: string[];
  createdAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    slug: string;
  };
}

const contentTypeConfig = {
  NEWSLETTER: { icon: Mail, color: "text-blue-400", bg: "bg-blue-500/20" },
  BLOG: { icon: BookOpen, color: "text-green-400", bg: "bg-green-500/20" },
  ARTICLE: { icon: FileText, color: "text-purple-400", bg: "bg-purple-500/20" },
};

export function ContentReviewCard({ content }: { content: ContentWithAuthor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const config = contentTypeConfig[content.type];
  const Icon = config.icon;

  const handleApprove = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: content.id, action: "approve" }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!feedback.trim()) {
      setError("Please provide feedback for the author");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId: content.id, action: "reject", feedback }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reject");
      }
      
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`p-3 rounded-xl ${config.bg}`}>
              <Icon className={`h-6 w-6 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[#E4E9F2] text-lg truncate">{content.title}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-stone-400">
                <span>by {content.author.name}</span>
                <span>•</span>
                <span>{content.type.toLowerCase()}</span>
                <span>•</span>
                <span className={content.access === "PAID" ? "text-purple-400" : "text-stone-400"}>
                  {content.access.toLowerCase()}
                </span>
              </div>
              {content.excerpt && (
                <p className="text-stone-400 text-sm mt-2 line-clamp-2">{content.excerpt}</p>
              )}
              {content.tags.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {content.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-stone-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-stone-500 mt-2">
                Submitted {new Date(content.createdAt).toLocaleDateString()} at {new Date(content.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-[#E4E9F2] transition-colors"
              title="Preview content"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
        
        {error && (
          <p className="text-red-400 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0a0f1a] border border-white/10">
            <h3 className="text-lg font-bold text-[#E4E9F2] mb-4">Reject Content</h3>
            <p className="text-stone-400 text-sm mb-4">
              Provide feedback to help the author improve their content.
            </p>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain why this content needs revision..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
            />
            
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => { setShowRejectModal(false); setFeedback(""); setError(""); }}
                className="px-4 py-2 text-stone-400 hover:text-[#E4E9F2] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !feedback.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                Reject & Send Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-auto">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-auto p-6 rounded-2xl bg-[#0a0f1a] border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bg}`}>
                  <Icon className={`h-5 w-5 ${config.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#E4E9F2]">{content.title}</h3>
                  <p className="text-sm text-stone-400">by {content.author.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-stone-400 hover:text-[#E4E9F2] transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-stone-300 text-sm leading-relaxed">
                {content.body}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
