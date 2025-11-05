<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategori;

class KategoriController extends Controller
{
    // public list of categories
    public function index()
    {
        $k = Kategori::orderBy('id')->get();
        return response()->json($k);
    }
}
