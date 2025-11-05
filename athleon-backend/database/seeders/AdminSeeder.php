<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    /**
     * Jalankan seeder ini.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@athleon.com',
            'password' => Hash::make('admin123'), // jangan lupa di-hash!
            'role' => 'admin',
            'telepon' => '08123456789',
            'alamat' => 'Jakarta',
            'jenis_kelamin' => 'Laki-laki',
        ]);
    }
}
