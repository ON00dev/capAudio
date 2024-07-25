const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://dubsmart.ai/dashboard/projects/tts/edit/669ebb1cdad4b426bed58978');
  await page.waitForSelector('audio');

  const audioUrls = await page.evaluate(() => {
    const audios = Array.from(document.querySelectorAll('audio'));
    return audios.map(audio => audio.src).filter(src => src);
  });

  console.log('URLs de áudio encontradas:', audioUrls);

  for (let i = 0; i < audioUrls.length; i++) {
    const url = audioUrls[i];
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.resolve(__dirname, `audio${i}.mp3`);
    fs.writeFileSync(filePath, response.data);
    console.log(`Áudio salvo como ${filePath}`);
  }

  await browser.close();
})();

