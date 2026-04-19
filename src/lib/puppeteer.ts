import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function getBrowser() {
  const isProd = process.env.NODE_ENV === "production";

  let browser;

  if (isProd) {
    // 🚀 Vercel / serverless
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      defaultViewport: {
        width: 794,
        height: 1123,
        deviceScaleFactor: 2,
      },
    });
  } else {
    // 🟢 LOCAL (IMPORTANT FIX)
    browser = await puppeteer.launch({
      headless: true,
      channel: "chrome", // 👈 THIS FIXES YOUR ERROR
      defaultViewport: {
        width: 794,
        height: 1123,
        deviceScaleFactor: 2,
      },
    });
  }

  return browser;
}