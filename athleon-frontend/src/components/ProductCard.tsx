import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button as UiButton } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  sizes?: string[];
}

const ProductCard = ({ id, name, price, image, category, description = "", sizes = [] }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleAddToCart = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    // if product has sizes, open quick-add modal to select size and qty
    if (sizes && sizes.length > 0) {
      setOpen(true);
      return;
    }

    try {
      await api.post("/keranjang", { produk_id: id, jumlah: 1 });
      toast.success("Produk ditambahkan ke keranjang");
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 401) {
        toast("Harap login terlebih dahulu", { description: "Anda akan diarahkan ke halaman login" });
        navigate("/login");
        return;
      }
      const msg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Gagal menambahkan ke keranjang");
      toast.error(msg);
    }
  };

  // quick-add modal state
  const [open, setOpen] = React.useState(false);
  const [selectedSize, setSelectedSize] = React.useState<string | null>(sizes && sizes.length > 0 ? sizes[0] : null);
  const [qty, setQty] = React.useState<number>(1);

  const confirmAddFromModal = async () => {
    try {
      await api.post("/keranjang", { produk_id: id, jumlah: qty, ukuran: selectedSize });
      toast.success("Produk ditambahkan ke keranjang");
      setOpen(false);
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 401) {
        toast("Harap login terlebih dahulu", { description: "Anda akan diarahkan ke halaman login" });
        navigate("/login");
        return;
      }
      const msg = data?.message || (data?.errors ? Object.values(data.errors).flat().join(", ") : "Gagal menambahkan ke keranjang");
      toast.error(msg);
    }
  };

  return (
    <>
      <Link to={`/product/${id}`} className="block">
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {image ? (
          <div className="aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        ) : (
          // no image uploaded; render an empty square to keep layout stable
          <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">&nbsp;</span>
          </div>
        )}
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{category}</p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{description}</p>
          )}
          <p className="text-xl font-bold text-primary">Rp {price.toLocaleString('id-ID')}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full" variant="secondary" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Tambah ke Keranjang
          </Button>
        </CardFooter>
        </Card>
      </Link>

      {/* Quick-add modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Ukuran & Jumlah</DialogTitle>
          </DialogHeader>

          <div className="flex gap-4">
            <div className="w-1/3">
              <img src={image} alt={name} className="w-full h-auto object-cover rounded" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{category}</p>

              {sizes && sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Pilih Ukuran</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1 border rounded ${selectedSize === s ? 'bg-primary text-white' : 'bg-transparent'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Jumlah</p>
                <div className="flex items-center gap-2">
                  <UiButton variant="outline" onClick={() => setQty(Math.max(1, qty - 1))}>-</UiButton>
                  <span className="w-12 text-center">{qty}</span>
                  <UiButton variant="outline" onClick={() => setQty(qty + 1)}>+</UiButton>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <UiButton variant="ghost" onClick={() => setOpen(false)}>Batal</UiButton>
            <UiButton onClick={confirmAddFromModal}>Tambah ke Keranjang</UiButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
