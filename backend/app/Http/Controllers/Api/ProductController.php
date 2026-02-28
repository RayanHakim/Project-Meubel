<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Tambahkan ini untuk urusan hapus file

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    public function store(Request $request)
    {
        // 1. Validasi Data (Tambahkan validasi image)
        $request->validate([
            'nama'          => 'required|string',
            'jenis'         => 'required|in:kasur,lemari,kursi,rak piring',
            'harga'         => 'required|integer',
            'warna'         => 'required|string',
            'stok'          => 'required|integer',
            'tanggal_masuk' => 'nullable|date',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg|max:2048' // Validasi file gambar
        ]);

        $data = $request->all();
        
        // Sinkronisasi nama_produk & tanggal
        if (!$request->has('nama_produk')) { $data['nama_produk'] = $request->nama; }
        if (!$request->filled('tanggal_masuk')) { $data['tanggal_masuk'] = now()->format('Y-m-d'); }

        // LOGIKA UPLOAD GAMBAR
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->storeAs('public/products', $image->hashName()); // Simpan ke storage/app/public/products
            $data['image'] = $image->hashName(); // Simpan nama file acak ke DB
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function show($id)
    {
        return response()->json(Product::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->all();
        
        if ($request->has('nama')) { $data['nama_produk'] = $request->nama; }

        // LOGIKA UPDATE GAMBAR
        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image) {
                Storage::delete('public/products/' . $product->image);
            }
            // Simpan gambar baru
            $image = $request->file('image');
            $image->storeAs('public/products', $image->hashName());
            $data['image'] = $image->hashName();
        }

        $product->update($data);
        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        if ($product->image) {
            Storage::delete('public/products/' . $product->image);
        }

        $product->delete();
        return response()->json(['message' => 'Barang berhasil dihapus']);
    }
}