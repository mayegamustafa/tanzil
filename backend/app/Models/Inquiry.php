<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Inquiry extends Model {
    protected $fillable = ['name','email','phone','subject','message','package_id','status','notes'];
    public function package() { return $this->belongsTo(Package::class); }
}
