"use client";

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateBar = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const percent = (scrollTop / docHeight) * 100;
      setWidth(percent);
    };

    updateBar(); // atualiza imediatamente
    window.addEventListener("scroll", updateBar);
    return () => window.removeEventListener("scroll", updateBar);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 bg-green-500 z-50 transition-all duration-300"
      style={{ width: `${width}%` }}
    />
  );
}
