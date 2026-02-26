const fs = require('fs');
const http = require('http');
const path = require('path');

const svgDir = '/Users/sundaranv/Documents/HuminiBiz/src/assets/icons/svg';
const imgDir = '/Users/sundaranv/Documents/HuminiBiz/src/assets/images';

const svgs = {
  'video.svg': 'http://localhost:3845/assets/48522bab1cf1855c1f6ff38d0c64e873d2a67c9b.svg',
  'home-dash.svg': 'http://localhost:3845/assets/8482f33fde21af08615898929f7e85436d0894b7.svg',
  'your-moments.svg': 'http://localhost:3845/assets/54514817824655129178bb7b596e282293a908b4.svg',
  'profile-dash.svg': 'http://localhost:3845/assets/f1c0727e636a37fa364abe97ec2a80d11cbab0c4.svg',
  'calendar.svg': 'http://localhost:3845/assets/0900ed06756c2d3fa2fe8bb2932a3936f821f0b6.svg',
  'clock.svg': 'http://localhost:3845/assets/0bde847588aa39ea9dea1be7bd656a9a52f7f19a.svg',
  'heart-fill.svg': 'http://localhost:3845/assets/f143ca197a6c0000f54151c18dac53296a97f17b.svg',
  'plus.svg': 'http://localhost:3845/assets/b1a29758a06bedec43f3d9c51ac421f964665783.svg',
  'wishes-flag.svg': 'http://localhost:3845/assets/b1a29758a06bedec43f3d9c51ac421f964665783.svg' // wait, plus was b1a2
};

const imgs = {
  'user-profile-1.png': 'http://localhost:3845/assets/11b86b05dd32f3c6f6065da8e052606623d2cf9e.png',
  'user-profile-2.png': 'http://localhost:3845/assets/956eca06d278966a2401763606da8f252b99ad30.png',
  'user-profile-3.png': 'http://localhost:3845/assets/e87eb80d5083190b35d47608314f651904426138.png',
  'user-profile-4.png': 'http://localhost:3845/assets/37c8540801f907a60772bb983d5b512566cb7e1d.png',
};

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

async function run() {
  for (const [name, url] of Object.entries(svgs)) {
    await download(url, path.join(svgDir, name));
    console.log('Downloaded', name);
  }
  for (const [name, url] of Object.entries(imgs)) {
    await download(url, path.join(imgDir, name));
    console.log('Downloaded', name);
  }
}
run();
