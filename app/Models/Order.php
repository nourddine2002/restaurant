<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = ['table_id', 'user_id', 'status'];
    public function table() {
        return $this->belongsTo(Table::class);
    }
    public function user() {
        return $this->belongsTo(User::class);
    }
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }
    public function payment() {
        return $this->hasOne(Payment::class);
    }
}
