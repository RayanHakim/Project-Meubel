<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Admin
        User::factory()->create([
            'name' => 'Admin Meubel',
            'email' => 'admin@meubel.com',
            'password' => bcrypt('password123'),
        ]);

        // 2. Panggil Seeder Produk
        // Laravel otomatis tahu lokasinya kalau di dalam satu folder
        $this->call([
            ProductSeeder::class,
        ]);
    }
}