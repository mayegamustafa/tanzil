"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function LatestBlog() {
  const { data } = useQuery({
    queryKey: ["blog-public"],
    queryFn: () => api.get("/blog", { params: { per_page: 3 } }).then((r) => r.data.data),
  });

  const posts: any[] = data ?? [];
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-site">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="section-label text-[#C8A96B] mb-4 block">Insights</span>
            <h2
              className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
              From Our Blog
            </h2>
            <div className="divider-gold mt-4" />
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-[#0F6A4A] font-semibold text-sm border border-[#0F6A4A]/30 hover:border-[#0F6A4A] hover:bg-[#0F6A4A] hover:text-white px-5 py-2.5 rounded-xl transition-all">
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured large post */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="lg:col-span-3 group card-hover rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              <Link href={`/blog/${featured.slug}`}>
                <div className="relative h-64 lg:h-80 overflow-hidden bg-gradient-to-br from-[#0F6A4A]/20 to-[#C8A96B]/20">
                  {featured.featured_image ? (
                    <img
                      src={featured.featured_image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0F6A4A] to-[#C8A96B]/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  {featured.category && (
                    <span className="absolute top-5 left-5 bg-[#0F6A4A] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {featured.category.name}
                    </span>
                  )}
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.published_at ? formatDate(featured.published_at) : "Draft"}
                    </span>
                    {featured.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {featured.author.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0F6A4A] transition-colors leading-snug">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{featured.excerpt}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-5 text-sm font-semibold text-[#0F6A4A]">
                    Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Compact secondary posts */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {rest.map((post: any, i: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1 }}
                className="group flex gap-4 card-hover bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <Link href={`/blog/${post.slug}`} className="shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-[#0F6A4A]/20 to-[#C8A96B]/20">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0F6A4A] to-[#C8A96B]/40" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  {post.category && (
                    <span className="text-[10px] font-semibold text-[#C8A96B] uppercase tracking-wide">
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5 mt-0.5 group-hover:text-[#0F6A4A] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-gray-400">
                    {post.published_at ? formatDate(post.published_at) : "Draft"}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
