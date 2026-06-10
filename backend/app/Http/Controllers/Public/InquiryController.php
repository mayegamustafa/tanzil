<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email',
            'phone'     => 'nullable|string',
            'subject'   => 'required|string|max:255',
            'message'   => 'required|string',
            'package_id'=> 'nullable|exists:packages,id',
        ]);
        return response()->json(['data' => Inquiry::create($data)], 201);
    }
}
