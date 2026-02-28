<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Kita pakai 'nama' saja biar simpel
            $table->string('nama_produk')->nullable(); // Tetap ada buat jaga-jaga
            $table->enum('jenis', ['kasur', 'lemari', 'kursi', 'rak piring']);
            $table->integer('harga');
            $table->string('warna');
            $table->integer('stok');
            $table->date('tanggal_masuk');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};