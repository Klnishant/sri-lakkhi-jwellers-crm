// lib/puppeteer.ts

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

let browser: any = null;

export async function getBrowser() {
  if (browser) return browser;

  const isProd = process.env.VERCEL === "1";

  browser = await puppeteer.launch({
    args: isProd ? chromium.args : [],
    executablePath: isProd
      ? await chromium.executablePath()
      : `${process.env.CHROME_DRIVER_PATH}`, // 👈 local chrome path
    headless: true,
  });

  return browser;
}