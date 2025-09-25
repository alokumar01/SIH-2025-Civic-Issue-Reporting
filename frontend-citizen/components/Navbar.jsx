"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

export function NavbarDemo() {
  const navItems = [
    {
      name: "Services",
      link: "#features",
    },
    {
      name: "Griverance",
      link: "#pricing",
    },
    {
      name: "Gallery",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">
              <ModeToggle />
            </NavbarButton>

            {/* Auth area: shows Login when not authenticated, Avatar+dropdown when authenticated */}
            <AuthArea />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-4">
            <ModeToggle/>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            </div>
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300">
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {/* Mobile auth actions */}
              <MobileAuthActions onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      {/* Navbar */}
    </div>
  );
}

function AuthArea() {
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const logout = useUserStore((s) => s.logout);

  if (!isAuthenticated) {
    return (
      <NavbarButton variant="primary" as="a" href="/auth">
        Login
      </NavbarButton>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full focus:outline-none">
            <Avatar className="size-9">
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt={user.firstName} />
              ) : (
                <AvatarFallback>{(user?.firstName || "?")[0]}</AvatarFallback>
              )}
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <div className="px-2 py-1 text-sm">
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-muted-foreground">{user?.email}</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/profile">Profile</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout()} className="text-destructive">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileAuthActions({ onClose }) {
  const user = useUserStore((s) => s.user);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  const logout = useUserStore((s) => s.logout);

  if (!isAuthenticated) {
    return (
      <NavbarButton
        onClick={() => onClose()}
        variant="primary"
        className="w-full"
        as="a"
        href="/auth">
        Login
      </NavbarButton>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 px-2">
        <Avatar className="size-10">
          {user?.avatar ? (
            <AvatarImage src={user.avatar} alt={user.firstName} />
          ) : (
            <AvatarFallback>{(user?.firstName || "?")[0]}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="text-sm text-muted-foreground">{user?.email}</div>
        </div>
      </div>
      <div className="px-2 w-full">
        <NavbarButton onClick={() => { logout(); onClose(); }} variant="primary" className="w-full">Logout</NavbarButton>
      </div>
    </>
  );
}
