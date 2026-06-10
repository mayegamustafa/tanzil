<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request) {
        $data = $request->validate(['email' => 'required|email', 'name' => 'nullable|string']);
        NewsletterSubscriber::updateOrCreate(['email' => $data['email']], array_merge($data, ['is_active' => true, 'subscribed_at' => now()]));
        return response()->json(['message' => 'Subscribed successfully.']);
    }
}
