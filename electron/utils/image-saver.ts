import { app } from "electron";
import path from "path";
import fs from "fs";

export const userDataPath = app.getPath("userData");

export function getAbsolutePath(relativePath: string) {
  return path.join(userDataPath, relativePath);
}

export function saveBase64Image(base64: string, cid: string) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1].split("/")[1];
  const data = matches[2];

  const relativePath = `images/${cid}.${ext}`;
  const absolutePath = path.join(userDataPath, relativePath);

  // đảm bảo folder tồn tại
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });

  fs.writeFileSync(absolutePath, Buffer.from(data, "base64"));

  return relativePath;
}

export function deleteImage(path: string) {
  fs.unlinkSync(path);
}
