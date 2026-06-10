<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class BookingPassenger extends Model {
    protected $fillable = ['booking_id','full_name','passport_number','nationality','date_of_birth','gender','is_lead'];
    protected $casts = ['is_lead'=>'boolean','date_of_birth'=>'date'];
    public function booking() { return $this->belongsTo(Booking::class); }
}
