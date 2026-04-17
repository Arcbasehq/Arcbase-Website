import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    };

    try {
        const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
        const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return new Response(JSON.stringify({ success: true, message: "Local logout" }), {
                status: 200,
                headers,
            });
        }

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseKey);

        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: "User ID required" }), {
                status: 400,
                headers,
            });
        }

        // Try to delete profile
        await supabase.from("profiles").delete().eq("id", userId);

        return new Response(JSON.stringify({ success: true, message: "Account data deleted" }), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Delete error:", error);
        return new Response(JSON.stringify({ error: "Failed to delete account" }), {
            status: 500,
            headers,
        });
    }
};

export const OPTIONS: APIRoute = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
};