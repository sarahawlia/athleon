<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Produk;

class UpdateProductImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // store only the asset filename; frontend will map to local assets
        $map = [
            'Jersey Futsal Pro Elite' => 'category-futsal.jpg',
            'Padel Training Set' => 'category-padel.jpg',
            'Basketball Jersey Classic' => 'category-basket.jpg',
            'Pro Swimming Suit' => 'category-renang.jpg',
        ];

        foreach ($map as $name => $path) {
            $prod = Produk::where('nama', $name)->first();
            if ($prod) {
                $prod->gambar = $path;
                $prod->save();
                $this->command->info("Updated gambar for '{$name}' -> {$path}");
            } else {
                $this->command->warn("Product not found: {$name}");
            }
        }
    }
}
