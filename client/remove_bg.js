const Jimp = require('jimp');

Jimp.read('public/temp-logo.png')
  .then(image => {
    const targetColor = image.getPixelColor(1, 1); // Get top-left pixel color
    const { r, g, b } = Jimp.intToRGBA(targetColor);
    const tolerance = 40;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];

      if (
        Math.abs(red - r) <= tolerance &&
        Math.abs(green - g) <= tolerance &&
        Math.abs(blue - b) <= tolerance
      ) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      }
    });

    image.writeAsync('app/icon.png');
    image.writeAsync('public/veagle-logo-transparent.png');
    console.log("Image background removed and saved to icon.png and veagle-logo-transparent.png");
  })
  .catch(err => {
    console.error("Error processing image:", err);
  });
