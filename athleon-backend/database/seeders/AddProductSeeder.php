<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kategori;
use App\Models\Produk;

class AddProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create or find category
        $kat = Kategori::firstOrCreate(
            ['nama' => 'Futsal'],
            ['deskripsi' => 'Kategori Futsal']
        );

        // check if a product with same name exists
        // prepare categories we need
        $cats = ['Futsal', 'Padel', 'Basket', 'Renang'];
        $catMap = [];
        foreach ($cats as $cname) {
            $c = Kategori::firstOrCreate(['nama' => $cname], ['deskripsi' => "$cname kategori"]);
            $catMap[$cname] = $c->id;
        }

        $products = [
            [
                'nama' => 'Jersey Futsal Pro Elite',
                'deskripsi' => 'Jersey berkualitas tinggi, breathable dan ringan untuk performa maksimal.',
                'kategori' => 'Futsal',
                'jenisKelamin' => 'Pria',
                'harga' => 299000,
                'stok' => 50,
                'ukuran' => 'S,M,L,XL',
                'gambar' => null,
            ],
            [
                'nama' => 'Padel Training Set',
                'deskripsi' => 'Set latihan padel lengkap untuk latihan dan pertandingan.',
                'kategori' => 'Padel',
                'jenisKelamin' => 'Unisex',
                'harga' => 459000,
                'stok' => 30,
                'ukuran' => 'S,M,L,XL',
                'gambar' => null,
            ],
            [
                'nama' => 'Basketball Jersey Classic',
                'deskripsi' => 'Jersey basket klasik dengan bahan yang nyaman dan tahan lama.',
                'kategori' => 'Basket',
                'jenisKelamin' => 'Unisex',
                'harga' => 349000,
                'stok' => 40,
                'ukuran' => 'S,M,L,XL',
                'gambar' => null,
            ],
            [
                'nama' => 'Pro Swimming Suit',
                'deskripsi' => 'Baju renang profesional dengan material anti-klorin dan cepat kering.',
                'kategori' => 'Renang',
                'jenisKelamin' => 'Unisex',
                'harga' => 399000,
                'stok' => 25,
                'ukuran' => 'S,M,L,XL',
                'gambar' => null,
            ],
        ];

        foreach ($products as $p) {
            $exists = Produk::where('nama', $p['nama'])->first();
            if ($exists) {
                $this->command->info("Product '{$p['nama']}' already exists, skipping.");
                continue;
            }

            Produk::create([
                'idKategori' => $catMap[$p['kategori']] ?? null,
                'nama' => $p['nama'],
                'deskripsi' => $p['deskripsi'],
                'kategori' => $p['kategori'],
                'jenisKelamin' => $p['jenisKelamin'],
                'harga' => $p['harga'],
                'stok' => $p['stok'],
                'ukuran' => $p['ukuran'],
                'gambar' => $p['gambar'],
            ]);

            $this->command->info("Product '{$p['nama']}' created.");
        }
    }
}
