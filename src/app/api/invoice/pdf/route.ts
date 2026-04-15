import { getBrowser } from "@/src/lib/puppeteer";

export async function POST(req: Request) {
  const { html } = await req.json();

  const browser = await getBrowser(); // ✅ reused
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "domcontentloaded" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await page.close(); // 🔥 important

  return new Response(pdf.buffer, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}