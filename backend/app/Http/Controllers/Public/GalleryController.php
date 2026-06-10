<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Gallery;

class GalleryController extends Controller
{
    public function index() {
        return response()->json(['data' => Gallery::with('items')->where('is_active',true)->get()]);
    }
}
