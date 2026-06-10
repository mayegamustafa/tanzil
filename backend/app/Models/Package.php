<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Package extends Model {
    use SoftDeletes;
    protected $fillable = ['type','title','title_ar','slug','excerpt','excerpt_ar','description','description_ar','thumbnail','gallery','pricing','hotels','flights','departure_date','return_date','duration_days','seats_total','seats_booked','is_featured','status','departure_city','base_price','currency','brochure_url','seo_title','seo_description','created_by'];
    protected $casts = ['gallery'=>'array','pricing'=>'array','hotels'=>'array','flights'=>'array','is_featured'=>'boolean','departure_date'=>'date','return_date'=>'date'];
    public function itineraries() { return $this->hasMany(PackageItinerary::class)->orderBy('day_number'); }
    public function inclusions()  { return $this->hasMany(PackageInclusion::class); }
    public function bookings()    { return $this->hasMany(Booking::class); }
    public function tiers()       { return $this->hasMany(PackageTier::class); }
    public function getSeatAvailableAttribute(): int { return max(0, $this->seats_total - $this->seats_booked); }
    public function scopePublished($query) { return $query->where('status', 'published'); }
    public function scopeFeatured($query) { return $query->where('is_featured', true); }
}
