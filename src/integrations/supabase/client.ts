// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xserqakwkzhwwsfwpgse.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZXJxYWt3a3pod3dzZndwZ3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4ODEzNzksImV4cCI6MjA2NTQ1NzM3OX0.YL5Scnt_BgAHyg0swCyO5JneLYxsW76zQ5_2S5QwFSY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);