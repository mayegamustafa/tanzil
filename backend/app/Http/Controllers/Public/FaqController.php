<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index() {
        return response()->json(['data' => Faq::where('is_active',true)->orderBy('sort_order')->get()]);
    }
}
