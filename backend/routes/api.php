<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin;
use App\Http\Controllers\Public as Pub;

/*
|--------------------------------------------------------------------------
| Public routes (no auth)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});

Route::prefix('')->group(function () {
    Route::get('packages',          [Pub\PackageController::class, 'index']);
    Route::get('packages/{slug}',   [Pub\PackageController::class, 'show']);
    Route::post('bookings',         [Pub\BookingController::class, 'store']);
    Route::get('bookings/status/{reference}', [Pub\BookingController::class, 'status']);
    Route::get('blog',              [Pub\BlogController::class, 'index']);
    Route::get('blog/{slug}',       [Pub\BlogController::class, 'show']);
    Route::get('blog-categories',   [Pub\BlogController::class, 'categories']);
    Route::get('testimonials',      [Pub\TestimonialController::class, 'index']);
    Route::get('faqs',              [Pub\FaqController::class, 'index']);
    Route::get('gallery',           [Pub\GalleryController::class, 'index']);
    Route::post('inquiries',        [Pub\InquiryController::class, 'store']);
    Route::get('settings',          [Pub\SettingsController::class, 'index']);
    Route::post('newsletter',       [Pub\NewsletterController::class, 'subscribe']);
});

/*
|--------------------------------------------------------------------------
| Authenticated routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('me',     [AuthController::class, 'me']);
        Route::post('logout',[AuthController::class, 'logout']);
    });

    Route::prefix('admin')->middleware('role:admin,manager')->group(function () {
        Route::get('analytics',          [Admin\AnalyticsController::class, 'dashboard']);

        // Packages
        Route::get('packages',           [Admin\PackageController::class, 'index']);
        Route::post('packages',          [Admin\PackageController::class, 'store']);
        Route::get('packages/{id}',      [Admin\PackageController::class, 'show']);
        Route::put('packages/{id}',      [Admin\PackageController::class, 'update']);
        Route::delete('packages/{id}',   [Admin\PackageController::class, 'destroy']);
        Route::post('packages/{id}/restore', [Admin\PackageController::class, 'restore']);

        // Bookings
        Route::get('bookings',                       [Admin\BookingController::class, 'index']);
        Route::get('bookings/{id}',                  [Admin\BookingController::class, 'show']);
        Route::patch('bookings/{id}/status',         [Admin\BookingController::class, 'updateStatus']);
        Route::get('bookings/{id}/invoice',          [Admin\BookingController::class, 'generateInvoice']);
        Route::delete('bookings/{id}',               [Admin\BookingController::class, 'destroy']);

        // Blog
        Route::get('blog',                [Admin\BlogController::class, 'index']);
        Route::post('blog',               [Admin\BlogController::class, 'store']);
        Route::get('blog/{id}',           [Admin\BlogController::class, 'show']);
        Route::put('blog/{id}',           [Admin\BlogController::class, 'update']);
        Route::delete('blog/{id}',        [Admin\BlogController::class, 'destroy']);
        Route::get('blog-categories',     [Admin\BlogController::class, 'categories']);
        Route::post('blog-categories',    [Admin\BlogController::class, 'storeCategory']);

        // Settings
        Route::get('settings',            [Admin\SettingsController::class, 'index']);
        Route::put('settings',            [Admin\SettingsController::class, 'update']);

        // FAQs
        Route::get('faqs',                [Admin\FaqController::class, 'index']);
        Route::post('faqs',               [Admin\FaqController::class, 'store']);
        Route::put('faqs/reorder',        [Admin\FaqController::class, 'reorder']);
        Route::put('faqs/{id}',           [Admin\FaqController::class, 'update']);
        Route::delete('faqs/{id}',        [Admin\FaqController::class, 'destroy']);

        // Gallery
        Route::get('gallery',                         [Admin\GalleryController::class, 'index']);
        Route::post('gallery',                        [Admin\GalleryController::class, 'store']);
        Route::delete('gallery/{id}',                 [Admin\GalleryController::class, 'destroy']);
        Route::post('gallery/{albumId}/items',        [Admin\GalleryController::class, 'addItem']);
        Route::delete('gallery/items/{itemId}',       [Admin\GalleryController::class, 'destroyItem']);

        // Testimonials
        Route::get('testimonials',        [Admin\TestimonialController::class, 'index']);
        Route::post('testimonials',       [Admin\TestimonialController::class, 'store']);
        Route::put('testimonials/{id}',   [Admin\TestimonialController::class, 'update']);
        Route::delete('testimonials/{id}',[Admin\TestimonialController::class, 'destroy']);

        // Inquiries
        Route::get('inquiries',                   [Admin\InquiryController::class, 'index']);
        Route::get('inquiries/{id}',              [Admin\InquiryController::class, 'show']);
        Route::patch('inquiries/{id}/status',     [Admin\InquiryController::class, 'updateStatus']);
        Route::delete('inquiries/{id}',           [Admin\InquiryController::class, 'destroy']);

        // Users (admin only)
        Route::middleware('role:admin')->group(function () {
            Route::get('users',         [Admin\UserController::class, 'index']);
            Route::post('users',        [Admin\UserController::class, 'store']);
            Route::put('users/{id}',    [Admin\UserController::class, 'update']);
            Route::delete('users/{id}', [Admin\UserController::class, 'destroy']);
        });

        // Newsletter
        Route::get('newsletter',          [Admin\NewsletterController::class, 'index']);
        Route::delete('newsletter/{id}',  [Admin\NewsletterController::class, 'destroy']);
    });
});
