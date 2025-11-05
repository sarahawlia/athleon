import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SearchDialog from "./SearchDialog";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-primary-foreground hover:opacity-80 transition-opacity">
            Athleon
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/catalog" 
              className={`text-sm font-medium transition-colors ${
                isActive("/catalog") ? "text-primary-foreground" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              Katalog
            </Link>
            <Link 
                to="/orders" 
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Status Pesanan
              </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary/80"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-primary-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link 
                to="/catalog" 
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Katalog
              </Link>
              <Link 
                to="/orders" 
                className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Status Pesanan
              </Link>
              
            </div>
          </div>
        )}
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </nav>
  );
};

export default Navbar;
