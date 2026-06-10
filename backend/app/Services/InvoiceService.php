<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService
{
    public function generate(Booking $booking): \Barryvdh\DomPDF\PDF
    {
        $settings = [
            'site_name'  => Setting::get('site_name', 'Tanzeel Travels'),
            'site_logo'  => Setting::get('site_logo'),
            'address'    => Setting::get('contact_address', 'Masitowa Ndejje, off Entebbe Road'),
            'phone'      => Setting::get('contact_phone_1', '+256785925106'),
            'email'      => Setting::get('contact_email', 'info@tanzeel-travels.com'),
        ];

        $pdf = Pdf::loadView('pdf.invoice', [
            'booking'  => $booking,
            'settings' => $settings,
        ]);

        $pdf->setPaper('a4');

        return $pdf;
    }
}
