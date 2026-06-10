<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Services\SlugService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $packages = Package::withTrashed()
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => $q->where('title', 'ilike', '%' . $request->search . '%'))
            ->with(['itineraries', 'inclusions'])
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($packages);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type'            => ['required', 'in:hajj,umrah,local,international'],
            'title'           => ['required', 'string', 'max:255'],
            'title_ar'        => ['nullable', 'string', 'max:255'],
            'excerpt'         => ['nullable', 'string'],
            'excerpt_ar'      => ['nullable', 'string'],
            'description'     => ['nullable', 'string'],
            'description_ar'  => ['nullable', 'string'],
            'thumbnail'       => ['nullable', 'string'],
            'gallery'         => ['nullable', 'array'],
            'pricing'         => ['required', 'array'],
            'hotels'          => ['nullable', 'array'],
            'flights'         => ['nullable', 'array'],
            'departure_date'  => ['nullable', 'date'],
            'return_date'     => ['nullable', 'date'],
            'duration_days'   => ['nullable', 'integer', 'min:1'],
            'seats_total'     => ['nullable', 'integer', 'min:0'],
            'is_featured'     => ['boolean'],
            'status'          => ['in:draft,published,archived'],
            'brochure_url'    => ['nullable', 'string'],
            'seo_title'       => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'itineraries'     => ['nullable', 'array'],
            'inclusions'      => ['nullable', 'array'],
        ]);

        $validated['slug'] = SlugService::generate($request->title, Package::class);
        $validated['created_by'] = auth()->id();

        $package = Package::create($validated);

        if (!empty($validated['itineraries'])) {
            $package->itineraries()->createMany($validated['itineraries']);
        }

        if (!empty($validated['inclusions'])) {
            $package->inclusions()->createMany($validated['inclusions']);
        }

        return response()->json(['data' => $package->load('itineraries', 'inclusions')], 201);
    }

    public function show(int $id): JsonResponse
    {
        $package = Package::withTrashed()->with(['itineraries', 'inclusions'])->findOrFail($id);
        return response()->json(['data' => $package]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $package = Package::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'type'            => ['in:hajj,umrah,local,international'],
            'title'           => ['string', 'max:255'],
            'title_ar'        => ['nullable', 'string', 'max:255'],
            'excerpt'         => ['nullable', 'string'],
            'excerpt_ar'      => ['nullable', 'string'],
            'description'     => ['nullable', 'string'],
            'description_ar'  => ['nullable', 'string'],
            'thumbnail'       => ['nullable', 'string'],
            'gallery'         => ['nullable', 'array'],
            'pricing'         => ['nullable', 'array'],
            'hotels'          => ['nullable', 'array'],
            'flights'         => ['nullable', 'array'],
            'departure_date'  => ['nullable', 'date'],
            'return_date'     => ['nullable', 'date'],
            'duration_days'   => ['nullable', 'integer', 'min:1'],
            'seats_total'     => ['nullable', 'integer', 'min:0'],
            'is_featured'     => ['boolean'],
            'status'          => ['in:draft,published,archived'],
            'brochure_url'    => ['nullable', 'string'],
            'seo_title'       => ['nullable', 'string'],
            'seo_description' => ['nullable', 'string'],
            'itineraries'     => ['nullable', 'array'],
            'inclusions'      => ['nullable', 'array'],
        ]);

        if (isset($validated['title']) && $validated['title'] !== $package->title) {
            $validated['slug'] = SlugService::generate($validated['title'], Package::class, $package->id);
        }

        $package->update($validated);

        if (array_key_exists('itineraries', $validated)) {
            $package->itineraries()->delete();
            if (!empty($validated['itineraries'])) {
                $package->itineraries()->createMany($validated['itineraries']);
            }
        }

        if (array_key_exists('inclusions', $validated)) {
            $package->inclusions()->delete();
            if (!empty($validated['inclusions'])) {
                $package->inclusions()->createMany($validated['inclusions']);
            }
        }

        return response()->json(['data' => $package->load('itineraries', 'inclusions')]);
    }

    public function destroy(int $id): JsonResponse
    {
        $package = Package::findOrFail($id);
        $package->delete();
        return response()->json(['message' => 'Package archived successfully.']);
    }

    public function restore(int $id): JsonResponse
    {
        $package = Package::withTrashed()->findOrFail($id);
        $package->restore();
        return response()->json(['message' => 'Package restored successfully.']);
    }
}
