<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPassenger;
use App\Models\DiscountCode;
use App\Models\Package;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function __construct(private BookingService $bookingService) {}

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'package_id'      => ['required', 'exists:packages,id'],
            'tier'            => ['required', 'in:economy,standard,vip,family'],
            'email'           => ['required', 'email'],
            'phone'           => ['required', 'string', 'max:30'],
            'num_passengers'  => ['required', 'integer', 'min:1', 'max:20'],
            'passengers'      => ['required', 'array', 'min:1'],
            'passengers.*.first_name'       => ['required', 'string'],
            'passengers.*.last_name'        => ['required', 'string'],
            'passengers.*.date_of_birth'    => ['required', 'date'],
            'passengers.*.gender'           => ['required', 'in:male,female'],
            'passengers.*.nationality'      => ['required', 'string'],
            'passengers.*.passport_number'  => ['required', 'string'],
            'passengers.*.passport_expiry'  => ['required', 'date', 'after:today'],
            'payment_method'  => ['required', 'string'],
            'discount_code'   => ['nullable', 'string'],
            'special_requests'=> ['nullable', 'string'],
        ]);

        $booking = $this->bookingService->create($request->all());

        return response()->json([
            'data'    => ['reference' => $booking->reference, 'id' => $booking->id],
            'message' => 'Booking submitted successfully.',
        ], 201);
    }

    public function status(string $reference): JsonResponse
    {
        $booking = Booking::with('package:id,title,departure_date')
            ->where('reference', $reference)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'reference'       => $booking->reference,
                'lead_name'       => $booking->lead_name,
                'package_title'   => $booking->package->title,
                'departure_date'  => $booking->package->departure_date,
                'num_passengers'  => $booking->num_passengers,
                'booking_status'  => $booking->booking_status,
                'payment_status'  => $booking->payment_status,
                'total_amount'    => $booking->total_amount,
                'currency'        => $booking->currency,
                'invoice_url'     => $booking->invoice_url,
                'created_at'      => $booking->created_at,
            ],
        ]);
    }
}
