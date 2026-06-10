<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PackageInclusion extends Model {
    protected $fillable = ['package_id','type','title','icon'];
    public function package() { return $this->belongsTo(Package::class); }
}
