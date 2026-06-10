<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $inquiries = Inquiry::with(['package', 'assignee'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) =>
                $q->where('name', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%')
            )
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json($inquiries);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json(['data' => Inquiry::with(['package', 'assignee'])->findOrFail($id)]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($id);
        $validated = $request->validate([
            'status'      => ['in:new,contacted,qualified,closed'],
            'assigned_to' => ['nullable', 'exists:users,id'],
            'notes'       => ['nullable', 'string'],
        ]);
        $inquiry->update($validated);
        return response()->json(['data' => $inquiry->load('assignee')]);
    }

    public function destroy(int $id): JsonResponse
    {
        Inquiry::findOrFail($id)->delete();
        return response()->json(['message' => 'Inquiry deleted.']);
    }
}
