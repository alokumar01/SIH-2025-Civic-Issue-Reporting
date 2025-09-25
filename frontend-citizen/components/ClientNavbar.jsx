"use client";

import { usePathname } from "next/navigation";
import { NavbarDemo } from "@/components/Navbar";
import React from "react";
import { useUserStore } from "@/store/userStore";

// Routes (prefixes) where navbar should be hidden.
const HIDE_PREFIXES = ["/auth", "/verify-email", ];

export default function ClientNavbar() {


    const { fetchUser } = useUserStore();
    React.useEffect(() => {
        fetchUser();
    }, [fetchUser]);


    const pathname = usePathname() || "/";

    // Check if current pathname starts with any of the hide prefixes
    const hidden = HIDE_PREFIXES.some((p) => pathname.startsWith(p));

    if (hidden) return null;

    return <NavbarDemo />;
}
