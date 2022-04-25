/**
 * Based on code from the Repo: https://github.com/misskey-dev/browser-image-resizer
 * 
 * 

Outputs
A Promise that yields an Image Blob

Output Image Specification
The output image is derived from canvas.toDataURL.

EXIF and other metadata will be erased.
Rotation will be automatically corrected.
It is based on the specifications of recent versions of modern browsers and may not work with older browsers.
See w3c/csswg-drafts#4666 (comment)
Firefox support seems to be available from version 78. by mei23
Color profile is srgb. Firefox 97 does not attach the ICC profile, but Chrome does.
You can specify image/webp as the mimeType, but Safari will ignore quality (treated as 1).
 
 * 
 * 
 * 
 * 
 *
 */


export type BrowserImageResizerConfig = {
  quality: number;
  maxWidth: number;
  maxHeight: number;
  maxSize?: number;     // ???
  scaleRatio?: number;  // ???
  debug: boolean;
  mimeType: string;
  onScale?: (imageData: string) => void; // imageData: dataURL
};

const DEFAULT_CONFIG: BrowserImageResizerConfig = {
  quality: 0.5,
  maxWidth: 800,
  maxHeight: 600,
  debug: false,
  mimeType: 'image/jpeg',
};

export function readAndCompressImage(file: Blob, userConfig: Partial<BrowserImageResizerConfig>) {
  return new Promise<Blob>((resolve, reject) => {
    const img = initializeOrGetImg();
    const reader = new FileReader();
    const config: BrowserImageResizerConfig = Object.assign({}, DEFAULT_CONFIG, userConfig);

    reader.onload = function(e) {
      if (!e.target || !e.target.result) return reject("cannot load image.");
      img.onerror = function() {
        reject("cannot load image.");
      };
      img.onload = async function() {
        const scaleImageOptions: Parameters<typeof scaleImage>[0] = { img, config };
        try {
          let blob = scaleImage(scaleImageOptions);
          resolve(blob);
        } catch (err) {
          reject(err);
        }
      };
      img.src = typeof e.target.result === 'string' ? e.target.result : URL.createObjectURL(new Blob([e.target.result], { type: file.type }));
    };

    try {
      reader.onerror = function() {
        reject("cannot read image file.");
      }
      reader.readAsDataURL(file);
    } catch (err) {
      reject(err)
    }
  });
}

export function dataURItoBuffer(dataURI: string) {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return ab;
}

export function dataURIToBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return blob;
}


export function initializeOrGetImg () {
  return document.createElement('img');
}

export function initializeOrGetCanvas () {
  return document.createElement('canvas');
}

function findMaxWidth(config: BrowserImageResizerConfig, canvas) {
  //Let's find the max available width for scaled image
  let ratio = canvas.width / canvas.height;
  let mWidth = Math.min(
    canvas.width,
    config.maxWidth,
    ratio * config.maxHeight
  );
  if (
    config.maxSize &&
    config.maxSize > 0 &&
    config.maxSize < (canvas.width * canvas.height) / 1000
  )
    mWidth = Math.min(
      mWidth,
      Math.floor((config.maxSize * 1000) / canvas.height)
    );
  if (!!config.scaleRatio)
    mWidth = Math.min(mWidth, Math.floor(config.scaleRatio * canvas.width));

  if (config.debug) {
    console.log(
      'browser-image-resizer: original image size = ' +
        canvas.width +
        ' px (width) X ' +
        canvas.height +
        ' px (height)'
    );
    console.log(
      'browser-image-resizer: scaled image size = ' +
        mWidth +
        ' px (width) X ' +
        Math.floor(mWidth / ratio) +
        ' px (height)'
    );
  }
  if (mWidth <= 0) {
    mWidth = 1;
    console.warn("browser-image-resizer: image size is too small");
  }

  return mWidth;
}

function scaleCanvasWithAlgorithm(canvas: HTMLCanvasElement, config: BrowserImageResizerConfig & { outputWidth: number }) {
  let scaledCanvas = document.createElement('canvas');

  let scale = config.outputWidth / canvas.width;

  scaledCanvas.width = canvas.width * scale;
  scaledCanvas.height = canvas.height * scale;

  let srcImgData = canvas
    ?.getContext('2d')
    ?.getImageData(0, 0, canvas.width, canvas.height);
  let destImgData = scaledCanvas
    ?.getContext('2d')
    ?.createImageData(scaledCanvas.width, scaledCanvas.height);

  if (!srcImgData || !destImgData) throw Error('Canvas is empty (scaleCanvasWithAlgorithm). You should run this script after the document is ready.');

  applyBilinearInterpolation(srcImgData, destImgData, scale);

  scaledCanvas?.getContext('2d')?.putImageData(destImgData, 0, 0);

  return scaledCanvas;
}

