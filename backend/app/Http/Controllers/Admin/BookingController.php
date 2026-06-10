<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    public function __construct(private InvoiceService $invoiceService) {}

    public function index(Request $request): JsonResponse
    {
        $bookings = Booking::with('package')
            ->when($request->status, fn($q) => $q->where('booking_status', $request->status))
            ->when($request->package_id, fn($q) => $q->where('package_id', $request->package_id))
            ->when($request->search, fn($q) =>
                $q->where('reference', 'ilike', '%' . $request->search . '%')
                  ->orWhere('lead_name', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%')
            )
            ->when($request->from, fn($q) => $q->whereDate('created_at', '>=', $request->from))
            ->when($request->to, fn($q) => $q->whereDate('created_at', '<=', $request->to))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($bookings);
    }

    public function show(int $id): JsonResponse
    {
        $booking = Booking::with(['package', 'passengers'])->findOrFail($id);
        return response()->json(['data' => $booking]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'booking_status' => ['required', 'in:pending,approved,processing,paid,cancelled,completed'],
            'notes'          => ['nullable', 'string'],
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update([
            'booking_status' => $request->booking_status,
            'notes'          => $request->notes ?? $booking->notes,
        ]);

        return response()->json(['data' => $booking, 'message' => 'Status updated.']);
    }

    public function generateInvoice(int $id): Response
    {
        $booking = Booking::with(['package', 'passengers'])->findOrFail($id);
        $pdf = $this->invoiceService->generate($booking);

        return response($pdf->output(), 200, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="invoice-' . $booking->reference . '.pdf"',
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Booking::findOrFail($id)->delete();
        return response()->json(['message' => 'Booking deleted.']);
    }
}
