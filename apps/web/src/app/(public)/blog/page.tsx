"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["blog-list", search, page],
    queryFn: () => api.get("/blog", { params: { search, page, per_page: 9 } }).then((r) => r.data),
  });

  const posts = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  return (
    <>
      <div className="bg-gradient-to-br from-[#0A4F38] to-[#0F6A4A] pt-32 pb-20">
        <div className="container-site text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair, 'Playfair Display', serif)" }}>
            Our Blog
          </h1>
          <p className="text-white/70 mb-8">Insights, guides, and stories from the world of Hajj, Umrah, and travel</p>
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles…"
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-sm text-gray-700 outline-none shadow-lg" />
          </div>
        </div>
      </div>

      <div className="py-16 bg-[#F8F5EE]">
        <div className="container-site">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-100" />
                  <div className="p-5 space-y-3"><div className="h-5 w-3/4 bg-gray-100 rounded" /><div className="h-4 w-full bg-gray-100 rounded" /></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24"><p className="text-gray-400 text-lg">No articles found.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post: any, i: number) => (
                <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                  <div className="relative h-48 bg-gradient-to-br from-[#0F6A4A]/20 to-[#C8A96B]/20">
                    {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    {post.category && (
                      <span className="absolute top-4 left-4 bg-[#0F6A4A] text-white text-xs font-medium px-3 py-1 rounded-full">{post.category.name}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3.5 h-3.5" />{post.published_at ? formatDate(post.published_at) : "Draft"}
                    </div>
                    <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#0F6A4A] transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    {post.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>}
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6A4A] hover:underline">
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {lastPage > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: lastPage }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-colors ${page === i + 1 ? "bg-[#0F6A4A] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
