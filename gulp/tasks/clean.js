import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import path from '../config/path.js';

export const clean = async () => {
	const outDir = resolve(path.clean);

	if (existsSync(outDir)) {
		await rm(outDir, { recursive: true });
	}
};
