import { supabase } from "@/integrations/supabase/client";

export type ClaimStatus =
  | "pending"
  | "in_review"
  | "awaiting_docs"
  | "approved"
  | "rejected"
  | "already_claimed"
  | "canceled";

export type DocType = "cnpj_card" | "social_contract" | "bond_proof" | "identity" | "other";

export const DOC_LABEL: Record<DocType, string> = {
  cnpj_card: "Cartão CNPJ",
  social_contract: "Contrato Social",
  bond_proof: "Documento de vínculo",
  identity: "Documento de identidade",
  other: "Outro",
};

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  pending: "Pendente",
  in_review: "Em análise",
  awaiting_docs: "Aguardando documentos",
  approved: "Aprovada",
  rejected: "Recusada",
  already_claimed: "Empresa já vinculada",
  canceled: "Cancelada",
};

const CLAIM_BUCKET = "business-claims";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = new Set(["application/pdf", "image/jpeg", "image/jpg", "image/png"]);

export async function businessHasOwner(businessId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc("business_has_owner", {
    _business_id: businessId,
  });
  if (error) {
    console.error("[claims] business_has_owner error:", error.message);
    return false;
  }
  return Boolean(data);
}

export async function myOpenClaimForBusiness(
  businessId: string,
  userId: string,
): Promise<{ id: string; status: ClaimStatus } | null> {
  const { data, error } = await (supabase as any)
    .from("business_claims")
    .select("id,status")
    .eq("business_id", businessId)
    .eq("claimant_user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error || !data?.length) return null;
  return data[0] as { id: string; status: ClaimStatus };
}

export type ClaimInput = {
  business_id: string;
  full_name: string;
  cpf: string;
  role_in_company: string;
  phone: string;
  whatsapp?: string;
  email: string;
};

export async function createClaim(input: ClaimInput): Promise<{ id: string }> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) throw new Error("Faça login para reivindicar uma empresa.");
  const { data, error } = await (supabase as any)
    .from("business_claims")
    .insert({ ...input, claimant_user_id: uid })
    .select("id")
    .single();
  if (error) throw error;
  return data as { id: string };
}

export async function uploadClaimDocument(params: {
  claimId: string;
  docType: DocType;
  file: File;
}): Promise<void> {
  const { claimId, docType, file } = params;
  const { data: u } = await supabase.auth.getUser();
  const uid = u.user?.id;
  if (!uid) throw new Error("Faça login para enviar documentos.");
  if (!ALLOWED_MIME.has(file.type)) throw new Error("Tipo inválido. Envie PDF, JPG ou PNG.");
  if (file.size > MAX_BYTES) throw new Error("Arquivo acima de 10 MB.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `${uid}/${claimId}/${docType}-${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(CLAIM_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;

  const { error: dbErr } = await (supabase as any).from("business_claim_documents").insert({
    claim_id: claimId,
    doc_type: docType,
    file_path: path,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    uploaded_by: uid,
  });
  if (dbErr) throw dbErr;
}

export async function getClaimDocSignedUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(CLAIM_BUCKET).createSignedUrl(path, 300);
  if (error) return null;
  return data.signedUrl;
}
