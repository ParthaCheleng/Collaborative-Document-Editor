"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavigationManager() {
  const pathname = usePathname();
  
  // Hide the global Navbar on the editor route
  if (pathname?.startsWith("/documents/")) {
    return null;
  }
  
  return <Navbar />;
}
