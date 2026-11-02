import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

export const STORAGE_BUCKET = process.env.S3_BUCKET ?? 'assets';

export function getStorage(): Files {
  return new Files({ adapter: neon({ bucket: STORAGE_BUCKET }) });
}

export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string,
): Promise<string> {
  const files = getStorage();
  await files.upload(key, body, { contentType });
  return key;
}

export async function getObjectUrl(key: string, expiresIn = 3600): Promise<string> {
  const files = getStorage();
  return files.url(key, { expiresIn });
}

export async function deleteObject(key: string): Promise<void> {
  const files = getStorage();
  await files.delete(key);
}
