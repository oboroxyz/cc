import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { minify } from "minify";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function build() {
  try {
    // 1. Fetch hydra-synth from unpkg
    console.log("Fetching hydra-synth from unpkg...");
    const response = await fetch("https://unpkg.com/hydra-synth");
    if (!response.ok) {
      throw new Error(`Failed to fetch hydra-synth: ${response.statusText}`);
    }
    const hydraSynthCode = await response.text();

    // 2. Read the HTML file
    console.log("Reading src/hydra.html...");
    const html = await readFile("src/hydra.html", "utf-8");

    // 3. Replace the script tag with inline code
    const htmlWithInlineScript = html.replace(
      /<script src="https:\/\/unpkg\.com\/hydra-synth"><\/script>/,
      `<script>${hydraSynthCode}</script>`,
    );

    // 4. Write temporary file for minification
    const tempPath = "dist/temp-build.html";
    await writeFile(tempPath, htmlWithInlineScript, "utf-8");

    // 5. Minify the HTML using minify package
    console.log("Minifying HTML...");
    const minifiedHtml = await minify(tempPath);

    // 6. Create dist directory and write output
    console.log("Writing to dist/hydra.html...");
    await mkdir("dist", { recursive: true });
    await writeFile("dist/hydra.html", minifiedHtml, "utf-8");

    // 7. Clean up temp file
    await unlink(tempPath).catch(() => {});

    console.log("✅ Build completed successfully!");
    console.log(`   Output: dist/hydra.html (${minifiedHtml.length} bytes)`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

build();
