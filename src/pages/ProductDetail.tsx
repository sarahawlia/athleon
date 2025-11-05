import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

const backendBase = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Ambil produk berdasarkan ID URL dari API
  useEffect(() => {
    let mounted = true;
    if (!id) return;
    setLoading(true);
    api
      .get(`/produk/${id}`)
      .then((res) => {
        if (!mounted) return;
        const p = res.data;
        if (p) {
          const mapped = {
            ...p,
            image: p.gambar ? `${backendBase}/${p.gambar}` : "",
            category: p.kategori ?? p.category ?? "",
            // normalize fields coming from backend
            name: p.nama ?? p.name ?? "",
            description: p.deskripsi ?? p.description ?? "",
            price: Number(p.harga ?? p.price ?? 0),
            sizes: p.ukuran ? String(p.ukuran).split(",") : [],
          };
          setProduct(mapped);
        } else {
          setProduct(null);
        }
      })
      .catch(() => setProduct(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">Loading...</main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Produk tidak ditemukan.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Silakan pilih ukuran terlebih dahulu");
      return;
    }
    toast.success("Produk berhasil ditambahkan ke keranjang!");
  };

  const relatedProducts = products.filter((p) => p.id !== product.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Beranda
            </Link>{" "}
            /{" "}
            <Link to="/catalog" className="hover:text-foreground">
              Katalog
            </Link>{" "}
            /{" "}
            <Link
              to={`/catalog?category=${product.category.toLowerCase()}`}
              className="hover:text-foreground"
            >
              {product.category}
            </Link>{" "}
            / <span className="text-foreground">{product.name}</span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2">{product.category}</Badge>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-3xl font-bold text-primary">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>

              <p className="text-muted-foreground">{product.description}</p>

              {/* Size Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Pilih Ukuran:</Label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="w-16"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Jumlah:</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleAddToCart} className="flex-1" size="lg">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Tambah ke Keranjang
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Card className="mb-16">
            <CardContent className="p-6">
              <Tabs defaultValue="description">
                <TabsList className="mb-6">
                  <TabsTrigger value="description">Deskripsi</TabsTrigger>
                  <TabsTrigger value="size-chart">Size Chart</TabsTrigger>
                  <TabsTrigger value="features">Fitur</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-4">
                  <h3 className="text-lg font-semibold">Deskripsi Produk</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Jersey ini dirancang dengan teknologi terkini untuk memberikan
                    kenyamanan maksimal saat beraktivitas. Bahan yang digunakan
                    memiliki sirkulasi udara yang baik sehingga tetap sejuk
                    meskipun digunakan dalam waktu yang lama. Cocok untuk latihan
                    maupun pertandingan resmi.
                  </p>
                </TabsContent>

                <TabsContent value="size-chart">
                  <h3 className="text-lg font-semibold mb-4">
                    Panduan Ukuran (cm)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Size</th>
                          <th className="text-left p-3 font-semibold">
                            Lingkar Dada
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Panjang
                          </th>
                          <th className="text-left p-3 font-semibold">
                            Lebar Bahu
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizeChart.map((row) => (
                          <tr
                            key={row.size}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-3 font-medium">{row.size}</td>
                            <td className="p-3">{row.chest} cm</td>
                            <td className="p-3">{row.length} cm</td>
                            <td className="p-3">{row.shoulder} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    * Toleransi ukuran ±1-2 cm
                  </p>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <h3 className="text-lg font-semibold">Fitur Produk</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Related Products */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Produk Terkait</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-primary">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={className}>{children}</label>;

export default ProductDetail;
