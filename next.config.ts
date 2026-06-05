import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase App Hosting (Cloud Run) sirve un server.js autónomo.
  output: "standalone",

  // El contenido de las lecciones se lee con `fs` en runtime. En el build
  // standalone hay que incluir explícitamente la carpeta content/ o no se copia.
  outputFileTracingIncludes: {
    "/leccion/[slug]": ["./content/**/*"],
  },
};

export default nextConfig;
