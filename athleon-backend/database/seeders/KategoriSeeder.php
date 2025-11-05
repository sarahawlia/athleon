<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class KategoriSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $categories = [
            ['nama' => 'Pakaian', 'deskripsi' => 'Pakaian olahraga dan sehari-hari', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Sepatu', 'deskripsi' => 'Sepatu running dan casual', 'created_at' => $now, 'updated_at' => $now],
            ['nama' => 'Aksesoris', 'deskripsi' => 'Topi, tas, dan aksesoris lainnya', 'created_at' => $now, 'updated_at' => $now],
        ];

        DB::table('kategori')->insertOrIgnore($categories);
    }
}
