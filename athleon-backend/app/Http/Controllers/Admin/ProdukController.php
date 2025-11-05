<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Produk;
use App\Models\Kategori;
use Illuminate\Support\Facades\Validator;

class ProdukController extends Controller
{
    public function index()
    {
        $produk = Produk::with('kategori')->orderBy('id', 'desc')->get();
        return response()->json($produk);
    }

    public function show($id)
    {
        $p = Produk::with('kategori')->find($id);
        if (!$p) return response()->json(['message' => 'Produk not found'], 404);
        return response()->json($p);
    }

    public function store(Request $request)
    {
        $data = $request->only(['idKategori','nama','deskripsi','kategori','jenisKelamin','harga','stok','ukuran']);

        $validator = Validator::make($data, [
            'idKategori' => 'required|integer|exists:kategori,id',
            'nama' => 'required|string|max:255',
            'harga' => 'required|numeric',
            'stok' => 'nullable|integer',
        ]);

        // validate image if provided
        if ($request->hasFile('gambar')) {
            $fileValidator = Validator::make($request->all(), [
                'gambar' => 'file|image|max:5120',
            ]);
            if ($fileValidator->fails()) {
                return response()->json(['errors' => $fileValidator->errors()], 422);
            }
        }

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // handle image upload: save to public/images/products
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file->getClientOriginalName());
            $dest = public_path('images/products');
            if (!file_exists($dest)) {
                mkdir($dest, 0755, true);
            }
            $file->move($dest, $filename);
            $data['gambar'] = 'images/products/' . $filename;
        }

        $produk = Produk::create($data);
        return response()->json($produk, 201);
    }

    public function update(Request $request, $id)
    {
        $p = Produk::find($id);
        if (!$p) return response()->json(['message' => 'Produk not found'], 404);

        $data = $request->only(['idKategori','nama','deskripsi','kategori','jenisKelamin','harga','stok','ukuran']);

        $validator = Validator::make($data, [
            'idKategori' => 'sometimes|required|integer|exists:kategori,id',
            'nama' => 'sometimes|required|string|max:255',
            'harga' => 'sometimes|required|numeric',
            'stok' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // handle new image upload
        if ($request->hasFile('gambar')) {
            $fileValidator = Validator::make($request->all(), [
                'gambar' => 'file|image|max:5120',
            ]);
            if ($fileValidator->fails()) {
                return response()->json(['errors' => $fileValidator->errors()], 422);
            }

            // delete old image if exists
            if ($p->gambar && file_exists(public_path($p->gambar))) {
                @unlink(public_path($p->gambar));
            }

            $file = $request->file('gambar');
            $filename = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $file->getClientOriginalName());
            $dest = public_path('images/products');
            if (!file_exists($dest)) {
                mkdir($dest, 0755, true);
            }
            $file->move($dest, $filename);
            $data['gambar'] = 'images/products/' . $filename;
        }

        $p->update($data);
        return response()->json($p);
    }

    public function destroy($id)
    {
        $p = Produk::find($id);
        if (!$p) return response()->json(['message' => 'Produk not found'], 404);
        $p->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
