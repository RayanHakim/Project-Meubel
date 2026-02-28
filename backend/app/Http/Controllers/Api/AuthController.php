<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // 1. FITUR REGISTER
    public function register(Request $request) 
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:3',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user', 
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Registrasi Berhasil! Silakan Login.',
            'user' => $user
        ], 201);
    }

    // 2. FITUR LOGIN (FIXED: Mengambil Role dari DB)
    public function login(Request $request)
    {
        $user = User::where('name', $request->username)
                    ->orWhere('email', $request->username)
                    ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username/Email atau Password salah!'
            ], 401);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Login Berhasil',
            'token' => 'token-meubel-' . $user->id,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'role' => $user->role // Mengambil role asli dari database (admin/user)
            ]
        ]);
    }

    // 3. FITUR MANAJEMEN USER: Ambil Semua User (Untuk Admin)
    public function getAllUsers()
    {
        // Mengambil semua user kecuali dirinya sendiri (opsional)
        $users = User::where('role', '!=', 'admin')->get();
        return response()->json($users);
    }

    // 4. FITUR MANAJEMEN USER: Hapus User (Untuk Admin)
    public function deleteUser($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User berhasil dihapus']);
        }
        return response()->json(['message' => 'User tidak ditemukan'], 404);
    }
}