"use client";
import ScrollProgress from "./ScrollProgress";
import { useEffect, useState } from "react";

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Scroll Progress Bar */}
      <ScrollProgress />
    </>
  );
}
