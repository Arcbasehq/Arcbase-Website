const prerender = false;
const POST = async ({ request }) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };
  try {
    const supabaseUrl = undefined                                   ;
    const supabaseKey = undefined                                        ;
    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ success: true, message: "Local logout" }), {
        status: 200,
        headers
      });
    }
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { userId } = body;
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID required" }), {
        status: 400,
        headers
      });
    }
    await supabase.from("profiles").delete().eq("id", userId);
    return new Response(JSON.stringify({ success: true, message: "Account data deleted" }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error("Delete error:", error);
    return new Response(JSON.stringify({ error: "Failed to delete account" }), {
      status: 500,
      headers
    });
  }
};
const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    OPTIONS,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
