<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Inquiry;
use App\Models\Package;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $thisMonth    = now()->startOfMonth();
        $lastMonth    = now()->subMonth()->startOfMonth();
        $lastMonthEnd = now()->subMonth()->endOfMonth();

        $totalRevenue      = Booking::whereIn('booking_status', ['paid', 'completed'])->sum('total_amount');
        $revenueThisMonth  = Booking::whereIn('booking_status', ['paid', 'completed'])->where('created_at', '>=', $thisMonth)->sum('total_amount');
        $revenueLastMonth  = Booking::whereIn('booking_status', ['paid', 'completed'])->whereBetween('created_at', [$lastMonth, $lastMonthEnd])->sum('total_amount');

        $totalBookings     = Booking::count();
        $bookingsThisMonth = Booking::where('created_at', '>=', $thisMonth)->count();
        $bookingsLastMonth = Booking::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $totalInquiries  = Inquiry::count();
        $newInquiries    = Inquiry::where('status', 'new')->count();
        $activePackages  = Package::where('status', 'published')->count();

        $revenueGrowth  = $revenueLastMonth > 0 ? round((($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100, 1) : 0;
        $bookingGrowth  = $bookingsLastMonth > 0 ? round((($bookingsThisMonth - $bookingsLastMonth) / $bookingsLastMonth) * 100, 1) : 0;

        $statusBreakdown = Booking::select('booking_status', DB::raw('count(*) as count'))
            ->groupBy('booking_status')
            ->get();

        $monthlyRevenue = Booking::select(
                DB::raw("TO_CHAR(created_at, 'Mon YYYY') as month"),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as bookings')
            )
            ->whereIn('booking_status', ['paid', 'completed'])
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy(DB::raw("TO_CHAR(created_at, 'Mon YYYY')"))
            ->orderBy(DB::raw("MIN(created_at)"))
            ->get();

        $recentBookings = Booking::with('package')->latest()->limit(10)->get();
        $recentInquiries = Inquiry::with('package')->latest()->limit(8)->get();

        return response()->json([
            'data' => [
                'stats' => [
                    'total_revenue'             => $totalRevenue,
                    'revenue_this_month'         => $revenueThisMonth,
                    'revenue_growth_percent'     => $revenueGrowth,
                    'total_bookings'             => $totalBookings,
                    'bookings_this_month'        => $bookingsThisMonth,
                    'bookings_growth_percent'    => $bookingGrowth,
                    'total_inquiries'            => $totalInquiries,
                    'new_inquiries'              => $newInquiries,
                    'active_packages'            => $activePackages,
                ],
                'status_breakdown'  => $statusBreakdown,
                'monthly_revenue'   => $monthlyRevenue,
                'recent_bookings'   => $recentBookings,
                'recent_inquiries'  => $recentInquiries,
            ],
        ]);
    }
}
