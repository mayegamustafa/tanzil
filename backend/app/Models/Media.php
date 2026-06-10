<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Media extends Model {
    protected $fillable = ['name','file_name','mime_type','path','url','size','disk','uploaded_by'];
    protected $casts = ['size'=>'integer'];
    public function uploader() { return $this->belongsTo(User::class,'uploaded_by'); }
}
