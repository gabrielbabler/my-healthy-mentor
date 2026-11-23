import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Healthy Mentor",
    short_name: "Healthy Mentor",
    description:
      "Seu mentor pessoal de dieta, treino e evolução física integrado ao Telegram.",
    start_url: "/hoje",
    display: "standalone",
    background_color: "#101419",
    theme_color: "#101419",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
