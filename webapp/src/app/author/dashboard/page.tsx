import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Mail, BookOpen, Eye, Edit2, MoreHorizontal } from "lucide-react";

export default async function AuthorDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/author/auth/login");
  }

  const author = await prisma.author.findUnique({
    where: { email: user.email },
    include: {
      contents: {
        orderBy: { updatedAt: "desc" },
        take: 10,
      },
      authorSubscribers: {
        where: { status: "ACTIVE" },
      },
    },
  });

  if (!author) {
    redirect("/author/auth/login");
  }

  const stats = {
    totalContent: author.contents.length,
    published: author.contents.filter(c => c.status === "PUBLISHED").length,
    drafts: author.contents.filter(c => c.status === "DRAFT").length,
    subscribers: author.authorSubscribers.length,
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "NEWSLETTER": return <Mail className="h-4 w-4" />;
      case "BLOG": return <BookOpen className="h-4 w-4" />;
      case "ARTICLE": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-500/20 text-green-400";
      case "DRAFT": return "bg-stone-500/20 text-stone-400";
      case "PENDING_REVIEW": return "bg-amber-500/20 text-amber-400";
      case "APPROVED": return "bg-green-500/20 text-green-400";
      case "REJECTED": return "bg-red-500/20 text-red-400";
      case "ARCHIVED": return "bg-stone-500/20 text-stone-400";
      default: return "bg-stone-500/20 text-stone-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_REVIEW": return "pending review";
      case "APPROVED": return "approved";
      case "REJECTED": return "needs revision";
      default: return status.toLowerCase();
    }
  };

  const getAccessBadge = (access: string) => {
    return access === "PAID" 
      ? <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">Paid</span>
      : <span className="px-2 py-0.5 text-xs rounded-full bg-stone-500/20 text-stone-400">Free</span>;
  };

  return (
    <div className="min-h-screen bg-[#04070D]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#04070D]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-[#E4E9F2]">Reflection</Link>
              <span className="text-stone-500">/</span>
              <span className="text-stone-400">Author Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href={`/author/${author.slug}`}
                className="text-sm text-stone-400 hover:text-[#E4E9F2] transition-colors flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Public Page
              </Link>
              <Link
                href="/author/dashboard/content/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-calm-600 hover:bg-calm-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                New Content
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#E4E9F2] mb-2">Welcome back, {author.name}</h1>
          <p className="text-stone-400">Manage your content and grow your audience</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Content", value: stats.totalContent, icon: FileText },
            { label: "Published", value: stats.published, icon: Eye },
            { label: "Drafts", value: stats.drafts, icon: Edit2 },
            { label: "Subscribers", value: stats.subscribers, icon: Mail },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-calm-500/20">
                  <stat.icon className="h-4 w-4 text-calm-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#E4E9F2]">{stat.value}</p>
              <p className="text-sm text-stone-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/author/dashboard/content/new?type=NEWSLETTER"
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-[#E4E9F2]">New Newsletter</h3>
            </div>
            <p className="text-sm text-stone-400">Send updates to your subscribers</p>
          </Link>
          <Link
            href="/author/dashboard/content/new?type=BLOG"
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                <BookOpen className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-[#E4E9F2]">New Blog Post</h3>
            </div>
            <p className="text-sm text-stone-400">Share your thoughts and ideas</p>
          </Link>
          <Link
            href="/author/dashboard/content/new?type=ARTICLE"
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-[#E4E9F2]">New Article</h3>
            </div>
            <p className="text-sm text-stone-400">Write in-depth content</p>
          </Link>
        </div>

        {/* Recent Content */}
        <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-[#E4E9F2]">Recent Content</h2>
            <Link href="/author/dashboard/content" className="text-sm text-calm-400 hover:text-calm-300 transition-colors">
              View All
            </Link>
          </div>
          
          {author.contents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="h-8 w-8 text-stone-500" />
              </div>
              <h3 className="font-semibold text-[#E4E9F2] mb-2">No content yet</h3>
              <p className="text-sm text-stone-400 mb-4">Start creating your first piece of content</p>
              <Link
                href="/author/dashboard/content/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-calm-600 hover:bg-calm-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Content
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {author.contents.map((content) => (
                <div key={content.id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white/5 text-stone-400">
                        {getContentIcon(content.type)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-[#E4E9F2] truncate">{content.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(content.status)}`}>
                            {getStatusLabel(content.status)}
                          </span>
                          {getAccessBadge(content.access)}
                          <span className="text-xs text-stone-500">
                            {new Date(content.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {content.status === "REJECTED" && content.rejectionFeedback && (
                          <p className="text-xs text-red-400 mt-1 line-clamp-1">
                            Feedback: {content.rejectionFeedback}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/author/dashboard/content/${content.id}`}
                      className="p-2 rounded-lg hover:bg-white/10 text-stone-400 hover:text-[#E4E9F2] transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Link>
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
