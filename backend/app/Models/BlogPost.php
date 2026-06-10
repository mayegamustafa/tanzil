<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class BlogPost extends Model {
    use SoftDeletes;
    protected $fillable = ['category_id','author_id','title','title_ar','slug','excerpt','excerpt_ar','content','content_ar','featured_image','status','tags','seo_title','seo_description','published_at'];
    protected $casts = ['tags'=>'array','published_at'=>'datetime'];
    public function category() { return $this->belongsTo(BlogCategory::class,'category_id'); }
    public function author()   { return $this->belongsTo(User::class,'author_id'); }
    public function scopePublished($query) { return $query->where('status', 'published'); }
}
