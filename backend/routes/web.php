<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name'    => 'Tanzeel Travels API',
        'version' => '1.0.0',
        'status'  => 'running',
        'docs'    => [
            'public'  => url('/api'),
            'admin'   => url('/api/admin'),
            'auth'    => url('/api/auth/login'),
        ],
    ]);
});
