<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $posts = BlogPost::with('category')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category_id, fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->search, fn($q) => $q->where('title', 'ilike', '%' . $request->search . '%'))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($posts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id'     => ['nullable', 'exists:blog_categories,id'],
            'title'           => ['required', 'string', 'max:255'],
            'title_ar'        => ['nullable', 'string', 'max:255'],
            'excerpt'         => ['nullable', 'string'],
            'excerpt_ar'      => ['nullable', 'string'],
            'content'         => ['nullable', 'string'],
            'content_ar'      => ['nullable', 'string'],
            'thumbnail'       => ['nullable', 'string'],
            'author_name'     => ['nullable', 'string'],
            'author_avatar'   => ['nullable', 'string'],
            'status'          => ['in:draft,published,archived'],
            'published_at'    => ['nullable', 'date'],
            'tags'            => ['nullable', 'array'],
            'read_time_minutes' => ['nullable', 'integer'],
            'seo_title'       => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
        ]);

        $validated['slug'] = SlugService::generate($request->title, BlogPost::class);
        $validated['created_by'] = auth()->id();
        $validated['author_name'] = $validated['author_name'] ?? auth()->user()->name;

        $post = BlogPost::create($validated);
        return response()->json(['data' => $post->load('category')], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => BlogPost::with('category')->findOrFail($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = BlogPost::findOrFail($id);
        $validated = $request->validate([
            'category_id'     => ['nullable', 'exists:blog_categories,id'],
            'title'           => ['string', 'max:255'],
            'title_ar'        => ['nullable', 'string', 'max:255'],
            'excerpt'         => ['nullable', 'string'],
            'excerpt_ar'      => ['nullable', 'string'],
            'content'         => ['nullable', 'string'],
            'content_ar'      => ['nullable', 'string'],
            'thumbnail'       => ['nullable', 'string'],
            'author_name'     => ['nullable', 'string'],
            'status'          => ['in:draft,published,archived'],
            'published_at'    => ['nullable', 'date'],
            'tags'            => ['nullable', 'array'],
            'read_time_minutes' => ['nullable', 'integer'],
            'seo_title'       => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
        ]);

        if (isset($validated['title']) && $validated['title'] !== $post->title) {
            $validated['slug'] = SlugService::generate($validated['title'], BlogPost::class, $post->id);
        }

        $post->update($validated);
        return response()->json(['data' => $post->load('category')]);
    }

    public function destroy(int $id): JsonResponse
    {
        BlogPost::findOrFail($id)->delete();
        return response()->json(['message' => 'Post deleted.']);
    }

    public function categories(): JsonResponse
    {
        return response()->json(['data' => BlogCategory::all()]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);
        $validated['slug'] = SlugService::generate($request->name, BlogCategory::class);
        return response()->json(['data' => BlogCategory::create($validated)], 201);
    }
}
