import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Calendar, Tag, Lock, Mail, BookOpen, FileText } from "lucide-react";

interface ContentPageProps {
  params: { slug: string; contentSlug: string };
}

export async function generateMetadata({ params }: ContentPageProps) {
  const author = await prisma.author.findUnique({
    where: { slug: params.slug },
  });

  if (!author) {
    return { title: "Not Found" };
  }

  const content = await prisma.content.findUnique({
    where: {
      authorId_slug: {
        authorId: author.id,
        slug: params.contentSlug,
      },
    },
  });

  if (!content) {
    return { title: "Content Not Found" };
  }

  return {
    title: `${content.title} | ${author.name}`,
    description: content.excerpt || `Read "${content.title}" by ${author.name}`,
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const author = await prisma.author.findUnique({
    where: { slug: params.slug },
  });

  if (!author) {
    notFound();
  }

  const content = await prisma.content.findUnique({
    where: {
      authorId_slug: {
        authorId: author.id,
        slug: params.contentSlug,
      },
    },
  });

  if (!content || content.status !== "PUBLISHED") {
    notFound();
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "NEWSLETTER": return <Mail className="h-5 w-5" />;
      case "BLOG": return <BookOpen className="h-5 w-5" />;
      case "ARTICLE": return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  // Simple markdown-like rendering (for demo - in production use a proper markdown parser)
  const renderContent = (text: string) => {
    return text
      .split("\n\n")
      .map((paragraph, i) => {
        if (paragraph.startsWith("# ")) {
          return <h1 key={i} className="text-3xl font-bold text-[#E4E9F2] mb-6 mt-8">{paragraph.slice(2)}</h1>;
        }
        if (paragraph.startsWith("## ")) {
          return <h2 key={i} className="text-2xl font-bold text-[#E4E9F2] mb-4 mt-6">{paragraph.slice(3)}</h2>;
        }
        if (paragraph.startsWith("### ")) {
          return <h3 key={i} className="text-xl font-bold text-[#E4E9F2] mb-3 mt-4">{paragraph.slice(4)}</h3>;
        }
        if (paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter(line => line.startsWith("- "));
          return (
            <ul key={i} className="list-disc list-inside space-y-2 mb-4 text-stone-300">
              {items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}
            </ul>
          );
        }
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote key={i} className="border-l-4 border-calm-500 pl-4 py-2 my-4 italic text-stone-400">
              {paragraph.slice(2)}
            </blockquote>
          );
        }
        return <p key={i} className="text-stone-300 leading-relaxed mb-4">{paragraph}</p>;
      });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#04070D]/60 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#04070D] border border-white/10 shadow-[0_0_20px_rgba(47,149,104,0.15)] group-hover:shadow-[0_0_30px_rgba(47,149,104,0.3)] transition-shadow duration-500">
                <Logo className="h-6 w-6 drop-shadow-[0_0_8px_rgba(130,203,168,0.8)]" />
              </div>
              <span className="text-xl font-bold text-[#E4E9F2]">Reflection</span>
            </Link>
            <Link
              href={`/author/${author.slug}`}
              className="text-sm text-stone-400 hover:text-[#E4E9F2] transition-colors"
            >
              More from {author.name}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link
            href={`/author/${author.slug}`}
            className="inline-flex items-center gap-2 text-stone-400 hover:text-[#E4E9F2] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {author.name}
          </Link>
        </div>

        {/* Content Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Cover Image */}
          {content.coverImageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden aspect-video bg-white/5">
              <img 
                src={content.coverImageUrl} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-stone-400">
              {getContentIcon(content.type)}
              <span className="text-sm">{content.type}</span>
            </span>
            {content.access === "PAID" && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Premium</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#E4E9F2] mb-6 leading-tight">
            {content.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
            <Link href={`/author/${author.slug}`} className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-500 to-calm-700 flex items-center justify-center">
                {author.avatarUrl ? (
                  <img src={author.avatarUrl} alt={author.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-white">{author.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-[#E4E9F2] group-hover:text-calm-400 transition-colors">{author.name}</p>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Calendar className="h-4 w-4" />
                  {content.publishedAt ? new Date(content.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                </div>
              </div>
            </Link>
          </div>

          {/* Excerpt */}
          {content.excerpt && (
            <p className="text-xl text-stone-400 mb-8 leading-relaxed font-light italic">
              {content.excerpt}
            </p>
          )}

          {/* Body */}
          <div className="prose-custom">
            {renderContent(content.body)}
          </div>

          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-white/10">
              <Tag className="h-4 w-4 text-stone-500" />
              {content.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-sm text-calm-400 hover:bg-white/10 transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Card */}
          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-start gap-4">
              <Link href={`/author/${author.slug}`}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-calm-500 to-calm-700 flex items-center justify-center flex-shrink-0">
                  {author.avatarUrl ? (
                    <img src={author.avatarUrl} alt={author.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{author.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/author/${author.slug}`}>
                  <h3 className="text-lg font-semibold text-[#E4E9F2] hover:text-calm-400 transition-colors">
                    {author.name}
                  </h3>
                </Link>
                {author.bio && (
                  <p className="text-stone-400 text-sm mt-1 line-clamp-2">{author.bio}</p>
                )}
                <Link
                  href={`/author/${author.slug}`}
                  className="inline-flex items-center gap-2 mt-3 text-sm text-calm-400 hover:text-calm-300 transition-colors"
                >
                  View all posts
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
