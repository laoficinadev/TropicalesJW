import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(
  "https://dhucjrqfsxgwixrkuynb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodWNqcnFmc3hnd2l4cmt1eW5iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE2MTI4MCwiZXhwIjoyMDk3NzM3MjgwfQ.0XZa2vPHEgZH7s72VX90NC9ju71206yeOYyXm-n8kao"
);

const hash = bcrypt.hashSync("admin123", 10);
console.log("New hash:", hash);

const { data, error } = await supabase
  .from("AdminUser")
  .update({ password: hash })
  .eq("email", "admin@tropicalesjw.com")
  .select();

console.log("Updated:", JSON.stringify(data));
if (error) console.log("Error:", error);
