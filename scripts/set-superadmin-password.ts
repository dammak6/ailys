import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kafyatqatggifedqtctm.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const newPassword = process.argv[2];
const currentPassword = process.argv[3] || "AilysSuperAdmin2026!";

if (!newPassword) {
  console.log("\n=======================================================");
  console.log("   AÏLYS — Super Admin Password Reset CLI Utility      ");
  console.log("=======================================================\n");
  console.log("Usage:");
  console.log("  npx tsx scripts/set-superadmin-password.ts <NewPassword> [CurrentPassword]\n");
  console.log("Example:");
  console.log('  npx tsx scripts/set-superadmin-password.ts "MyNewSecretPassword2026!"\n');
  process.exit(1);
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  console.log("Authenticating direction@ailys.tn...");
  const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
    email: "direction@ailys.tn",
    password: currentPassword,
  });

  if (loginError) {
    console.error("❌ Failed to log in with provided current password:", loginError.message);
    console.error("If you don't know the current password, you can reset it via the Supabase Dashboard at:");
    console.error("https://supabase.com/dashboard/project/kafyatqatggifedqtctm/auth/users");
    process.exit(1);
  }

  console.log("Updating password for direction@ailys.tn...");
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("❌ Failed to update password:", updateError.message);
    process.exit(1);
  }

  console.log("✅ Super Admin password updated successfully!");
  console.log(`   Account: direction@ailys.tn`);
  console.log(`   Role: SUPER_ADMIN`);
  console.log(`   New Password: ${newPassword}`);
}

main().catch(console.error);
