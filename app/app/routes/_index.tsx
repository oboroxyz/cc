import type { Route } from "./+types/_index";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "hydra NFT" },
    { name: "description", content: "hydra! hydra! hydra!" },
  ];
}

export default function Home(_: Route.ComponentProps) {
  return <p></p>;
}
