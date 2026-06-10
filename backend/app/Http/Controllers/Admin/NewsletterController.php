<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subscribers = NewsletterSubscriber::when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 20);
        return response()->json($subscribers);
    }

    public function destroy(int $id): JsonResponse
    {
        NewsletterSubscriber::findOrFail($id)->delete();
        return response()->json(['message' => 'Subscriber removed.']);
    }
}
