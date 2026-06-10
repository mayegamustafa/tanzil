<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GalleryItem extends Model {
    protected $fillable = ['gallery_id','url','thumbnail_url','caption','type','sort_order'];
    public function gallery() { return $this->belongsTo(Gallery::class); }
}
