<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProdukController extends Controller
{
    // GET /api/produk
    public function index()
    {
        $products = DB::table('produk')->get();
        return response()->json($products);
    }

    // GET /api/produk/{id}
    public function show($id)
    {
        $product = DB::table('produk')->where('id', $id)->first();
        if (!$product) {
            return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        }
        return response()->json($product);
    }
}
