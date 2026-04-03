/**
 * download-images.ts
 *
 * Downloads every event image from Unsplash to /public/events/{id}.jpg
 * then updates the image_url in the DB to the local path /events/{id}.jpg
 *
 * Run once:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... npx ts-node scripts/download-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";

// Load .env.local automatically
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const OUTPUT_DIR = path.join(process.cwd(), "public/events");

// Category fallback images (used when an event has no image_url)
const CATEGORY_IMAGE: Record<string, string> = {
  Music:     "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  Tech:      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  Business:  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
  Sports:    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  Comedy:    "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80",
  Food:      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  AI:        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  Arts:      "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&q=80",
  Wellness:  "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
  Fashion:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  Film:      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
  Education: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  Gaming:    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  Travel:    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
};

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;

    const request = protocol.get(url, (response) => {
      // Follow redirects (Unsplash uses 302)
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location!;
        file.close();
        fs.unlinkSync(dest);
        downloadFile(redirectUrl, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    });

    request.on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

async function main() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created ${OUTPUT_DIR}`);
  }

  // Fetch all events
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, category, image_url")
    .order("id");

  if (error) { console.error("Supabase error:", error.message); process.exit(1); }
  if (!events || events.length === 0) { console.log("No events found."); return; }

  console.log(`Found ${events.length} events. Starting downloads...\n`);

  let success = 0;
  let failed = 0;

  for (const event of events) {
    const localPath = `/events/${event.id}.jpg`;
    const destFile = path.join(OUTPUT_DIR, `${event.id}.jpg`);

    // Skip if already downloaded
    if (fs.existsSync(destFile)) {
      console.log(`  ⏭  [${event.id}] ${event.title} — already exists, skipping`);
      // Still update DB if it's pointing to old URL
      if (event.image_url !== localPath) {
        await supabase.from("events").update({ image_url: localPath }).eq("id", event.id);
      }
      success++;
      continue;
    }

    const sourceUrl = event.image_url?.startsWith("http")
      ? event.image_url
      : CATEGORY_IMAGE[event.category];

    if (!sourceUrl) {
      console.log(`  ⚠  [${event.id}] ${event.title} — no URL, skipping`);
      failed++;
      continue;
    }

    try {
      process.stdout.write(`  ⬇  [${event.id}] ${event.title} ... `);
      await downloadFile(sourceUrl, destFile);

      // Verify file has content
      const stat = fs.statSync(destFile);
      if (stat.size < 1000) {
        fs.unlinkSync(destFile);
        throw new Error("File too small, likely an error page");
      }

      // Update DB to local path
      const { error: updateError } = await supabase
        .from("events")
        .update({ image_url: localPath })
        .eq("id", event.id);

      if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

      console.log(`✓ (${Math.round(stat.size / 1024)}KB)`);
      success++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.log(`✗ ${message}`);
      // Fall back to category image
      const fallbackUrl = CATEGORY_IMAGE[event.category];
      if (fallbackUrl && fallbackUrl !== sourceUrl) {
        try {
          process.stdout.write(`     ↩  falling back to category image ... `);
          await downloadFile(fallbackUrl, destFile);
          await supabase.from("events").update({ image_url: localPath }).eq("id", event.id);
          console.log("✓");
          success++;
        } catch {
          console.log("✗ category fallback also failed");
          failed++;
        }
      } else {
        failed++;
      }
    }

    // Small delay to avoid hammering Unsplash
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nDone. ✓ ${success} downloaded  ✗ ${failed} failed`);
  if (failed > 0) console.log("Re-run the script to retry failed ones.");
}

main();
