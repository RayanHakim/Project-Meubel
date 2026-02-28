<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    // 1. Ambil Semua Riwayat Transaksi (Untuk Admin)
    public function index()
    {
        // Mengambil data transaksi beserta detail User dan Product-nya
        $transactions = Transaction::with(['user', 'product'])->latest()->get();
        return response()->json($transactions);
    }

    // 2. Simpan Transaksi Baru (Saat User klik 'Beli')
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'user_id'    => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'jumlah'     => 'required|integer|min:1',
        ]);

        // Cari produknya
        $product = Product::findOrFail($request->product_id);

        // CEK STOK: Jangan sampai minus
        if ($product->stok < $request->jumlah) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Maaf, stok barang tidak mencukupi!'
            ], 400);
        }

        // Jalankan Transaksi Database (Atomic)
        return DB::transaction(function () use ($request, $product) {
            // A. Catat Riwayat Transaksi
            $transaction = Transaction::create([
                'user_id'     => $request->user_id,
                'product_id'  => $request->product_id,
                'jumlah'      => $request->jumlah,
                'total_harga' => $product->harga * $request->jumlah,
                'status'      => 'selesai'
            ]);

            // B. POTONG STOK PRODUK
            $product->decrement('stok', $request->jumlah);

            return response()->json([
                'status'      => 'success',
                'message'     => 'Transaksi berhasil! Stok telah diperbarui.',
                'transaction' => $transaction
            ], 201);
        });
    }

    // 3. Ambil Riwayat Milik User Tertentu (Untuk History User)
    public function userHistory($userId)
    {
        $history = Transaction::with('product')
                    ->where('user_id', $userId)
                    ->latest()
                    ->get();
        return response()->json($history);
    }
}