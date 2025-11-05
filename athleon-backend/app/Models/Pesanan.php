<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesanan extends Model
{
    use HasFactory;

    protected $table = 'pesanan';

    protected $fillable = [
        'user_id',
        'tanggal_pesanan',
        'total_harga',
        'status',
        'alamat_pengiriman',
        'metode_pembayaran',
        'metode_pengiriman',
    ];

    public function items()
    {
        return $this->hasMany(ItemPesanan::class, 'pesanan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
