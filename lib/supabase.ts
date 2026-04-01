import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vukpqvwqdjmcmwnveyme.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1a3BxdndxZGptY213bnZleW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTc4NzUsImV4cCI6MjA5MDUzMzg3NX0.uH--UC1yP0XDyz8AHfSOT9M8_iRuPNqhtka3ycY4j4c";

export const supabase = createClient(supabaseUrl, supabaseKey);