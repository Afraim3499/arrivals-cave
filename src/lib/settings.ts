import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { Database } from "@/lib/types/database";

export type HomeSettings = Database["public"]["Tables"]["home_settings"]["Row"];

export async function getHomeSettings() {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
        .from("home_settings")
        .select("*")
        .single();

    if (error) {
        console.error("Error fetching home settings:", error);
        return null;
    }
    return data as HomeSettings;
}
