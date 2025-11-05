import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const backendBase = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    idKategori: "",
    nama: "",
    deskripsi: "",
    kategori: "",
    jenisKelamin: "",
    harga: 0,
    stok: 0,
    ukuran: "",
    gambar: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    api
      .get("/admin/produk")
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // fetch categories for dropdown
    api.get('/kategori').then((res) => setCategories(res.data || [])).catch(() => setCategories([]));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((s: any) => ({ ...s, [name]: value }));
  };

  const handleFileChange = (e: any) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // we need multipart/form-data when sending files
    const formData = new FormData();
    formData.append('idKategori', String(form.idKategori || ''));
    formData.append('nama', String(form.nama || ''));
    formData.append('deskripsi', String(form.deskripsi || ''));
    formData.append('kategori', String(form.kategori || ''));
    formData.append('jenisKelamin', String(form.jenisKelamin || ''));
    formData.append('harga', String(form.harga || 0));
    formData.append('stok', String(form.stok || 0));
    formData.append('ukuran', String(form.ukuran || ''));
    if (file) formData.append('gambar', file);

    if (editingId) {
      api.put(`/admin/produk/${editingId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(() => {
          fetchProducts();
          setEditingId(null);
          setForm({ idKategori: "", nama: "", deskripsi: "", kategori: "", jenisKelamin: "", harga: 0, stok: 0, ukuran: "", gambar: "" });
          setFile(null);
          setPreview(null);
        });
    } else {
      api.post(`/admin/produk`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(() => {
          fetchProducts();
          setForm({ idKategori: "", nama: "", deskripsi: "", kategori: "", jenisKelamin: "", harga: 0, stok: 0, ukuran: "", gambar: "" });
          setFile(null);
          setPreview(null);
        });
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      idKategori: p.idKategori,
      nama: p.nama,
      deskripsi: p.deskripsi,
      kategori: p.kategori,
      jenisKelamin: p.jenisKelamin,
      harga: p.harga,
      stok: p.stok,
      ukuran: p.ukuran,
      gambar: p.gambar,
    });
    setPreview(p.gambar ? `${backendBase}/${p.gambar}` : null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    api.delete(`/admin/produk/${id}`).then(() => fetchProducts());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Admin - Produk</h1>

          <form onSubmit={handleSubmit} className="bg-card p-4 rounded mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm">Kategori (pilih)</label>
                <select name="idKategori" value={form.idKategori} onChange={handleChange} className="input">
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
              <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="input" />
              <input name="harga" type="number" placeholder="Harga" value={form.harga} onChange={handleChange} className="input" />
              <input name="stok" type="number" placeholder="Stok" value={form.stok} onChange={handleChange} className="input" />
              <input name="ukuran" placeholder="Ukuran (comma separated)" value={form.ukuran} onChange={handleChange} className="input" />
              <div>
                <label className="text-sm">Gambar (upload)</label>
                <input type="file" name="gambar" onChange={handleFileChange} className="input" />
                {preview && <img src={preview} className="w-24 h-24 object-cover mt-2" />}
              </div>
              <input name="kategori" placeholder="Kategori label" value={form.kategori} onChange={handleChange} className="input col-span-2" />
              <input name="jenisKelamin" placeholder="jenisKelamin" value={form.jenisKelamin} onChange={handleChange} className="input" />
              <input name="deskripsi" placeholder="Deskripsi" value={form.deskripsi} onChange={handleChange} className="input col-span-3" />
            </div>
            <div className="mt-3">
              <button type="submit" className="btn">
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button type="button" className="btn ml-2" onClick={() => { setEditingId(null); setForm({ idKategori: "", nama: "", deskripsi: "", kategori: "", jenisKelamin: "", harga: 0, stok: 0, ukuran: "", gambar: "" }); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto bg-card rounded p-4">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Kategori</th>
                  <th>Gambar</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7}>Loading...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={7}>No products</td></tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nama}</td>
                      <td>{p.harga}</td>
                      <td>{p.stok}</td>
                      <td>{p.kategori ?? (p.kategori?.nama ?? '')}</td>
                      <td>{p.gambar ? <img src={`${backendBase}/${p.gambar}`} alt="" className="w-16 h-16 object-cover"/> : '-'}</td>
                      <td>
                        <button className="btn mr-2" onClick={() => handleEdit(p)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProducts;