function getHalfScaleCanvas(canvas) {
  let halfCanvas = document.createElement('canvas');
  halfCanvas.width = canvas.width / 2;
  halfCanvas.height = canvas.height / 2;

  halfCanvas
    ?.getContext('2d')
    ?.drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);

  return halfCanvas;
}

function applyBilinearInterpolation(srcCanvasData: ImageData, destCanvasData: ImageData, scale: number) {
  function inner(f00: number, f10: number, f01: number, f11: number, x: number, y: number) {
    let un_x = 1.0 - x;
    let un_y = 1.0 - y;
    return f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y;
  }
  let i: number, j: number;
  let iyv: number, iy0: number, iy1: number, ixv: number, ix0: number, ix1: number;
  let idxD: number, idxS00: number, idxS10: number, idxS01: number, idxS11: number;
  let dx: number, dy: number;
  let r: number, g: number, b: number, a: number;
  for (i = 0; i < destCanvasData.height; ++i) {
    iyv = i / scale;
    iy0 = Math.floor(iyv);
    // Math.ceil can go over bounds
    iy1 =
      Math.ceil(iyv) > srcCanvasData.height - 1
        ? srcCanvasData.height - 1
        : Math.ceil(iyv);
    for (j = 0; j < destCanvasData.width; ++j) {
      ixv = j / scale;
      ix0 = Math.floor(ixv);
      // Math.ceil can go over bounds
      ix1 =
        Math.ceil(ixv) > srcCanvasData.width - 1
          ? srcCanvasData.width - 1
          : Math.ceil(ixv);
      idxD = (j + destCanvasData.width * i) * 4;
      // matrix to vector indices
      idxS00 = (ix0 + srcCanvasData.width * iy0) * 4;
      idxS10 = (ix1 + srcCanvasData.width * iy0) * 4;
      idxS01 = (ix0 + srcCanvasData.width * iy1) * 4;
      idxS11 = (ix1 + srcCanvasData.width * iy1) * 4;
      // overall coordinates to unit square
      dx = ixv - ix0;
      dy = iyv - iy0;
      // I let the r, g, b, a on purpose for debugging
      r = inner(
        srcCanvasData.data[idxS00],
        srcCanvasData.data[idxS10],
        srcCanvasData.data[idxS01],
        srcCanvasData.data[idxS11],
        dx,
        dy
      );
      destCanvasData.data[idxD] = r;

      g = inner(
        srcCanvasData.data[idxS00 + 1],
        srcCanvasData.data[idxS10 + 1],
        srcCanvasData.data[idxS01 + 1],
        srcCanvasData.data[idxS11 + 1],
        dx,
        dy
      );
      destCanvasData.data[idxD + 1] = g;

      b = inner(
        srcCanvasData.data[idxS00 + 2],
        srcCanvasData.data[idxS10 + 2],
        srcCanvasData.data[idxS01 + 2],
        srcCanvasData.data[idxS11 + 2],
        dx,
        dy
      );
      destCanvasData.data[idxD + 2] = b;

      a = inner(
        srcCanvasData.data[idxS00 + 3],
        srcCanvasData.data[idxS10 + 3],
        srcCanvasData.data[idxS01 + 3],
        srcCanvasData.data[idxS11 + 3],
        dx,
        dy
      );
      destCanvasData.data[idxD + 3] = a;
    }
  }
}

export function scaleImage({ img, config }: {
  img: HTMLImageElement;
  config: BrowserImageResizerConfig;
}) {
  let canvas = initializeOrGetCanvas()
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas?.getContext('2d');

  if (!ctx) throw Error('Canvas is empty (scaleImage). You should run this script after the document is ready.');

  ctx.drawImage(img, 0, 0);

  let maxWidth = findMaxWidth(config, canvas);

  while (canvas.width >= 2 * maxWidth) {
    canvas = getHalfScaleCanvas(canvas);
  }

  if (canvas.width > maxWidth) {
    canvas = scaleCanvasWithAlgorithm(
      canvas,
      Object.assign(config, { outputWidth: maxWidth })
    );
  }

  let imageData = canvas.toDataURL(config.mimeType, config.quality);
  if (typeof config.onScale === 'function') config.onScale(imageData);
  return dataURIToBlob(imageData);
}