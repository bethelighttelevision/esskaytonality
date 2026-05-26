import sharp from "sharp";
import { readFileSync } from "fs";

const logo = readFileSync("public/Esskaytonality Logo.png");
const bg = Buffer.from([10, 10, 10, 255]);

// Resize logo to fit within safe zone (64% inner area for maskable)
const sizes = [
  { name: "public/favicon.png", size: 48 },
  { name: "public/icon-192.png", size: 192 },
  { name: "public/icon-512.png", size: 512 },
];

for (const { name, size } of sizes) {
  const logoSize = Math.floor(size * 0.7);
  const offset = Math.floor((size - logoSize) / 2);

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([
      {
        input: await sharp(logo).resize(logoSize, logoSize, { fit: "contain" }).toBuffer(),
        top: offset,
        left: offset,
      },
    ])
    .png()
    .toFile(name);

  console.log(`Generated ${name} (${size}x${size})`);
}
