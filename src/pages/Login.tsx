import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";


const API_URL = "http://localhost:8000/api/auth";

const Login = () => {
  const navigate = useNavigate();

  // LOGIN STATES
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // REGISTER STATES
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerTelepon, setRegisterTelepon] = useState("");
  const [registerAlamat, setRegisterAlamat] = useState("");
  const [registerJenisKelamin, setRegisterJenisKelamin] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Profile");
    }
  }, [navigate]);


  // HANDLE LOGIN
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        alert("Login berhasil!");
        navigate("/");
      } else {
        alert(res.data.message || "Login gagal!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat login");
    }
  }

  // HANDLE REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerPassword !== registerConfirmPassword) {
      alert("Password dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name: registerName,
        email: registerEmail,
        telepon: registerTelepon,
        alamat: registerAlamat,
        jenis_kelamin: registerJenisKelamin,
        password: registerPassword,
        password_confirmation: registerConfirmPassword,
      });

      if (res.data.success) {
        alert("Registrasi berhasil! Silakan login.");
        window.location.reload(); // refresh supaya kembali ke tab login
      } else {
        alert(res.data.message || "Registrasi gagal!");
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const resp = error?.response?.data;
      if (resp && resp.errors) {
        // flatten validation errors and show them
        const messages = Object.values(resp.errors).flat().join("\n");
        alert(messages);
      } else if (resp && resp.message) {
        alert(resp.message);
      } else {
        alert("Terjadi kesalahan saat register");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/30">
        <div className="w-full max-w-md animate-fade-in">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Masuk ke akun Anda</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="email@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="text-right">
                      <Link to="/reset-password" className="text-sm text-primary hover:underline">
                        Lupa password?
                      </Link>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* REGISTER FORM */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar</CardTitle>
                  <CardDescription>Buat akun baru</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nama Lengkap</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="email@example.com"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-telepon">Nomor Telepon</Label>
                      <Input
                        id="register-telepon"
                        type="text"
                        placeholder="08xxxxxxxxxx"
                        value={registerTelepon}
                        onChange={(e) => setRegisterTelepon(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-alamat">Alamat</Label>
                      <Input
                        id="register-alamat"
                        type="text"
                        placeholder="Alamat lengkap"
                        value={registerAlamat}
                        onChange={(e) => setRegisterAlamat(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-jenis-kelamin">Jenis Kelamin</Label>
                      <select
                        id="register-jenis-kelamin"
                        value={registerJenisKelamin}
                        onChange={(e) => setRegisterJenisKelamin(e.target.value)}
                        className="border rounded-md px-3 py-2 w-full"
                        required
                      >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="******"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Konfirmasi Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="******"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">
                      Daftar
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Login;
