<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ProdukSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // Get kategori ids (assumes KategoriSeeder already ran)
        $pakaian = DB::table('kategori')->where('nama', 'Pakaian')->value('id') ?: 1;
        $sepatu = DB::table('kategori')->where('nama', 'Sepatu')->value('id') ?: 2;
        $aksesoris = DB::table('kategori')->where('nama', 'Aksesoris')->value('id') ?: 3;

        $products = [
            [
                'idKategori' => $pakaian,
                'nama' => 'Kaos Olahraga Basic',
                'deskripsi' => 'Kaos breathable untuk aktivitas olahraga.',
                'kategori' => 'Pakaian',
                'jenisKelamin' => 'Unisex',
                'harga' => 75000,
                'stok' => 50,
                'ukuran' => 'S,M,L,XL',
                'gambar' => 'images/products/kaos_basic.jpg',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'idKategori' => $sepatu,
                'nama' => 'Sepatu Lari Swift',
                'deskripsi' => 'Ringan dan nyaman untuk lari jarak jauh.',
                'kategori' => 'Sepatu',
                'jenisKelamin' => 'Unisex',
                'harga' => 450000,
                'stok' => 30,
                'ukuran' => '39,40,41,42,43',
                'gambar' => 'images/products/sepatu_swift.jpg',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'idKategori' => $aksesoris,
                'nama' => 'Topi Trucker',
                'deskripsi' => 'Topi kasual dengan ventilasi untuk aktivitas outdoor.',
                'kategori' => 'Aksesoris',
                'jenisKelamin' => 'Unisex',
                'harga' => 90000,
                'stok' => 100,
                'ukuran' => 'One Size',
                'gambar' => 'images/products/topi_trucker.jpg',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        DB::table('produk')->insertOrIgnore($products);
    }
}
