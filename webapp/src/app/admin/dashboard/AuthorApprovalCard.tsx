"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, User, Mail, Calendar, Globe } from "lucide-react";

interface Author {
  id: string;
  email: string;
  name: string;
  slug: string;
  bio: string;
  createdAt: Date;
}

export function AuthorApprovalCard({ author }: { author: Author }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/authors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: author.id,
          action: "approve",
        }),
      });

      if (!res.ok) throw new Error("Failed to approve");
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/admin/authors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: author.id,
          action: "reject",
          reason: rejectionReason,
        }),
      });

      if (!res.ok) throw new Error("Failed to reject");
      setShowRejectModal(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-500 to-calm-700 flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#E4E9F2]">{author.name}</h3>
                <p className="text-sm text-stone-400 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {author.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Globe className="h-4 w-4" />
                <span>/author/{author.slug}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(author.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {author.bio && (
              <p className="text-sm text-stone-300 bg-white/5 p-3 rounded-lg">{author.bio}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#04070D] border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-[#E4E9F2] mb-4">Reject Author Request</h3>
            <p className="text-stone-400 mb-4">
              Please provide a reason for rejection. This will be sent to <strong className="text-[#E4E9F2]">{author.email}</strong>.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-red-500/50 transition-all resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-2 px-4 text-stone-400 hover:text-[#E4E9F2] hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Sending..." : "Reject & Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
