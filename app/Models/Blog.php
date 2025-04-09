<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

   
    protected $table = 'blogs';

    // Define which attributes are mass assignable
    protected $fillable = [
        'title',
        'description',
        'image',
    ];

  
}

