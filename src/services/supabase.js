import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ruginlzgppebkuamplch.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z2lubHpncHBlYmt1YW1wbGNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NTAwNzgsImV4cCI6MjA0MzAyNjA3OH0.anmlI4ld1uiKlPPpiSY2UxTawVgsoQV9E4ld036cuUk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
