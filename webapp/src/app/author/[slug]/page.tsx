import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Logo } from "@/components/Logo";
import { Mail, Globe, Twitter, FileText, BookOpen, Lock, ArrowRight } from "lucide-react";

interface AuthorPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: AuthorPageProps) {
  const author = await prisma.author.findUnique({
    where: { slug: params.slug },
  });

  if (!author) {
    return { title: "Author Not Found" };
  }

  return {
    title: `${author.name} | Reflection`,
    description: author.bio || `Read content from ${author.name} on Reflection`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await prisma.author.findUnique({
    where: { slug: params.slug },
    include: {
      contents: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
      },
      authorSubscribers: {
        where: { status: "ACTIVE" },
      },
    },
  });

  if (!author) {
    notFound();
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case "NEWSLETTER": return <Mail className="h-4 w-4" />;
      case "BLOG": return <BookOpen className="h-4 w-4" />;
      case "ARTICLE": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#04070D]/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#04070D] border border-white/10 shadow-[0_0_20px_rgba(47,149,104,0.15)] group-hover:shadow-[0_0_30px_rgba(47,149,104,0.3)] transition-shadow duration-500">
                <Logo className="h-6 w-6 drop-shadow-[0_0_8px_rgba(130,203,168,0.8)]" />
              </div>
              <span className="text-xl font-bold text-[#E4E9F2]">Reflection</span>
            </Link>
            <Link
              href="/author/auth/login"
              className="text-sm text-stone-400 hover:text-[#E4E9F2] transition-colors"
            >
              Author Login
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Author Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-calm-500 to-calm-700 flex items-center justify-center shadow-[0_0_60px_rgba(47,149,104,0.3)]">
                {author.avatarUrl ? (
                  <img 
                    src={author.avatarUrl} 
                    alt={author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl md:text-6xl font-bold text-white">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {author.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-calm-500 flex items-center justify-center border-4 border-[#04070D]">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-[#E4E9F2] mb-4">{author.name}</h1>
              {author.bio && (
                <p className="text-lg text-stone-400 mb-6 max-w-2xl">{author.bio}</p>
              )}
              
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                {author.websiteUrl && (
                  <a 
                    href={author.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-[#E4E9F2] transition-all"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {author.twitterHandle && (
                  <a 
                    href={`https://twitter.com/${author.twitterHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-[#E4E9F2] transition-all"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#E4E9F2]">{author.contents.length}</p>
                  <p className="text-sm text-stone-500">Posts</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#E4E9F2]">{author.authorSubscribers.length}</p>
                  <p className="text-sm text-stone-500">Subscribers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe Banner */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-calm-600/20 to-calm-500/10 border border-calm-500/20 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-[#E4E9F2] mb-2">Subscribe to {author.name}</h2>
                <p className="text-stone-400">Get the latest content delivered to your inbox</p>
              </div>
              <form className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#E4E9F2] placeholder-stone-500 focus:outline-none focus:border-calm-500/50 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-calm-600 hover:bg-calm-500 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(47,149,104,0.3)] hover:shadow-[0_0_30px_rgba(47,149,104,0.5)]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Content List */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <h2 className="text-2xl font-bold text-[#E4E9F2] mb-8">Published Content</h2>
          
          {author.contents.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="h-8 w-8 text-stone-500" />
              </div>
              <h3 className="font-semibold text-[#E4E9F2] mb-2">No content yet</h3>
              <p className="text-sm text-stone-400">This author hasn&apos;t published any content yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {author.contents.map((content) => (
                <Link
                  key={content.id}
                  href={`/author/${author.slug}/${content.slug}`}
                  className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {content.coverImageUrl && (
                      <div className="hidden sm:block w-32 h-24 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                        <img 
                          src={content.coverImageUrl} 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="p-1.5 rounded-lg bg-white/5 text-stone-400">
                          {getContentIcon(content.type)}
                        </span>
                        <span className="text-xs text-stone-500 uppercase tracking-wider">{content.type}</span>
                        {content.access === "PAID" && (
                          <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                            <Lock className="h-3 w-3" />
                            Premium
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-[#E4E9F2] mb-2 group-hover:text-calm-400 transition-colors">
                        {content.title}
                      </h3>
                      {content.excerpt && (
                        <p className="text-stone-400 text-sm line-clamp-2 mb-3">{content.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span>{content.publishedAt ? new Date(content.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}</span>
                        {content.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-2">
                              {content.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-calm-400">#{tag}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-stone-500 group-hover:text-calm-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
