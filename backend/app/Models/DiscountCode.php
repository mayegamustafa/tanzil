<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class DiscountCode extends Model {
    protected $fillable = ['code','type','value','min_amount','max_uses','used_count','is_active','expires_at'];
    protected $casts = ['value'=>'decimal:2','is_active'=>'boolean','expires_at'=>'datetime','min_amount'=>'decimal:2'];
}
