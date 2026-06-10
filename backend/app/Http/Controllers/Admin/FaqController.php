<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(['data' => Faq::when($request->category, fn($q) => $q->where('category', $request->category))
            ->orderBy('sort_order')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question'   => ['required', 'string'],
            'answer'     => ['required', 'string'],
            'category'   => ['nullable', 'string'],
            'sort_order' => ['nullable', 'integer'],
            'is_active'  => ['boolean'],
        ]);
        $validated['sort_order'] = $validated['sort_order'] ?? (Faq::max('sort_order') + 1);
        return response()->json(['data' => Faq::create($validated)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $faq = Faq::findOrFail($id);
        $faq->update($request->only('question', 'answer', 'category', 'sort_order', 'is_active'));
        return response()->json(['data' => $faq]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate(['items' => ['required', 'array'], 'items.*.id' => ['required', 'integer'], 'items.*.sort_order' => ['required', 'integer']]);
        foreach ($request->items as $item) {
            Faq::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }
        return response()->json(['message' => 'Order saved.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['message' => 'FAQ deleted.']);
    }
}
