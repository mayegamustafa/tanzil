<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index() {
        return response()->json(['data' => Testimonial::where('status','approved')->latest()->get()]);
    }
}
