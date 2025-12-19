import type { ActionFunctionArgs } from "react-router";

// Extract leading comments (// or /* */) from code
function extractLeadingComments(code: string): {
  comments: string;
  rest: string;
} {
  const lines = code.split("\n");
  const commentLines: string[] = [];
  let inBlockComment = false;
  let i = 0;

  for (; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (inBlockComment) {
      commentLines.push(line);
      if (trimmed.includes("*/")) {
        inBlockComment = false;
      }
      continue;
    }

    if (trimmed.startsWith("//")) {
      commentLines.push(line);
    } else if (trimmed.startsWith("/*")) {
      commentLines.push(line);
      if (!trimmed.includes("*/")) {
        inBlockComment = true;
      }
    } else if (trimmed === "") {
      commentLines.push(line);
    } else {
      break;
    }
  }

  return {
    comments: commentLines.join("\n"),
    rest: lines.slice(i).join("\n"),
  };
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { prompt, code } = (await request.json()) as {
    prompt: string;
    code?: string;
  };

  if (!prompt) {
    return new Response("Missing prompt", { status: 400 });
  }

  // Extract comments to preserve them
  const { comments, rest: codeWithoutComments } = code
    ? extractLeadingComments(code)
    : { comments: "", rest: "" };

  const systemPrompt = `You are an expert creative coder specializing in Hydra Video Synth (hydra-synth).
Your goal is to generate valid JavaScript code for Hydra based on the user's request.
Return ONLY the code. Do not include markdown formatting (like \`\`\`javascript) or explanations. The code should be ready to execute.
If the user's request is vague, create an interesting visual pattern.
IMPORTANT: If the current code contains comments (especially license headers, author credits, or attribution), you MUST preserve them exactly as they are at the top of the code.

### Hydra Reference (Cheatsheet)
- **Sources**: osc(freq, sync, offset), noise(scale, offset), voronoi(scale, speed, blending), shape(sides, radius, smoothing), gradient(speed), solid(r, g, b, a), src(s0)
- **Geometry**: rotate(angle, speed), scale(amount, xMult, yMult), pixelate(pixelX, pixelY), repeat(repeatX, repeatY, offsetX, offsetY), kaleid(nSides), scrollX(scrollX, speed), scrollY(scrollY, speed)
- **Color**: color(r, g, b, a), saturate(amount), hue(hue), brightness(amount), contrast(amount), invert(amount), luma(threshold, tolerance), thresh(threshold, tolerance), colorama(amount)
- **Blending**: add(texture, amount), sub(texture, amount), mult(texture, amount), diff(texture), blend(texture, amount), mask(texture)
- **Modulation**: modulate(texture, amount), modulateRotate(texture, amount), modulateScale(texture, amount), modulatePixelate(texture, amount), modulateKaleid(texture, amount), modulateScrollX(texture, amount), modulateScrollY(texture, amount), modulateHue(texture, amount)
- **Output**: out(o0)

### Examples
- \`osc(20, 0.1, 0.8).rotate(0, 0.1).kaleid(4).out()\`
- \`noise(3, 0.1).modulate(osc(10).rotate(1)).color(1, 0, 0).out()\`
- \`shape(4, 0.5).repeat(10, 10).modulateScale(noise(2)).out()\`

### User Request:
${prompt}
${codeWithoutComments ? `\n### Current Code (modify this):\n${codeWithoutComments}` : ""}
  `;

  // Debug logging: Inspect what's in the context
  console.log("DEBUG: api.chat.ts called");
  console.log("DEBUG: context keys:", Object.keys(context.cloudflare));
  console.log(
    "DEBUG: context.env keys:",
    context.cloudflare.env
      ? Object.keys(context.cloudflare.env)
      : "env is undefined",
  );

  if (!context.cloudflare?.env?.AI) {
    console.error("CRITICAL ERROR: AI binding is missing in context.env!");
    console.error(
      "Did you fail to restart the server after updating wrangler.jsonc or is the binding not picking up?",
    );
    return new Response(
      JSON.stringify({
        error: "Configuration Error: AI binding missing. Restart dev server.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    console.log(
      "DEBUG: Invoking AI.run with model @cf/meta/llama-3.1-70b-instruct",
    );
    const completion = await context.cloudflare.env.AI.run(
      "@cf/meta/llama-3-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Write a Hydra sketch for: ${prompt}`,
          },
        ],
      },
    );
    console.log("DEBUG: AI Run successful");

    // biome-ignore lint/suspicious/noExplicitAny: response type varies by model
    const generatedCode = (completion as any).response || "";

    // Cleanup: Remove any potential markdown if the model hallucinates it despite instructions
    const cleanCode = generatedCode
      .replace(/```javascript/g, "")
      .replace(/```/g, "")
      .trim();

    // Restore preserved comments
    const finalCode = comments ? `${comments}\n${cleanCode}` : cleanCode;

    return new Response(JSON.stringify({ code: finalCode }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate code" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
