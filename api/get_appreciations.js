import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // --- Set CORS Headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

  // --- Handle Preflight OPTIONS request ---
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  // --- Ensure the request is a GET request ---
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Server configuration error: Missing Supabase URL or Key.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // --- Fetch data from the 'appreciations' table ---
    // We select the text and author_name, and order by the creation date
    // to show the newest appreciations first.
    const { data, error } = await supabaseClient
      .from('Appreciations')
      .select('text, author_name')
      .order('created_at', { ascending: false });

    if (error) {
      // This will catch RLS errors if reading is not allowed
      console.error("DATABASE SELECT ERROR:", error);
      return res.status(500).json({ error: "Database query failed.", details: error.message });
    }

    // --- Return the fetched data ---
    return res.status(200).json(data);

  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  }
}
