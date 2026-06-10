"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

export default function BlogPostClient({ slug }: { slug: string }) {
  const { lang } = useLang();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => api.get(`/blog/${slug}`).then((r) => r.data.data),
  });

  if (isLoading) return (
    <div className="min-h-screen pt-24 animate-pulse">
      <div className="h-72 bg-gray-100" />
      <div className="container-site max-w-3xl py-12 space-y-4">
        <div className="h-8 w-3/4 bg-gray-100 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
      </div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h2>
        <Link href="/blog" className="text-[#0F6A4A] hover:underline">Back to blog</Link>
      </div>
    </div>
  );

  const isAr = lang === "ar";
  const title   = (isAr && post.title_ar)   ? post.title_ar   : post.title;
  const excerpt = (isAr && post.excerpt_ar) ? post.excerpt_ar : post.excerpt;
  const content = (isAr && post.content_ar) ? post.content_ar : post.content;

  return (
    <>
      {/* Hero */}
      <div className="relative min-h-72 bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-16">
        {post.thumbnail && <img src={post.thumbnail} alt={title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="container-site max-w-3xl relative">
          {post.category && <span className="inline-block bg-[#C8A96B] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category.name}</span>}
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3" dir={isAr ? "rtl" : "ltr"} style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            {title}
          </h1>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <Calendar className="w-4 h-4" />
            {post.published_at ? formatDate(post.published_at) : "Draft"}
            {post.author && <span className="ml-3">By {post.author.name}</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white py-14">
        <div className="container-site max-w-3xl" dir={isAr ? "rtl" : "ltr"}>
          {excerpt && <p className="text-lg text-gray-600 leading-relaxed mb-8 italic border-l-4 border-[#C8A96B] pl-5">{excerpt}</p>}
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-[#0F6A4A]"
            dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#0F6A4A] font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
