import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { api } from "@/lib/api";
import futsalImg from "@/assets/category-futsal.jpg";
import padelImg from "@/assets/category-padel.jpg";
import basketImg from "@/assets/category-basket.jpg";
import renangImg from "@/assets/category-renang.jpg";

const backendBase = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  // read URL query params (e.g. /catalog?category=futsal&gender=pria)
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/produk")
      .then((res) => {
        if (!mounted) return;
        // map backend fields to frontend-friendly names
        const localProductImages: Record<string, string> = {
          'Jersey Futsal Pro Elite': futsalImg,
          'Padel Training Set': padelImg,
          'Basketball Jersey Classic': basketImg,
          'Pro Swimming Suit': renangImg,
        };

        const resolveImage = (p: any) => {
          const g = p.gambar;
          if (!g) return localProductImages[p.nama] ?? "";
          if (g.startsWith('http') || g.includes('/')) return `${backendBase}/${g}`;
          return localProductImages[p.nama] ?? `${backendBase}/images/products/${g}`;
        };
        const mapped = (res.data || []).map((p: any) => ({
          ...p,
          image: resolveImage(p),
          category: p.kategori ?? p.category ?? "",
          gender: p.jenisKelamin ?? p.gender ?? "",
          // normalize name/price/description/sizes for ProductCard and detail pages
          name: p.nama ?? p.name ?? "",
          price: Number(p.harga ?? p.price ?? 0),
          description: p.deskripsi ?? p.description ?? "",
          sizes: p.ukuran ? String(p.ukuran).split(",") : [],
        }));
        setProducts(mapped);
      })
      .catch(() => setProducts([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  // apply category/gender from URL query params so links from homepage pre-filter
  useEffect(() => {
    const cat = searchParams.get("category");
    const gender = searchParams.get("gender");
    if (cat) setSelectedCategory(String(cat).toLowerCase());
    if (gender) setSelectedGender(String(gender).toLowerCase());
  }, [searchParams]);

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" ||
      (product.category || "").toString().toLowerCase() === selectedCategory;
    const genderMatch =
      selectedGender === "all" || (product.gender || "").toString().toLowerCase() === selectedGender;
    return categoryMatch && genderMatch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Katalog Produk</h1>
          
          {/* Filters */}
          <div className="bg-card rounded-lg p-6 shadow-card mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filter</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Kategori</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="futsal">Futsal</SelectItem>
                    <SelectItem value="padel">Padel</SelectItem>
                    <SelectItem value="basket">Basket</SelectItem>
                    <SelectItem value="renang">Renang</SelectItem>
                    <SelectItem value="esport">Esport</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Jenis Kelamin</label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedGender("all");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-4">
            <p className="text-muted-foreground">
              Menampilkan {loading ? "..." : filteredProducts.length} produk
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Tidak ada produk yang ditemukan</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;
