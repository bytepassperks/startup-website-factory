"use client";

import { useEffect } from "react";

export default function ScrollAnimator() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".anim-fade-up,.anim-fade-left,.anim-fade-right,.anim-scale-in,.anim-blur-in,.anim-rotate-in"
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return null;
}
