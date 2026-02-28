<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama', 
        'nama_produk', 
        'jenis', 
        'harga', 
        'warna', 
        'stok', 
        'tanggal_masuk',
        'image' 
    ];
}