<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Language extends Model {
    protected $fillable = ['code','name','native_name','is_default','is_active','direction'];
    protected $casts = ['is_default'=>'boolean','is_active'=>'boolean'];
    public function translations() { return $this->hasMany(Translation::class); }
}
