import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const baseDir = path.join(root, 'public/images/after-before');

const projects = ['01', '02', '03', '04', '05', '06'];

console.log('Normalizing before/after image pairs...\n');

for (const id of projects) {
	const beforePath = path.join(baseDir, id, 'before.webp');
	const afterPath = path.join(baseDir, id, 'after.webp');

	if (!fs.existsSync(beforePath) || !fs.existsSync(afterPath)) {
		console.warn(`  ⚠ ${id}: missing file(s), skipping`);
		continue;
	}

	const afterMeta = await sharp(afterPath).metadata();
	const targetW = afterMeta.width;
	const targetH = afterMeta.height;

	const beforeMeta = await sharp(beforePath).metadata();

	if (beforeMeta.width === targetW && beforeMeta.height === targetH) {
		console.log(`  ✓ ${id}: already matched (${targetW}x${targetH})`);
		continue;
	}

	const buf = await sharp(beforePath)
		.resize(targetW, targetH, { fit: 'cover', position: 'centre' })
		.webp({ quality: 90 })
		.toBuffer();

	// Use PowerShell to overwrite the locked file via .NET
	const escaped = beforePath.replace(/\\/g, '\\\\').replace(/'/g, "''");
	const b64 = buf.toString('base64');
	const psCmd = `powershell -Command "[System.IO.File]::WriteAllBytes('${escaped}', [System.Convert]::FromBase64String('${b64}'))"`;
	execSync(psCmd, { shell: 'cmd.exe', stdio: 'pipe' });

	console.log(`  → ${id}: before resized ${beforeMeta.width}x${beforeMeta.height} → ${targetW}x${targetH}`);
}

console.log('\nDone.');
