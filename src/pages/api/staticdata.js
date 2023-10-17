import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const jsonDirectory = path.join(process.cwd(), 'mockedjson');
  const fileContents = await fs.readFile(jsonDirectory + '/doctors.json', 'utf8');
  res.status(200).json(fileContents);
}