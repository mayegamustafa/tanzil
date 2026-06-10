<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Gallery::withCount('items')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'cover_image' => ['nullable', 'string'],
        ]);
        $validated['slug'] = \Str::slug($validated['title']);
        return response()->json(['data' => Gallery::create($validated)], 201);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => Gallery::with('items')->findOrFail($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->update($request->only('title', 'cover_image', 'is_active'));
        return response()->json(['data' => $gallery]);
    }

    public function destroy(int $id): JsonResponse
    {
        Gallery::findOrFail($id)->delete();
        return response()->json(['message' => 'Album deleted.']);
    }

    public function addItem(Request $request, int $galleryId): JsonResponse
    {
        $request->validate([
            'type'       => ['required', 'in:image,video'],
            'url'        => ['required', 'string'],
            'thumbnail'  => ['nullable', 'string'],
            'caption'    => ['nullable', 'string'],
            'alt'        => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        Gallery::findOrFail($galleryId);

        $item = GalleryItem::create(array_merge($request->all(), [
            'gallery_id'  => $galleryId,
            'sort_order'  => $request->sort_order ?? (GalleryItem::where('gallery_id', $galleryId)->max('sort_order') + 1),
        ]));

        return response()->json(['data' => $item], 201);
    }

    public function removeItem(int $galleryId, int $itemId): JsonResponse
    {
        GalleryItem::where('gallery_id', $galleryId)->findOrFail($itemId)->delete();
        return response()->json(['message' => 'Item removed.']);
    }
}
