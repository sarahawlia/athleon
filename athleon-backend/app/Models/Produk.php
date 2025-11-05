<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';

    protected $fillable = [
        'idKategori',
        'nama',
        'deskripsi',
        'kategori',
        'jenisKelamin',
        'harga',
        'stok',
        'ukuran',
        'gambar',
    ];

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'idKategori');
    }
}
