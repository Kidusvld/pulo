// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://afkkhmzpchftivvqkejg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFma2tobXpwY2hmdGl2dnFrZWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzM2MzQsImV4cCI6MjA1NTQwOTYzNH0.zG4hqYxAJ0EzbXQbIQ21wRBJUD_3_wBsKZMrahS53oU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);