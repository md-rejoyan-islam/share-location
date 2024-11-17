"use client";

import { Switch } from "@/components/ui/switch";
import { MapPin, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const themes = [
    {
      id: 1,
      name: "Light",
      key: "light",
    },
    {
      id: 2,
      name: "Dark",
      key: "dark",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60  ">
      <div className="container flex h-14 max-w-6xl mx-auto items-center px-4 lg:px-0">
        <div className="flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <MapPin className="h-6 w-6" />
            <span className="font-bold">Location Share</span>
          </Link>
          {/* <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
            >
              Home
            </Link>
            <Link
              href="/viewer"
              className={
                pathname === "/viewer"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
            >
              Viewer
            </Link>
          </nav> */}
        </div>
        {/* <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="border"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div> */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <nav className="flex items-center">
            <Switch
              checked={theme === themes[1].key}
              onCheckedChange={() => {
                setTheme(
                  theme === themes[1].key ? themes[0].key : themes[1].key
                );
              }}
              className="ml-4"
              aria-label="Toggle theme"
            >
              {theme === themes[1].key ? (
                <Moon className="h-4 w-4 text-gray-400" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-400" />
              )}
            </Switch>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/viewer"
              className={
                pathname === "/viewer"
                  ? "text-foreground"
                  : "text-foreground/60 transition-colors hover:text-foreground"
              }
              onClick={toggleMenu}
            >
              Viewer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
