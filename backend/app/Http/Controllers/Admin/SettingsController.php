<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $group = $request->query('group');
        $query = Setting::query();

        if ($group) {
            $query->where('group', $group);
        }

        return response()->json(['data' => $query->get()->keyBy('key')]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'settings'       => ['required', 'array'],
            'settings.*.key' => ['required', 'string'],
            'settings.*.value' => ['nullable'],
        ]);

        foreach ($request->settings as $item) {
            Setting::updateOrCreate(
                ['key' => $item['key']],
                ['value' => $item['value']]
            );
        }

        Cache::forget('settings');
        Cache::forget('public_settings');

        return response()->json(['message' => 'Settings updated successfully.']);
    }
}
