<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // LOGIN
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau Password salah'
            ], 401);
        }

        $user = auth('api')->setToken($token)->user();

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user
        ]);
    }

    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'email'             => 'required|email|unique:users,email',
            'telepon'           => 'required|string|max:20',
            'alamat'            => 'required|string|max:255',
            'jenis_kelamin'     => 'required|in:Laki-laki,Perempuan',
            'password'          => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name'          => $request->name,
            'email'         => $request->email,
            'telepon'       => $request->telepon,
            'alamat'        => $request->alamat,
            'jenis_kelamin' => $request->jenis_kelamin,
            'password'      => bcrypt($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Register berhasil',
            'user' => $user
        ], 201);
    }

    // PROFILE (hanya bisa diakses kalau sudah login JWT)
    public function profile()
    {
        return response()->json([
            'success' => true,
            'user' => auth()->user()
        ]);
    }


    // ME
    public function me(Request $request)
    {
        try {
            // Ambil token dari Authorization header atau query ?token=
            $token = $request->bearerToken() ?? $request->query('token');

            if (!$token) {
                return response()->json(['success' => false, 'message' => 'Token tidak ditemukan'], 400);
            }

            // Set token dan ambil user berdasarkan token JWT
            $user = auth('api')->setToken($token)->user();

            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Token tidak valid'], 401);
            }

            return response()->json($user);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['message' => 'Token sudah kadaluarsa'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['message' => 'Token tidak valid'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan', 'error' => $e->getMessage()], 500);
        }
    }

    // LOGOUT
    public function logout(Request $request)
    {
        try {
            // Ambil token dari Authorization header ATAU query param
            $token = $request->bearerToken() ?? $request->query('token');

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token tidak ditemukan. Kirim lewat Authorization header atau ?token='
                ], 400);
            }

            // Invalidate token
            auth('api')->setToken($token)->invalidate();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil logout, token telah diinvalidasi.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal logout: ' . $e->getMessage()
            ], 500);
        }
    }



}
