'use client';

import Link from 'next/link';
import { Plane } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">Wanderlust Adventures</span>
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/destinations" className="text-foreground/80 hover:text-primary transition">
            Destinations
          </Link>
          <Link href="/about" className="text-foreground/80 hover:text-primary transition">
            About
          </Link>
          <Link href="/contact" className="text-foreground/80 hover:text-primary transition">
            Contact Us
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;