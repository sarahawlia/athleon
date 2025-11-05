<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\http\Request;
// product public controller
use App\Http\Controllers\Admin\ProdukController as AdminProdukController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\PesananController;

Route::group(['middleware' => 'api', 'prefix' => 'auth'], function ($router) {
    Route::post('register', [AuthController::class,'register']);
    Route::post('login', [AuthController::class,'login']);
    Route::post('logout', [AuthController::class,'logout']);
    Route::post('refresh', [AuthController::class,'refresh']);
    Route::post('me', [AuthController::class,'me']);
});

// Product routes
Route::get('produk', [ProdukController::class, 'index']);
Route::get('produk/{id}', [ProdukController::class, 'show']);

// Admin product CRUD (protected by auth:api)
Route::group(['prefix' => 'admin', 'middleware' => 'auth:api'], function () {
    Route::get('produk', [AdminProdukController::class, 'index']);
    Route::post('produk', [AdminProdukController::class, 'store']);
    Route::get('produk/{id}', [AdminProdukController::class, 'show']);
    Route::put('produk/{id}', [AdminProdukController::class, 'update']);
    Route::delete('produk/{id}', [AdminProdukController::class, 'destroy']);
});

// Kategori (public)
Route::get('kategori', [KategoriController::class, 'index']);

// Keranjang & Pesanan (requires auth)
Route::group(['middleware' => 'auth:api'], function () {
    // keranjang
    Route::get('keranjang', [KeranjangController::class, 'index']);
    Route::post('keranjang', [KeranjangController::class, 'store']);
    Route::put('keranjang/{id}', [KeranjangController::class, 'update']);
    Route::delete('keranjang/{id}', [KeranjangController::class, 'destroy']);

    // pesanan
    Route::post('pesanan', [PesananController::class, 'store']);
    Route::get('pesanan', [PesananController::class, 'index']);
    Route::get('pesanan/{id}', [PesananController::class, 'show']);
    Route::put('pesanan/{id}/status', [PesananController::class, 'updateStatus']);
});
