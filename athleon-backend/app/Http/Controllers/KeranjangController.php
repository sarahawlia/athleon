<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Keranjang;
use App\Models\ItemKeranjang;
use App\Models\Produk;

class KeranjangController extends Controller
{
    // GET /api/keranjang
    public function index(Request $request)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $cart = Keranjang::with(['items.produk'])->firstOrCreate([
            'user_id' => $user->id,
        ], ['total_harga' => 0]);

        return response()->json($cart);
    }

    // POST /api/keranjang - add item
    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $data = $request->only(['produk_id', 'jumlah']);
        $request->validate(["produk_id" => 'required|integer|exists:produk,id', 'jumlah' => 'required|integer|min:1']);

        $produk = Produk::find($data['produk_id']);
        if (!$produk) return response()->json(['message' => 'Produk not found'], 404);
        if ($produk->stok !== null && $produk->stok < $data['jumlah']) {
            return response()->json(['message' => 'Stok tidak cukup'], 422);
        }

        $cart = Keranjang::firstOrCreate(['user_id' => $user->id], ['total_harga' => 0]);

        $subtotal = $produk->harga * $data['jumlah'];
        $item = ItemKeranjang::create([
            'keranjang_id' => $cart->id,
            'produk_id' => $produk->id,
            'jumlah' => $data['jumlah'],
            'subtotal' => $subtotal,
        ]);

        $cart->total_harga = ($cart->total_harga ?? 0) + $subtotal;
        $cart->save();

        return response()->json($item, 201);
    }

    // PUT /api/keranjang/{id} - update item quantity
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $request->validate(['jumlah' => 'required|integer|min:1']);

        $item = ItemKeranjang::find($id);
        if (!$item) return response()->json(['message' => 'Item tidak ditemukan'], 404);

        // ensure item belongs to user's cart
        $cart = Keranjang::find($item->keranjang_id);
        if (!$cart || $cart->user_id !== $user->id) return response()->json(['message' => 'Forbidden'], 403);

        $produk = Produk::find($item->produk_id);
        if (!$produk) return response()->json(['message' => 'Produk tidak ditemukan'], 404);

        $oldSubtotal = $item->subtotal;
        $item->jumlah = $request->input('jumlah');
        $item->subtotal = $produk->harga * $item->jumlah;
        $item->save();

        // update cart total
        $cart->total_harga = ($cart->total_harga - $oldSubtotal) + $item->subtotal;
        $cart->save();

        return response()->json($item);
    }

    // DELETE /api/keranjang/{id}
    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $item = ItemKeranjang::find($id);
        if (!$item) return response()->json(['message' => 'Item tidak ditemukan'], 404);

        $cart = Keranjang::find($item->keranjang_id);
        if (!$cart || $cart->user_id !== $user->id) return response()->json(['message' => 'Forbidden'], 403);

        $cart->total_harga = max(0, ($cart->total_harga - $item->subtotal));
        $cart->save();

        $item->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
