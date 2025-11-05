<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pesanan;
use App\Models\ItemPesanan;
use App\Models\Keranjang;
use App\Models\ItemKeranjang;
use App\Models\Produk;
use Carbon\Carbon;

class PesananController extends Controller
{
    // POST /api/pesanan - create order from cart
    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $request->validate([
            'alamat_pengiriman' => 'required|string',
            'metode_pembayaran' => 'required|string',
            'metode_pengiriman' => 'required|string',
        ]);

        $cart = Keranjang::with('items')->where('user_id', $user->id)->first();
        if (!$cart || $cart->items->isEmpty()) return response()->json(['message' => 'Keranjang kosong'], 422);

        $pesanan = Pesanan::create([
            'user_id' => $user->id,
            'tanggal_pesanan' => Carbon::now(),
            'total_harga' => $cart->total_harga,
            'status' => 'Belum Dibayar',
            'alamat_pengiriman' => $request->input('alamat_pengiriman'),
            'metode_pembayaran' => $request->input('metode_pembayaran'),
            'metode_pengiriman' => $request->input('metode_pengiriman'),
        ]);

        foreach ($cart->items as $item) {
            $produk = Produk::find($item->produk_id);
            ItemPesanan::create([
                'pesanan_id' => $pesanan->id,
                'produk_id' => $item->produk_id,
                'jumlah' => $item->jumlah,
                'harga_satuan' => $produk ? $produk->harga : 0,
            ]);
        }

        // clear cart
        ItemKeranjang::where('keranjang_id', $cart->id)->delete();
        $cart->total_harga = 0;
        $cart->save();

        return response()->json($pesanan, 201);
    }

    // GET /api/pesanan - list user's orders
    public function index()
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $orders = Pesanan::with('items.produk')->where('user_id', $user->id)->orderBy('tanggal_pesanan', 'desc')->get();
        return response()->json($orders);
    }

    // GET /api/pesanan/{id}
    public function show($id)
    {
        $user = auth()->user();
        if (!$user) return response()->json(['message' => 'Unauthenticated'], 401);

        $order = Pesanan::with('items.produk')->find($id);
        if (!$order) return response()->json(['message' => 'Pesanan not found'], 404);
        if ($order->user_id !== $user->id && ($user->role ?? '') !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return response()->json($order);
    }

    // PUT /api/pesanan/{id}/status - admin only
    public function updateStatus(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user || ($user->role ?? '') !== 'admin') return response()->json(['message' => 'Forbidden'], 403);

        $request->validate(['status' => 'required|string']);
        $order = Pesanan::find($id);
        if (!$order) return response()->json(['message' => 'Pesanan not found'], 404);

        $order->status = $request->input('status');
        $order->save();
        return response()->json($order);
    }
}
