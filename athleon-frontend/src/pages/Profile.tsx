import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post("http://127.0.0.1:8000/api/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error("Gagal memuat data profil:", error);
        if (error.response && error.response.status === 401) {
          // jika token tidak valid, langsung logout
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [token, navigate]);

  const logoutHandler = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.post("http://127.0.0.1:8000/api/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout gagal:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Pribadi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <p className="border rounded-md p-2 bg-muted">
                  {user.name || "-"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <p className="border rounded-md p-2 bg-muted">
                  {user.email || "-"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Nomor Telepon</Label>
                <p className="border rounded-md p-2 bg-muted">
                  {user.telepon || "-"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Alamat</Label>
                <p className="border rounded-md p-2 bg-muted">
                  {user.alamat || "-"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <p className="border rounded-md p-2 bg-muted capitalize">
                  {user.jenis_kelamin || "-"}
                </p>
              </div>

              <div>
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
