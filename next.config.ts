import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholders mientras no exista un CDN propio. El equipo de backend
    // debería reemplazar este host por el dominio real de las imágenes.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
