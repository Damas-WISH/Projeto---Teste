import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import convert from 'heic-convert';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicImagesDir = path.join(projectRoot, 'public', 'images', 'portfolio-set');

const sourceDirectories = [
  'C:/Users/nicolas_wischral/Downloads/drive-download-20260407T223213Z-3-001',
];

function slugify(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function convertImage(sourcePath, outputPath) {
  const extension = path.extname(sourcePath).toLowerCase();

  if (extension === '.heic') {
    const inputBuffer = await readFile(sourcePath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9,
    });

    await writeFile(outputPath, outputBuffer);
    return outputPath;
  }

  if (extension === '.png' || extension === '.jpg' || extension === '.jpeg') {
    await sharp(sourcePath).jpeg({ quality: 88, mozjpeg: true }).toFile(outputPath);
    return outputPath;
  }

  throw new Error(`Unsupported file format: ${sourcePath}`);
}

async function main() {
  await rm(publicImagesDir, { recursive: true, force: true });
  await mkdir(publicImagesDir, { recursive: true });
  const importedFiles = [];

  for (const sourceDirectory of sourceDirectories) {
    const files = await readdir(sourceDirectory, { withFileTypes: true });

    for (const file of files) {
      if (!file.isFile()) continue;

      const sourcePath = path.join(sourceDirectory, file.name);
      const outputBaseName = slugify(file.name);
      const targetPath = path.join(publicImagesDir, `${outputBaseName}.jpg`);

      const finalPath = await convertImage(sourcePath, targetPath);
      importedFiles.push(path.basename(finalPath));
    }
  }

  console.log(importedFiles.sort().join('\n'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
