import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

const backendBase = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    api
      .get("/produk")
      .then((res) => {
        if (!mounted) return;
        setAllProducts((res.data || []).map((p: any) => ({
          ...p,
          image: p.gambar ? `${backendBase}/${p.gambar}` : "",
          category: p.kategori ?? p.category ?? "",
          price: Number(p.harga ?? p.price ?? 0),
        })));
      })
      .catch(() => setAllProducts([]));
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = searchQuery
    ? allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Cari Produk</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery === "" && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Ketik untuk mencari produk</p>
            </div>
          )}

          {searchQuery !== "" && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Tidak ada produk yang ditemukan</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="space-y-2 mt-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <p className="font-bold text-primary">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
