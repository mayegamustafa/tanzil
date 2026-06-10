<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::published()
            ->with('category:id,name,slug')
            ->when($request->category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $request->category)))
            ->when($request->tag, fn($q) => $q->whereJsonContains('tags', $request->tag))
            ->when($request->search, fn($q) => $q->where('title', 'ilike', '%' . $request->search . '%'))
            ->select('id', 'category_id', 'title', 'slug', 'excerpt', 'thumbnail', 'author_name', 'published_at', 'read_time_minutes', 'tags')
            ->latest('published_at')
            ->paginate($request->per_page ?? 9);

        return response()->json($posts);
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::published()->with('category')->where('slug', $slug)->firstOrFail();
        $post->incrementViews();

        $related = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->where('category_id', $post->category_id)
            ->select('id', 'title', 'slug', 'thumbnail', 'published_at', 'read_time_minutes')
            ->limit(3)
            ->get();

        return response()->json(['data' => $post, 'related' => $related]);
    }
}
