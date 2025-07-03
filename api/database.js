import { createClient } from '@supabase/supabase-js';


export default async function handler(req, res) {
  // --- Set CORS Headers ---
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // --- Handle Preflight OPTIONS request for CORS ---
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  // --- Ensure the request is a POST request ---
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: "Supabase environment variables are not set." });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // --- Parse the request body ---
    const { text, author_name } = req.body;

    // --- Validate input ---
    if (!text) {
      return res.status(400).json({ error: "The 'text' field is required." });
    }

    // --- Prepare data for insertion ---
    // If author_name is not provided, it will be stored as NULL (anonymous).
    const newAppreciation = {
      text: text,
      author_name: author_name || null,
    };

    // --- Insert data into the 'appreciations' table ---
    const { data, error } = await supabaseClient
      .from("appreciations")
      .insert(newAppreciation)
      .select()
      .single();

    // --- Handle database errors ---
    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    // --- Return success response ---
    return res.status(201).json(data);

  } catch (err) {
    // --- Handle unexpected errors ---
    console.error("Caught an unexpected error:", err);
    // Check if the error is from JSON parsing
    if (err instanceof SyntaxError) {
      return res.status(400).json({ error: "Invalid JSON in request body." });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
}
