<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = Testimonial::when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 20);
        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'         => ['required', 'string'],
            'location'     => ['nullable', 'string'],
            'avatar'       => ['nullable', 'string'],
            'rating'       => ['required', 'integer', 'min:1', 'max:5'],
            'text'         => ['required', 'string'],
            'video_url'    => ['nullable', 'string'],
            'package_type' => ['nullable', 'in:hajj,umrah,local,international'],
            'status'       => ['in:pending,approved,rejected'],
        ]);
        return response()->json(['data' => Testimonial::create($validated)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $item = Testimonial::findOrFail($id);
        $item->update($request->only('status', 'name', 'location', 'avatar', 'rating', 'text', 'video_url'));
        return response()->json(['data' => $item]);
    }

    public function destroy(int $id): JsonResponse
    {
        Testimonial::findOrFail($id)->delete();
        return response()->json(['message' => 'Testimonial deleted.']);
    }
}
