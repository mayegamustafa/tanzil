<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Gallery extends Model {
    protected $fillable = ['name','slug','description','cover_image','is_active'];
    protected $casts = ['is_active'=>'boolean'];
    public function items() { return $this->hasMany(GalleryItem::class)->orderBy('sort_order'); }
}
