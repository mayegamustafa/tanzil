<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\BookingPassenger;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function create(array $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $passengers = $data['passengers'] ?? [];
            unset($data['passengers']);

            $booking = Booking::create($data);

            foreach ($passengers as $i => $p) {
                $p['is_lead'] = $i === 0;
                $booking->passengers()->create($p);
            }

            // Increment seats_booked
            $booking->package()->increment('seats_booked', count($passengers));

            return $booking->load('passengers', 'package');
        });
    }
}
