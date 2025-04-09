import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { useAuth } from "../lib/auth";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-card shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">DevBlog</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/category/react">React</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/category/typescript">TypeScript</Link>
            </Button>
            {user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/admin">Admin</Link>
                </Button>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
