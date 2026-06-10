<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Testimonial extends Model {
    protected $fillable = ['name','location','avatar','content','rating','package_id','status'];
    protected $casts = ['rating'=>'integer'];
    public function package() { return $this->belongsTo(Package::class); }
}
