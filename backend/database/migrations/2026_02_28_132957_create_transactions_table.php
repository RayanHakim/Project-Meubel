<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            
            // Menghubungkan ke ID User (pembeli)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Menghubungkan ke ID Produk (barang)
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            $table->integer('jumlah'); // Berapa banyak yang dibeli
            $table->bigInteger('total_harga'); // Harga x Jumlah
            $table->string('status')->default('selesai'); // Status transaksi
            
            $table->timestamps(); // Mencatat created_at (waktu transaksi)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};