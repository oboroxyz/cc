const ROOT_URL = "https://hydra.0x7.sh";

export const minikitConfig = {
  accountAssociation: {
    // this will be added in step 5
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "hydra",
    subtitle: "hydara nft",
    description: "hydra nft",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/blue-icon.png`,
    splashImageUrl: `${ROOT_URL}/blue-hero.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["nft"],
    heroImageUrl: `${ROOT_URL}/blue-hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/blue-hero.png`,
  },
} as const;
