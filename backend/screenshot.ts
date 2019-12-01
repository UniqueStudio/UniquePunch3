import puppeteer from "puppeteer";

export const screenshotThenExit = async () => {
  const filename = `punch_${Date.now()}.png`;
  console.log("taking screenshot...");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "chromium"
  });
  const page = await browser.newPage();

  await page.setViewport({ width: 800, height: 0, deviceScaleFactor: 2 });
  await page.goto("http://localhost:5000", { waitUntil: "networkidle2" });
  await page.screenshot({
    path: `./${filename}`,
    type: "png",
    fullPage: true
  });

  console.log(`screenshot saved as ./${filename}`);

  await page.close();
  await browser.close();

  process.exit(0);
};
