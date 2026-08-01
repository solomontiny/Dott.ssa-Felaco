import { supabase } from "../lib/supabaseClient";

const DEFAULT_BUCKET = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'media';

// Upload file to Supabase Storage using the current authenticated session.
export async function uploadFile(bucket = DEFAULT_BUCKET, path, file, options = {}) {
  if (!file) {
    throw new Error("No file provided");
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData?.session?.user) {
    throw new Error("Authenticated Supabase session is required to upload media.");
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      ...options,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw error;
  }

  return data;
}

// Get public URL
export function getPublicUrl(bucket = DEFAULT_BUCKET, path) {
  const { data, error } = supabase.storage.from(bucket).getPublicUrl(path);

  if (error) {
    throw error;
  }

  return data.publicUrl;
}

// Delete file
export async function removeFile(bucket = DEFAULT_BUCKET, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error("Supabase delete error:", error);
    throw error;
  }

  return data;
}