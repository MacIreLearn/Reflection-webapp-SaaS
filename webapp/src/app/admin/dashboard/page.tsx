import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, Users, CheckCircle, XCircle, Clock, FileText, Mail, BookOpen } from "lucide-react";
import { AuthorApprovalCard } from "./AuthorApprovalCard";
import { ContentReviewCard } from "./ContentReviewCard";
import { LogoutButton } from "./LogoutButton";

async function getAdminSession() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) return null;
  
  const admin = await prisma.admin.findUnique({
    where: { id: sessionId },
  });
  return admin;
}

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  
  if (!admin) {
    redirect("/admin/auth/login");
  }

  const [pendingAuthors, approvedAuthors, rejectedAuthors, pendingContent, recentlyReviewedContent] = await Promise.all([
    prisma.author.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.author.findMany({
      where: { status: "APPROVED" },
      orderBy: { reviewedAt: "desc" },
      take: 10,
    }),
    prisma.author.findMany({
      where: { status: "REJECTED" },
      orderBy: { reviewedAt: "desc" },
      take: 10,
    }),
    prisma.content.findMany({
      where: { status: "PENDING_REVIEW" },
      include: {
        author: {
          select: { id: true, name: true, email: true, slug: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.content.findMany({
      where: {
        status: { in: ["PUBLISHED", "REJECTED"] },
        reviewedAt: { not: null },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, slug: true },
        },
      },
      orderBy: { reviewedAt: "desc" },
      take: 10,
    }),
  ]);

  const stats = {
    pendingAuthors: pendingAuthors.length,
    approvedAuthors: approvedAuthors.length,
    rejectedAuthors: rejectedAuthors.length,
    pendingContent: pendingContent.length,
  };

  return (
    <div className="min-h-screen bg-[#04070D]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#04070D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-400" />
                <span className="text-xl font-bold text-[#E4E9F2]">Admin Dashboard</span>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Content Pending</span>
            </div>
            <p className="text-3xl font-bold text-[#E4E9F2]">{stats.pendingContent}</p>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Authors Pending</span>
            </div>
            <p className="text-3xl font-bold text-[#E4E9F2]">{stats.pendingAuthors}</p>
          </div>
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Authors Approved</span>
            </div>
            <p className="text-3xl font-bold text-[#E4E9F2]">{stats.approvedAuthors}</p>
          </div>
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-5 w-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Authors Rejected</span>
            </div>
            <p className="text-3xl font-bold text-[#E4E9F2]">{stats.rejectedAuthors}</p>
          </div>
        </div>

        {/* Pending Content Review */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#E4E9F2] mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            Content Pending Review ({pendingContent.length})
          </h2>
          
          {pendingContent.length === 0 ? (
            <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
              <FileText className="h-12 w-12 text-stone-500 mx-auto mb-4" />
              <p className="text-stone-400">No content pending review</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingContent.map((content) => (
                <ContentReviewCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </div>

        {/* Pending Author Requests */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#E4E9F2] mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-400" />
            Pending Author Requests ({pendingAuthors.length})
          </h2>
          
          {pendingAuthors.length === 0 ? (
            <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
              <Users className="h-12 w-12 text-stone-500 mx-auto mb-4" />
              <p className="text-stone-400">No pending requests</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingAuthors.map((author) => (
                <AuthorApprovalCard key={author.id} author={author} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Approved */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-[#E4E9F2] mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Recently Approved
          </h2>
          
          {approvedAuthors.length === 0 ? (
            <p className="text-stone-500">No approved authors yet</p>
          ) : (
            <div className="grid gap-2">
              {approvedAuthors.map((author) => (
                <div key={author.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#E4E9F2]">{author.name}</p>
                    <p className="text-sm text-stone-400">{author.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">Approved</span>
                    <p className="text-xs text-stone-500 mt-1">
                      {author.reviewedAt ? new Date(author.reviewedAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Rejected */}
        <div>
          <h2 className="text-xl font-bold text-[#E4E9F2] mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            Recently Rejected
          </h2>
          
          {rejectedAuthors.length === 0 ? (
            <p className="text-stone-500">No rejected authors</p>
          ) : (
            <div className="grid gap-2">
              {rejectedAuthors.map((author) => (
                <div key={author.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#E4E9F2]">{author.name}</p>
                    <p className="text-sm text-stone-400">{author.email}</p>
                    {author.rejectionReason && (
                      <p className="text-xs text-red-400 mt-1">Reason: {author.rejectionReason}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Rejected</span>
                    <p className="text-xs text-stone-500 mt-1">
                      {author.reviewedAt ? new Date(author.reviewedAt).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
