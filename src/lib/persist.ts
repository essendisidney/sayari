import type { StoreData } from "@/lib/types";
import { getSupabaseAdmin, persistenceMode } from "@/lib/supabase/admin";

const STORE_ID = "main";

export { persistenceMode };

export async function readRemoteStore(): Promise<StoreData | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  const { data, error } = await client
    .from("app_store")
    .select("data")
    .eq("id", STORE_ID)
    .maybeSingle();

  if (error) {
    console.error("[sayari] app_store read failed", error.message);
    return null;
  }
  if (!data?.data || typeof data.data !== "object") return null;
  return data.data as StoreData;
}

export async function writeRemoteStore(store: StoreData): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  const { error } = await client.from("app_store").upsert({
    id: STORE_ID,
    data: store,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[sayari] app_store write failed", error.message);
    return false;
  }
  return true;
}
