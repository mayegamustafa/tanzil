<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use App\Models\Testimonial;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContentController extends Controller
{
    public function gallery(Request $request): JsonResponse
    {
        $albums = Gallery::where('is_active', true)
            ->with('items')
            ->when($request->album, fn($q) => $q->where('slug', $request->album))
            ->get();
        return response()->json(['data' => $albums]);
    }

    public function testimonials(): JsonResponse
    {
        $items = Testimonial::approved()->latest()->limit(20)->get();
        return response()->json(['data' => $items]);
    }

    public function faqs(Request $request): JsonResponse
    {
        $faqs = Faq::active()
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->get();
        return response()->json(['data' => $faqs]);
    }
}
