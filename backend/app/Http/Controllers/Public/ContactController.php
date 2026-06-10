<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function inquiry(Request $request): JsonResponse
    {
        $request->validate([
            'name'       => ['required', 'string', 'max:100'],
            'email'      => ['required', 'email'],
            'phone'      => ['nullable', 'string', 'max:30'],
            'package_id' => ['nullable', 'exists:packages,id'],
            'message'    => ['required', 'string', 'max:2000'],
        ]);

        Inquiry::create(array_merge($request->only('name', 'email', 'phone', 'package_id', 'message'), ['status' => 'new']));

        return response()->json(['message' => 'Your inquiry has been received. We will contact you shortly.'], 201);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'name'  => ['nullable', 'string', 'max:100'],
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $request->email],
            ['name' => $request->name, 'status' => 'subscribed', 'subscribed_at' => now()]
        );

        return response()->json(['message' => 'Subscribed successfully.'], 201);
    }
}
