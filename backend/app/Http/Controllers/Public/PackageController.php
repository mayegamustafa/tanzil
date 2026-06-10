<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $packages = Package::published()
            ->when($request->type, fn($q) => $q->ofType($request->type))
            ->when($request->featured, fn($q) => $q->featured())
            ->when($request->min_price, fn($q) => $q->whereRaw("(pricing->>'economy')::numeric >= ?", [$request->min_price]))
            ->when($request->max_price, fn($q) => $q->whereRaw("(pricing->>'economy')::numeric <= ?", [$request->max_price]))
            ->when($request->search, fn($q) => $q->where('title', 'ilike', '%' . $request->search . '%'))
            ->select('id', 'type', 'title', 'slug', 'excerpt', 'thumbnail', 'pricing', 'departure_date', 'duration_days', 'seats_total', 'seats_booked', 'is_featured', 'status')
            ->orderBy('is_featured', 'desc')
            ->latest()
            ->paginate($request->per_page ?? 12);

        return response()->json($packages);
    }

    public function show(string $slug): JsonResponse
    {
        $package = Package::published()
            ->with(['itineraries', 'inclusions'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['data' => $package]);
    }
}
