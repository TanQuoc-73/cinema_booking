import { createClient } from '@supabase/supabase-js';
import dotenv from "dotenv";


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; 

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Service Role KEY");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  // Tùy chọn cần thiết
});
