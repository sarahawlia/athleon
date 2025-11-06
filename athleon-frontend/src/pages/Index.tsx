import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

const backendBase = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";
import heroBanner from "@/assets/hero-banner.jpg";
import futsalImg from "@/assets/category-futsal.jpg";
import padelImg from "@/assets/category-padel.jpg";
import basketImg from "@/assets/category-basket.jpg";
import renangImg from "@/assets/category-renang.jpg";
import esportImg from "@/assets/category-esport.jpg";
import badmintonImg from "@/assets/category-badminton.jpg";

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);

  // local asset map for category images (fall back when DB doesn't provide images)
  const categoryImages: Record<string, string> = {
    futsal: futsalImg,
    padel: padelImg,
    basket: basketImg,
    renang: renangImg,
    esport: esportImg,
    badminton: badmintonImg,
  };

  useEffect(() => {
    let mounted = true;
    api
      .get('/kategori')
      .then((res) => {
        if (!mounted) return;
        const mapped = (res.data || []).map((k: any) => {
          const name = k.nama ?? k.name ?? '';
          const slug = String(name).toLowerCase().replace(/\s+/g, '-');
          const img = categoryImages[slug] ?? esportImg;
          return { name, image: img, slug };
        });

        // ensure badminton and esport are present on the homepage even if DB lacks them
        const defaults = [
          { name: 'Esport', slug: 'esport', image: categoryImages['esport'] },
          { name: 'Badminton', slug: 'badminton', image: categoryImages['badminton'] },
        ];

        // merge while preserving DB categories first, then add missing defaults
        const slugs = new Set(mapped.map((c: any) => c.slug));
        for (const d of defaults) {
          if (!slugs.has(d.slug)) mapped.push(d as any);
        }

        setCategories(mapped);
      })
      .catch(() => setCategories([]));
    return () => {
      mounted = false;
    };
  }, []);

  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // local product image map (use local assets when backend doesn't have gambar)
  const localProductImages: Record<string, string> = {
    'Jersey Futsal Pro Elite': futsalImg,
    'Padel Training Set': padelImg,
    'Basketball Jersey Classic': basketImg,
    'Pro Swimming Suit': renangImg,
  };

  useEffect(() => {
    let mounted = true;
    setLoadingProducts(true);
    api
      .get('/produk')
      .then((res) => {
        if (!mounted) return;
        const resolveImage = (p: any) => {
          const g = p.gambar;
          // if empty, use local mapping
          if (!g) return localProductImages[p.nama] ?? "";
          // if already a path or url, use backendBase + path
          if (g.startsWith('http') || g.includes('/')) return `${backendBase}/${g}`;
          // bare filename: prefer local asset mapping, otherwise assume backend will serve under /images/products/
          return localProductImages[p.nama] ?? `${backendBase}/images/products/${g}`;
        };

        const mapped = (res.data || []).map((p: any) => ({
          ...p,
          // resolve image using helper
          image: resolveImage(p),
          category: p.kategori ?? p.category ?? "",
          name: p.nama ?? p.name ?? "",
          price: Number(p.harga ?? p.price ?? 0),
          description: p.deskripsi ?? p.description ?? "",
          sizes: p.ukuran ? String(p.ukuran).split(',') : [],
        }));
  // use products from DB (show all returned products)
  setBestSellers(mapped);
      })
      .catch(() => setBestSellers([]))
      .finally(() => mounted && setLoadingProducts(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img 
            src={heroBanner} 
            alt="Sports apparel collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                  Koleksi Pakaian Sport Terbaru
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
                  Kualitas terbaik untuk performa maksimal di setiap olahraga
                </p>
                <Link to="/catalog">
                  <Button size="lg" variant="secondary">
                    Belanja Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Kategori Olahraga</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/catalog?category=${category.slug}`}
                  className="group block"
                >
                  <div className="w-full aspect-square overflow-hidden rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="block w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-center mt-3 font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Produk Terlaris</h2>
              <Link to="/catalog">
                <Button variant="outline">Lihat Semua</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loadingProducts ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))
                ) : (
                  bestSellers.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))
                )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Siap Untuk Meningkatkan Performa?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Dapatkan pakaian olahraga berkualitas tinggi dengan harga terbaik
            </p>
            <Link to="/catalog">
              <Button size="lg" variant="secondary">
                Mulai Belanja
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
