"use client";

import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
}

export default function PageMeta({ title, description, ogImage, noIndex }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | ESSKAYTONALITY`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);

    if (ogImage) {
      setMeta("og:image", ogImage, true);
      setMeta("twitter:image", ogImage);
    }

    if (noIndex) {
      let el = document.querySelector("meta[name='robots']");
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "robots");
        document.head.appendChild(el);
      }
      el.setAttribute("content", "noindex, nofollow");
    } else {
      const el = document.querySelector("meta[name='robots']");
      if (el && el.getAttribute("content") === "noindex, nofollow") {
        el.remove();
      }
    }

    return () => {
      document.title = "ESSKAYTONALITY | Music Entertainment";
    };
  }, [title, description, ogImage, noIndex]);

  return null;
}
