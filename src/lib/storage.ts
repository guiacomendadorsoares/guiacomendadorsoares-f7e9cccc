import { supabase } from "@/integrations/supabase/client";

const BUCKET = "uploads";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

export async function uploadImage(file: File, folder: string): Promise<string> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) throw new Error("Faça login para enviar imagens.");
  if (!file.type.startsWith("image/")) throw new Error("Selecione um arquivo de imagem.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Imagem acima de 5MB.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${uid}/${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function storagePathFromPublicUrl(url: string): string | null {
  if (!url) return null;
  if (!/^https?:\/\//i.test(url) && !url.startsWith("data:") && !url.startsWith("blob:")) return url;

  const publicMarker = `/storage/v1/object/public/${BUCKET}/`;
  const signedMarker = `/storage/v1/object/sign/${BUCKET}/`;
  const marker = url.includes(publicMarker) ? publicMarker : url.includes(signedMarker) ? signedMarker : null;
  if (!marker) return null;
  const i = url.indexOf(marker);
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

export async function getDisplayImageUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  const path = storagePathFromPublicUrl(url);
  if (!path) return url;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error) {
    console.error("[storage] signed url error:", error.message);
    return url;
  }
  return data.signedUrl;
}

export async function getDisplayImageUrls(urls: string[] | null | undefined): Promise<string[]> {
  if (!Array.isArray(urls)) return [];
  return Promise.all(urls.map(async (url) => (await getDisplayImageUrl(url)) ?? url));
}

export async function deleteImageByUrl(url: string): Promise<void> {
  const path = storagePathFromPublicUrl(url);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
