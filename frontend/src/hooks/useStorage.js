import { storage } from '../lib/supabaseClient';

// Simple storage helpers for Supabase storage
export async function uploadFile(bucket, path, file, opts = {}) {
  const res = await storage.uploadFile(bucket, path, file, opts);
  if (res.error) throw res.error;
  return res;
}

export function getPublicUrl(bucket, path) {
  return storage.getPublicUrl(bucket, path);
}

export async function removeFile(bucket, path) {
  const res = await storage.remove(bucket, path);
  if (res.error) throw res.error;
  return res;
}
