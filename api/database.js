// /api/add-appreciation.js
//
// This is a Vercel Serverless Function with enhanced error logging
// to help diagnose connection and insertion issues.

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // --- Set CORS Headers ---
  res.setHeader('Access-Control-Allow-Origin', 'https://appreciations.andrinoff.com');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // --- Handle Preflight OPTIONS request ---
  if (req.method === 'OPTIONS') {
    return res.status(200).send('ok');
  }

  // --- Ensure the request is a POST request ---
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  console.log("Function invoked. Attempting to process request...");

  // --- Step 1: Check for Environment Variables ---
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL ERROR: Supabase environment variables are not set.");
    return res.status(500).json({
      error: "Server configuration error: Missing Supabase URL or Key. Please check Vercel environment variables."
    });
  }
  console.log("Step 1 PASSED: Environment variables found.");


  let supabaseClient;
  try {
    // --- Step 2: Initialize Supabase Client ---
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Step 2 PASSED: Supabase client initialized successfully.");
  } catch (e) {
    console.error("CRITICAL ERROR: Failed to create Supabase client.", e.message);
    return res.status(500).json({ error: "Failed to initialize database client.", details: e.message });
  }


  let text, author_name;
  try {
    // --- Step 3: Parse Request Body ---
    ({ text, author_name } = req.body);
    console.log("Step 3 PASSED: Request body parsed.", { text, author_name });
  } catch (e) {
    console.error("ERROR: Could not parse request body.", e.message);
    return res.status(400).json({ error: "Invalid request body. Ensure it is valid JSON.", details: e.message });
  }


  // --- Step 4: Validate Input ---
  if (!text) {
    console.error("ERROR: 'text' field is missing from the request body.");
    return res.status(400).json({ error: "The 'text' field is required." });
  }
  console.log("Step 4 PASSED: Input validation successful.");


  try {
    // --- Step 5: Insert Data into Database ---
    console.log("Attempting to insert into 'appreciations' table...");
    const { data, error } = await supabaseClient
      .from("Appreciations")
      .insert({
        text: text,
        author_name: author_name || null,
      })
      .select()
      .single();

    // Handle specific database errors
    if (error) {
      // This will now catch RLS errors, constraint violations, etc.
      console.error("DATABASE INSERT ERROR:", error);
      // Forward the specific Supabase error message to the client
      return res.status(500).json({
        error: "Database operation failed.",
        details: error.message,
        hint: error.hint
      });
    }

    console.log("Step 5 PASSED: Data inserted successfully.", data);
    // --- Return Success Response ---
    return res.status(201).json(data);

  } catch (err) {
    // --- Handle any other unexpected errors during the insert process ---
    console.error("UNEXPECTED CATCH BLOCK ERROR:", err);
    return res.status(500).json({ error: "An unexpected server error occurred.", details: err.message });
  }
}
