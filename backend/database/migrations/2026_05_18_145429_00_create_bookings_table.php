<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique(); // TZ-2024-00001
            $table->foreignId('package_id')->constrained()->restrictOnDelete();
            $table->string('tier')->default('standard'); // economy|standard|vip|family
            $table->string('lead_name');
            $table->string('email');
            $table->string('phone');
            $table->unsignedInteger('num_passengers')->default(1);
            $table->string('booking_status')->default('pending');
            $table->string('payment_status')->default('unpaid');
            $table->string('payment_method')->nullable();
            $table->string('payment_proof')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('currency', 5)->default('USD');
            $table->string('invoice_url')->nullable();
            $table->string('discount_code')->nullable();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->text('special_requests')->nullable();
            $table->text('admin_notes')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
