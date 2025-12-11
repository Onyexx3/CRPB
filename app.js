import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'dist', 'server.js');

console.log("Starting application…");

// check builds
if (!fs.existsSync(serverPath)) throw new Error("dist/server.js missing");

import(serverPath);
