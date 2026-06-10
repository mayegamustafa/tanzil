<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PackageItinerary extends Model {
    protected $fillable = ['package_id','day_number','title','description','location','meals','accommodation'];
    protected $table = 'package_itineraries';
    public function package() { return $this->belongsTo(Package::class); }
}
