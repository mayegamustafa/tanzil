<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Booking extends Model {
    protected $fillable = ['package_id','package_tier_id','reference_number','contact_name','contact_email','contact_phone','status','total_amount','amount_paid','currency','special_requests','payment_status','payment_reference','notes','created_by'];
    protected $casts = ['total_amount'=>'decimal:2','amount_paid'=>'decimal:2'];
    public function package()    { return $this->belongsTo(Package::class); }
    public function passengers() { return $this->hasMany(BookingPassenger::class); }
    public function creator()    { return $this->belongsTo(User::class,'created_by'); }
    protected static function booted() {
        static::creating(function ($booking) {
            if (!$booking->reference_number) {
                $booking->reference_number = 'TZ-'.date('Y').'-'.str_pad(random_int(1,99999),5,'0',STR_PAD_LEFT);
            }
        });
    }
}
