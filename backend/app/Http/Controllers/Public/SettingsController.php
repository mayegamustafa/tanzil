<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function public(): JsonResponse
    {
        $data = Cache::remember('public_settings', 3600, fn () => Setting::publicSettings());
        return response()->json(['data' => $data]);
    }
}
