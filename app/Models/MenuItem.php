<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MenuCategory;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'price', 
        'description', 
        'category_id'
    ];

    // Relationship with Category
    public function category()
    {
        return $this->belongsTo(MenuCategory::class);
    }
}