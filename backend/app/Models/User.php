<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable {
    use HasFactory, Notifiable, HasApiTokens;
    protected $fillable = ['name','email','password','role','is_active'];
    protected $hidden   = ['password','remember_token'];
    protected function casts(): array { return ['email_verified_at'=>'datetime','password'=>'hashed','is_active'=>'boolean']; }
    public function isAdmin(): bool { return $this->role === 'admin'; }
    public function isManager(): bool { return in_array($this->role,['admin','manager']); }
    public function bookings() { return $this->hasMany(Booking::class,'created_by'); }
    public function blogPosts() { return $this->hasMany(BlogPost::class,'author_id'); }
}
