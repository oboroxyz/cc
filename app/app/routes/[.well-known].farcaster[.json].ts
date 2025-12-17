import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "~/minikit.config";

export function loader() {
  return Response.json(withValidManifest(minikitConfig));
}
