<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product; // Pastikan ini terpanggil

class ProductSeeder extends Seeder
{
    public function run(): void
{
    Product::create([
        'nama_produk' => 'Kasur Springbed King Size',
        'deskripsi' => 'Kasur ukuran king size, empuk dan nyaman',
        'harga' => 4500000,
        'stok' => 5
    ]);

    Product::create([
        'nama_produk' => 'Lemari Jati 3 Pintu',
        'deskripsi' => 'Lemari kayu jati premium 3 pintu',
        'harga' => 3000000,
        'stok' => 2
    ]);
}
}