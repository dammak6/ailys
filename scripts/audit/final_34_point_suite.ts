import fs from "fs";
import path from "path";
import { execSync } from "child_process";

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

import { createClient } from "@supabase/supabase-js";
import { generateInvoicePdfBuffer } from "../../src/lib/invoices/generate-invoice";
import { InvoiceService } from "../../src/lib/services/invoice-service";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

// 1. Anonymous Client
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// 2. Super Admin Client (Authenticated via GoTrue)
const superAdminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// 3. Operational Admin Client (For testing non-super admin bounds)
const opAdminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

interface TestResult {
  id: number;
  category: string;
  name: string;
  status: "PASS" | "FAIL";
  details: string;
}

const testResults: TestResult[] = [];

function recordTest(id: number, category: string, name: string, status: "PASS" | "FAIL", details: string) {
  testResults.push({ id, category, name, status, details });
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${id.toString().padStart(2, "0")}] [${category}] ${name}: ${status}`);
  if (details) console.log(`   └─ ${details}`);
}

async function runFinalClosureSuite() {
  console.log("================================================================================");
  console.log("             AÏLYS 34-POINT FINAL PRODUCTION CLOSURE SUITE                      ");
  console.log("             Target: ailys (kafyatqatggifedqtctm, eu-west-1)                   ");
  console.log("================================================================================\n");

  const createdTestOrderIds: string[] = [];
  const createdTestReturnIds: string[] = [];
  const createdTestDocumentIds: string[] = [];
  const createdTestRestockIds: string[] = [];
  const createdTestStoragePaths: string[] = [];
  const createdTestAdminEmails: string[] = [];

  const tempAdminEmail = `test-admin-${Date.now()}@ailys.tn`;
  const tempAdminPassword = "TestOperationalAdmin2026!";

  // Stock baselines for cleanup/restoration
  const variantOriginalStocks: Record<string, number> = {};

  try {
    // =========================================================================
    // SECTION 1: AUTH (Points 1 - 4)
    // =========================================================================

    // TEST 01: Legacy Credential Scan (Zero occurrences)
    let legacyMatches = 0;
    try {
      const searchOutput = execSync('git grep -n -E "aichalys2026|ailys_admin_token"', {
        cwd: process.cwd(),
        encoding: "utf-8",
      });
      const lines = searchOutput.trim().split("\n").filter((l) => l.trim().length > 0);
      legacyMatches = lines.length;
    } catch (e) {
      // git grep returns exit code 1 if no matches found
      legacyMatches = 0;
    }

    if (legacyMatches === 0) {
      recordTest(1, "AUTH", "Legacy Credential Scan", "PASS", "Zero occurrences of 'aichalys2026' and 'ailys_admin_token' across repository.");
    } else {
      recordTest(1, "AUTH", "Legacy Credential Scan", "FAIL", `Found ${legacyMatches} legacy credential occurrences.`);
    }

    // TEST 02: Supabase Login (direction@ailys.tn via GoTrue)
    const { data: superLogin, error: superLoginErr } = await superAdminClient.auth.signInWithPassword({
      email: "direction@ailys.tn",
      password: "AilysSuperAdmin2026!",
    });

    if (!superLoginErr && superLogin.session && superLogin.user) {
      recordTest(2, "AUTH", "Supabase Login", "PASS", `direction@ailys.tn signed in via GoTrue (UID: ${superLogin.user.id}).`);
    } else {
      recordTest(2, "AUTH", "Supabase Login", "FAIL", superLoginErr?.message || "Failed login");
    }

    // TEST 03: Active Admin Profile (get_admin_profile RPC)
    const { data: profData, error: profErr } = await superAdminClient.rpc("get_admin_profile" as any);
    const superProf = Array.isArray(profData) ? profData[0] : profData;
    const superRole = superProf?.role_name || superProf?.role;
    if (!profErr && superProf && superRole === "SUPER_ADMIN" && superProf.is_active === true) {
      recordTest(3, "AUTH", "Active Admin Profile", "PASS", `Profile resolved to active SUPER_ADMIN (${superProf.email}).`);
    } else {
      recordTest(3, "AUTH", "Active Admin Profile", "FAIL", profErr?.message || `Invalid profile: ${JSON.stringify(superProf)}`);
    }

    // TEST 04: Inactive Admin Rejection
    // Create an operational admin, deactivate them, and verify rejection
    createdTestAdminEmails.push(tempAdminEmail);
    const { data: createdAdmin, error: createOpErr } = await superAdminClient.rpc("create_operational_admin" as any, {
      p_email: tempAdminEmail,
      p_password: tempAdminPassword,
      p_full_name: "Test Op Admin",
    });

    if (createOpErr || !createdAdmin?.success) {
      throw new Error(`Failed to create temp admin for tests: ${createOpErr?.message}`);
    }

    // Deactivate temp admin
    await (superAdminClient as any).from("admin_users").update({ is_active: false }).eq("email", tempAdminEmail);

    // Sign in with temp admin
    const { data: deactLogin, error: deactLoginErr } = await opAdminClient.auth.signInWithPassword({
      email: tempAdminEmail,
      password: tempAdminPassword,
    });

    // Check profile / is_admin() RPC
    let deactRejected = false;
    if (deactLogin?.session) {
      const { data: deactProf } = await opAdminClient.rpc("get_admin_profile" as any);
      const profObj = Array.isArray(deactProf) ? deactProf[0] : deactProf;
      const { data: isAdminRes } = await opAdminClient.rpc("is_admin" as any);
      if ((!profObj || profObj.is_active === false) && isAdminRes === false) {
        deactRejected = true;
      }
    } else if (deactLoginErr) {
      deactRejected = true;
    }

    // Reactivate for RBAC tests
    await (superAdminClient as any).from("admin_users").update({ is_active: true }).eq("email", tempAdminEmail);
    // Refresh opAdminClient session
    await opAdminClient.auth.signInWithPassword({
      email: tempAdminEmail,
      password: tempAdminPassword,
    });

    if (deactRejected) {
      recordTest(4, "AUTH", "Inactive Admin Rejection", "PASS", "Inactive admin account rejected by is_admin() and marked inactive in profile.");
    } else {
      recordTest(4, "AUTH", "Inactive Admin Rejection", "FAIL", "Inactive admin was granted active admin access!");
    }

    // =========================================================================
    // SECTION 2: RBAC (Points 5 - 8)
    // =========================================================================

    // TEST 05: SUPER_ADMIN Analytics Access
    const { data: superExecData, error: superExecErr } = await superAdminClient.rpc("get_executive_analytics" as any);
    if (!superExecErr && superExecData && "totalRevenue" in superExecData && "totalOrders" in superExecData) {
      recordTest(5, "RBAC", "SUPER_ADMIN Analytics Access", "PASS", `Super Admin retrieved executive analytics (Revenue: ${superExecData.totalRevenue} TND, Orders: ${superExecData.totalOrders}).`);
    } else {
      recordTest(5, "RBAC", "SUPER_ADMIN Analytics Access", "FAIL", superExecErr?.message || "Failed to retrieve executive analytics");
    }

    // TEST 06: ADMIN Analytics Denial
    const { data: _opExec, error: opExecErr } = await opAdminClient.rpc("get_executive_analytics" as any);
    if (opExecErr && opExecErr.message.includes("SUPER_ADMIN")) {
      recordTest(6, "RBAC", "ADMIN Analytics Denial", "PASS", `Denied by server-side RPC guard: "${opExecErr.message}".`);
    } else {
      recordTest(6, "RBAC", "ADMIN Analytics Denial", "FAIL", "Operational admin was able to access executive analytics!");
    }

    // TEST 07: ADMIN Admin-Management Denial
    const { data: _opList, error: opListErr } = await opAdminClient.rpc("get_all_admins" as any);
    if (opListErr && opListErr.message.includes("SUPER_ADMIN")) {
      recordTest(7, "RBAC", "ADMIN Admin-Management Denial", "PASS", `Denied by server-side RPC guard: "${opListErr.message}".`);
    } else {
      recordTest(7, "RBAC", "ADMIN Admin-Management Denial", "FAIL", "Operational admin was able to execute get_all_admins!");
    }

    // TEST 08: Role Escalation Denial
    const { data: roles } = await (superAdminClient as any).from("roles").select("id, name");
    const superAdminRoleId = roles?.find((r: any) => r.name === "SUPER_ADMIN")?.id;
    const { data: tempAdminUser } = await (superAdminClient as any).from("admin_users").select("id").eq("email", tempAdminEmail).single();

    const { error: promoErr } = await (opAdminClient as any)
      .from("admin_users")
      .update({ role_id: superAdminRoleId })
      .eq("id", tempAdminUser.id);

    const { data: checkRole } = await (superAdminClient as any).from("admin_users").select("roles(name)").eq("id", tempAdminUser.id).single();
    const stillAdmin = checkRole?.roles?.name === "ADMIN";

    if (stillAdmin) {
      recordTest(8, "RBAC", "Role Escalation Denial", "PASS", "Self-promotion attempt blocked; role remained ADMIN.");
    } else {
      recordTest(8, "RBAC", "Role Escalation Denial", "FAIL", "Admin user successfully escalated their own role!");
    }

    // =========================================================================
    // SECTION 3: CHECKOUT (Points 9 - 11)
    // =========================================================================

    // Pick 2 variants with stock >= 5 for checkout and edit tests
    const { data: variantsForCheckout } = await (superAdminClient as any)
      .from("product_variants")
      .select("id, product_id, sku, stock_quantity")
      .gt("stock_quantity", 4)
      .limit(2);

    const vCheckout1 = variantsForCheckout[0];
    const vCheckout2 = variantsForCheckout[1];
    variantOriginalStocks[vCheckout1.id] = vCheckout1.stock_quantity;
    variantOriginalStocks[vCheckout2.id] = vCheckout2.stock_quantity;

    // TEST 09: Authoritative Pricing (Subtotal & Shipping Fee rule >= 200 TND)
    const { data: checkoutOrder1, error: coErr1 } = await (superAdminClient as any).rpc("execute_checkout", {
      p_customer_name: "Client Checkout Test",
      p_phone: "+216 71 222 333",
      p_governorate: "Tunis",
      p_city: "Tunis",
      p_address: "Avenue Bourguiba",
      p_items: [
        {
          variant_id: vCheckout1.id,
          quantity: 1,
        },
      ],
      p_notes: "Test Checkout Pricing",
    });

    if (coErr1 || !checkoutOrder1?.orderId) {
      throw new Error(`Checkout 1 failed: ${coErr1?.message}`);
    }

    const orderId1 = checkoutOrder1.orderId;
    const orderCode1 = checkoutOrder1.orderCode;
    createdTestOrderIds.push(orderId1);

    const { data: dbOrder1 } = await (superAdminClient as any).from("orders").select("subtotal, shipping_fee, total").eq("id", orderId1).single();
    const expectedShipping = Number(dbOrder1.subtotal) >= 200 ? 0 : 7;
    const pricingValid = Number(dbOrder1.shipping_fee) === expectedShipping && Number(dbOrder1.total) === Number(dbOrder1.subtotal) + expectedShipping;

    if (pricingValid) {
      recordTest(9, "CHECKOUT", "Authoritative Pricing", "PASS", `Subtotal: ${dbOrder1.subtotal} TND, Shipping: ${dbOrder1.shipping_fee} TND, Total: ${dbOrder1.total} TND (free shipping >= 200 rule verified).`);
    } else {
      recordTest(9, "CHECKOUT", "Authoritative Pricing", "FAIL", `Pricing mismatch: Subtotal=${dbOrder1.subtotal}, Shipping=${dbOrder1.shipping_fee}, Total=${dbOrder1.total}`);
    }

    // TEST 10: Atomic Inventory Decrement
    const { data: v1AfterOrder } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vCheckout1.id).single();
    if (v1AfterOrder.stock_quantity === variantOriginalStocks[vCheckout1.id] - 1) {
      recordTest(10, "CHECKOUT", "Atomic Inventory Decrement", "PASS", `Variant ${vCheckout1.sku} stock decremented atomically: ${variantOriginalStocks[vCheckout1.id]} -> ${v1AfterOrder.stock_quantity}.`);
    } else {
      recordTest(10, "CHECKOUT", "Atomic Inventory Decrement", "FAIL", `Stock mismatch: expected ${variantOriginalStocks[vCheckout1.id] - 1}, got ${v1AfterOrder.stock_quantity}`);
    }

    // TEST 11: Insufficient Stock Rejection
    const { data: _badCheckout, error: badCoErr } = await (superAdminClient as any).rpc("execute_checkout", {
      p_customer_name: "Client Excessive Stock",
      p_phone: "+216 71 000 000",
      p_governorate: "Sousse",
      p_city: "Sousse",
      p_address: "Zone Touristique",
      p_items: [
        {
          variant_id: vCheckout1.id,
          quantity: 999999,
        },
      ],
    });

    if (badCoErr && badCoErr.message.includes("Stock insuffisant")) {
      recordTest(11, "CHECKOUT", "Insufficient Stock Rejection", "PASS", `Blocked by inventory guard: "${badCoErr.message}".`);
    } else {
      recordTest(11, "CHECKOUT", "Insufficient Stock Rejection", "FAIL", "Excessive quantity checkout was not blocked!");
    }

    // =========================================================================
    // SECTION 4: ORDER EDIT (Points 12 - 17)
    // =========================================================================

    // TEST 12: Editable Order Succeeds
    const { data: editCustomerRes, error: editCustomerErr } = await superAdminClient.rpc("edit_order_details" as any, {
      p_order_id: orderId1,
      p_customer_name: "Client Modifié Régression",
      p_phone: "+216 98 777 666",
      p_governorate: "Ariana",
      p_city: "Ennasr 2",
      p_address: "Avenue Hédi Nouira",
      p_reason: "Correction adresse client",
    });

    if (!editCustomerErr && editCustomerRes?.success) {
      recordTest(12, "ORDER_EDIT", "Editable Order Succeeds", "PASS", "Customer name and delivery address updated successfully on pending order.");
    } else {
      recordTest(12, "ORDER_EDIT", "Editable Order Succeeds", "FAIL", editCustomerErr?.message || "Order edit failed");
    }

    // TEST 13: Inventory Reconciliation Succeeds (Variant Swap A -> B in order)
    const { data: ordItem1 } = await (superAdminClient as any).from("order_items").select("*").eq("order_id", orderId1).single();
    const stockV2BeforeSwap = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vCheckout2.id).single()).data.stock_quantity;

    const { data: editSwapRes, error: editSwapErr } = await superAdminClient.rpc("edit_order_details" as any, {
      p_order_id: orderId1,
      p_items: [
        {
          order_item_id: ordItem1.id,
          variant_id: vCheckout2.id,
          quantity: 1,
        },
      ],
      p_reason: "Échange de silhouette commandée",
    });

    const stockV1AfterSwap = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vCheckout1.id).single()).data.stock_quantity;
    const stockV2AfterSwap = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vCheckout2.id).single()).data.stock_quantity;

    const swapPass =
      !editSwapErr &&
      editSwapRes?.success &&
      stockV1AfterSwap === variantOriginalStocks[vCheckout1.id] && // Old variant restored
      stockV2AfterSwap === stockV2BeforeSwap - 1; // New variant decremented

    if (swapPass) {
      recordTest(13, "ORDER_EDIT", "Inventory Reconciliation Succeeds", "PASS", `Swapped variant: old variant restored to ${stockV1AfterSwap}, new variant decremented ${stockV2BeforeSwap} -> ${stockV2AfterSwap}.`);
    } else {
      recordTest(13, "ORDER_EDIT", "Inventory Reconciliation Succeeds", "FAIL", `Reconciliation failure: V1=${stockV1AfterSwap}, V2=${stockV2AfterSwap}, err=${editSwapErr?.message}`);
    }

    // TEST 14: Edit History Created
    const { data: editLogs } = await (superAdminClient as any).from("order_edit_history").select("*").eq("order_id", orderId1);
    if (editLogs && editLogs.length >= 2) {
      recordTest(14, "ORDER_EDIT", "Edit History Created", "PASS", `Recorded ${editLogs.length} audit trail diff entries in order_edit_history.`);
    } else {
      recordTest(14, "ORDER_EDIT", "Edit History Created", "FAIL", `Found ${editLogs?.length || 0} history records, expected >= 2.`);
    }

    // TEST 15: en_livraison Blocked
    await (superAdminClient as any).from("orders").update({ status: "en_livraison" }).eq("id", orderId1);
    const { error: enLivErr } = await superAdminClient.rpc("edit_order_details" as any, {
      p_order_id: orderId1,
      p_customer_name: "Tentative Bloquée En Livraison",
    });

    if (enLivErr && enLivErr.message.includes("en_livraison")) {
      recordTest(15, "ORDER_EDIT", "en_livraison Blocked", "PASS", `Blocked by lifecycle guard: "${enLivErr.message}".`);
    } else {
      recordTest(15, "ORDER_EDIT", "en_livraison Blocked", "FAIL", "Edit succeeded on en_livraison order!");
    }

    // TEST 16: livre Blocked
    await (superAdminClient as any).from("orders").update({ status: "livre" }).eq("id", orderId1);
    const { error: livreErr } = await superAdminClient.rpc("edit_order_details" as any, {
      p_order_id: orderId1,
      p_customer_name: "Tentative Bloquée Livré",
    });

    if (livreErr && livreErr.message.includes("livre")) {
      recordTest(16, "ORDER_EDIT", "livre Blocked", "PASS", `Blocked by lifecycle guard: "${livreErr.message}".`);
    } else {
      recordTest(16, "ORDER_EDIT", "livre Blocked", "FAIL", "Edit succeeded on livre order!");
    }

    // TEST 17: annule Blocked
    await (superAdminClient as any).from("orders").update({ status: "annule" }).eq("id", orderId1);
    const { error: annuleErr } = await superAdminClient.rpc("edit_order_details" as any, {
      p_order_id: orderId1,
      p_customer_name: "Tentative Bloquée Annulé",
    });

    if (annuleErr && annuleErr.message.includes("annule")) {
      recordTest(17, "ORDER_EDIT", "annule Blocked", "PASS", `Blocked by lifecycle guard: "${annuleErr.message}".`);
    } else {
      recordTest(17, "ORDER_EDIT", "annule Blocked", "FAIL", "Edit succeeded on annule order!");
    }

    // =========================================================================
    // SECTION 5: RETURNS / EXCHANGE (Points 18 - 23)
    // =========================================================================

    // Pick 2 fresh variants for return/exchange testing
    const { data: variantsForReturn } = await (superAdminClient as any)
      .from("product_variants")
      .select("id, product_id, sku, stock_quantity")
      .gt("stock_quantity", 5)
      .limit(2);

    const vRetA = variantsForReturn[0]; // Returned
    const vRetB = variantsForReturn[1]; // Replacement
    variantOriginalStocks[vRetA.id] = vRetA.stock_quantity;
    variantOriginalStocks[vRetB.id] = vRetB.stock_quantity;

    // Create an order for return testing
    const { data: retOrderRes } = await (superAdminClient as any).rpc("execute_checkout", {
      p_customer_name: "Client Test Retour Echange",
      p_phone: "+216 71 888 999",
      p_governorate: "Tunis",
      p_city: "Tunis",
      p_address: "Avenue Habib Bourguiba",
      p_items: [
        {
          variant_id: vRetA.id,
          quantity: 1,
        },
      ],
      p_notes: "Order for Return/Exchange verification",
    });

    const retOrderId = retOrderRes.orderId;
    const retOrderCode = retOrderRes.orderCode;
    createdTestOrderIds.push(retOrderId);

    const { data: retOrderItem } = await (superAdminClient as any).from("order_items").select("*").eq("order_id", retOrderId).single();

    // TEST 18: Return Restock Succeeds (Regular Return type='retour')
    const { data: simpleReturn } = await (superAdminClient as any)
      .from("returns")
      .insert({
        order_id: retOrderId,
        order_code: retOrderCode,
        customer_name: "Client Test Retour",
        customer_phone: "+216 71 888 999",
        type: "retour",
        reason: "Changement d'avis",
        status: "recu",
      })
      .select()
      .single();

    createdTestReturnIds.push(simpleReturn.id);

    await (superAdminClient as any).from("return_items").insert({
      return_id: simpleReturn.id,
      order_item_id: retOrderItem.id,
      returned_variant_id: vRetA.id,
      quantity: 1,
      product_name: retOrderItem.product_name,
    });

    const stockABeforeSimpleRestock = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;

    const { data: simpleRestockRes, error: simpleRestockErr } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: simpleReturn.id,
    });

    const stockAAfterSimpleRestock = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;

    if (!simpleRestockErr && simpleRestockRes?.success && stockAAfterSimpleRestock === stockABeforeSimpleRestock + 1) {
      recordTest(18, "RETURNS_EXCHANGE", "Return Restock Succeeds", "PASS", `Restored returned variant stock: ${stockABeforeSimpleRestock} -> ${stockAAfterSimpleRestock}.`);
    } else {
      recordTest(18, "RETURNS_EXCHANGE", "Return Restock Succeeds", "FAIL", `Simple restock failed: ${simpleRestockErr?.message}`);
    }

    // Now test exchange flow on a dedicated exchange order
    const { data: exchOrderRes } = await (superAdminClient as any).rpc("execute_checkout", {
      p_customer_name: "Client Echange Dédié",
      p_phone: "+216 71 333 444",
      p_governorate: "Sfax",
      p_city: "Sfax",
      p_address: "Route de Téniour",
      p_items: [
        {
          variant_id: vRetA.id,
          quantity: 1,
        },
      ],
      p_notes: "Dedicated Exchange Order",
    });

    const exchOrderId = exchOrderRes.orderId;
    const exchOrderCode = exchOrderRes.orderCode;
    createdTestOrderIds.push(exchOrderId);
    const { data: exchOrderItem } = await (superAdminClient as any).from("order_items").select("*").eq("order_id", exchOrderId).single();

    // TEST 19: Replacement Variant is Authoritative
    const { data: exchReturn } = await (superAdminClient as any)
      .from("returns")
      .insert({
        order_id: exchOrderId,
        order_code: exchOrderCode,
        customer_name: "Client Echange Dédié",
        customer_phone: "+216 71 333 444",
        type: "echange",
        reason: "Taille non adaptée",
        status: "recu",
      })
      .select()
      .single();

    createdTestReturnIds.push(exchReturn.id);

    const { data: exchItemRecord, error: exchItemErr } = await (superAdminClient as any)
      .from("return_items")
      .insert({
        return_id: exchReturn.id,
        order_item_id: exchOrderItem.id,
        returned_variant_id: vRetA.id,
        replacement_variant_id: vRetB.id,
        quantity: 1,
        replacement_quantity: 1,
        product_name: exchOrderItem.product_name,
      })
      .select()
      .single();

    if (!exchItemErr && exchItemRecord.replacement_variant_id === vRetB.id && typeof exchItemRecord.replacement_variant_id === "string") {
      recordTest(19, "RETURNS_EXCHANGE", "Replacement Variant is Authoritative", "PASS", `Authoritative replacement_variant_id (${exchItemRecord.replacement_variant_id}) stored as UUID foreign key.`);
    } else {
      recordTest(19, "RETURNS_EXCHANGE", "Replacement Variant is Authoritative", "FAIL", exchItemErr?.message || "Failed to record replacement variant ID");
    }

    // Record stocks before exchange restock
    const stockABeforeExch = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;
    const stockBBeforeExch = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetB.id).single()).data.stock_quantity;

    // Execute exchange restock
    const { data: exchRestockRes, error: exchRestockErr } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: exchReturn.id,
    });

    const stockAAfterExch = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;
    const stockBAfterExch = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetB.id).single()).data.stock_quantity;

    // TEST 20: Replacement Stock Decrements
    if (!exchRestockErr && exchRestockRes?.success && stockBAfterExch === stockBBeforeExch - 1) {
      recordTest(20, "RETURNS_EXCHANGE", "Replacement Stock Decrements", "PASS", `Replacement variant stock decremented: ${stockBBeforeExch} -> ${stockBAfterExch} (-1).`);
    } else {
      recordTest(20, "RETURNS_EXCHANGE", "Replacement Stock Decrements", "FAIL", `Replacement stock failed to decrement: was ${stockBBeforeExch}, now ${stockBAfterExch}`);
    }

    // TEST 21: Returned Stock Increments
    if (!exchRestockErr && exchRestockRes?.success && stockAAfterExch === stockABeforeExch + 1) {
      recordTest(21, "RETURNS_EXCHANGE", "Returned Stock Increments", "PASS", `Returned variant stock incremented: ${stockABeforeExch} -> ${stockAAfterExch} (+1).`);
    } else {
      recordTest(21, "RETURNS_EXCHANGE", "Returned Stock Increments", "FAIL", `Returned stock failed to increment: was ${stockABeforeExch}, now ${stockAAfterExch}`);
    }

    // TEST 22: Insufficient Replacement Stock Rolls Back
    const { data: failExchReturn } = await (superAdminClient as any)
      .from("returns")
      .insert({
        order_id: exchOrderId,
        order_code: exchOrderCode,
        customer_name: "Client Echange Rollback",
        customer_phone: "+216 71 333 444",
        type: "echange",
        reason: "Test rollback stock insuffisant",
        status: "recu",
      })
      .select()
      .single();

    createdTestReturnIds.push(failExchReturn.id);

    await (superAdminClient as any).from("return_items").insert({
      return_id: failExchReturn.id,
      order_item_id: exchOrderItem.id,
      returned_variant_id: vRetA.id,
      replacement_variant_id: vRetB.id,
      quantity: 1,
      replacement_quantity: 999999, // Exceeds stock
      product_name: exchOrderItem.product_name,
    });

    const stockABeforeFail = stockAAfterExch;
    const stockBBeforeFail = stockBAfterExch;

    const { data: _failRes, error: failErr } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: failExchReturn.id,
    });

    const stockAAfterFail = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;
    const stockBAfterFail = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetB.id).single()).data.stock_quantity;

    if (failErr && failErr.message.includes("Stock insuffisant") && stockAAfterFail === stockABeforeFail && stockBAfterFail === stockBBeforeFail) {
      recordTest(22, "RETURNS_EXCHANGE", "Insufficient Replacement Stock Rolls Back", "PASS", "Transaction rolled back atomically; neither returned nor replacement stock modified.");
    } else {
      recordTest(22, "RETURNS_EXCHANGE", "Insufficient Replacement Stock Rolls Back", "FAIL", `Rollback failed: error=${failErr?.message}`);
    }

    // TEST 23: Second Processing is Idempotent
    const { data: idemRes, error: idemErr } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: exchReturn.id,
    });

    const stockAAfterIdem = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetA.id).single()).data.stock_quantity;
    const stockBAfterIdem = (await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", vRetB.id).single()).data.stock_quantity;

    if (!idemErr && idemRes?.already_restocked === true && stockAAfterIdem === stockAAfterExch && stockBAfterIdem === stockBAfterExch) {
      recordTest(23, "RETURNS_EXCHANGE", "Second Processing is Idempotent", "PASS", "Second call returned already_restocked: true; stock counts remained unchanged.");
    } else {
      recordTest(23, "RETURNS_EXCHANGE", "Second Processing is Idempotent", "FAIL", `Idempotency failure: ${JSON.stringify(idemRes)}`);
    }

    // =========================================================================
    // SECTION 6: INVOICES (Points 24 - 27)
    // =========================================================================

    // TEST 24: Invoice Generated Server-Side (PDFKit binary)
    const testInvData = {
      documentNumber: "FAC-2609-0099",
      orderCode: exchOrderCode,
      createdAt: new Date().toISOString(),
      customerName: "Client Test Facture",
      customerPhone: "+216 71 555 666",
      shippingAddress: "Avenue Habib Bourguiba",
      city: "Tunis",
      governorate: "Tunis",
      paymentMethod: "Paiement à la livraison (COD)",
      paymentStatus: "À percevoir à la livraison",
      subtotal: 420,
      deliveryFee: 0,
      totalAmount: 420,
      items: [
        {
          title: "Blouson Bombardier Noir",
          sku: "AILYS-BLOUSON-01",
          size: "40",
          color: "Noir",
          quantity: 1,
          unitPrice: 420,
          totalPrice: 420,
        },
      ],
    };

    const pdfBuffer = await generateInvoicePdfBuffer(testInvData);
    if (pdfBuffer && pdfBuffer.length > 500 && pdfBuffer.subarray(0, 4).toString() === "%PDF") {
      recordTest(24, "INVOICES", "Invoice Generated Server-Side", "PASS", `Generated valid binary PDF (${pdfBuffer.length} bytes, header %PDF).`);
    } else {
      recordTest(24, "INVOICES", "Invoice Generated Server-Side", "FAIL", "Invalid PDF generated");
    }

    // TEST 25: Invoice Stored Privately (invoices bucket)
    // TEST 26: Invoice Document Registered (order_documents table)
    // Ensure exchOrder has status 'confirme' for invoice generation
    await (superAdminClient as any).from("orders").update({ status: "confirme" }).eq("id", exchOrderId);
    const invoiceRecord = await InvoiceService.generateInvoice(exchOrderId, { client: superAdminClient });

    if (invoiceRecord && invoiceRecord.storagePath && invoiceRecord.storagePath.endsWith(".pdf")) {
      createdTestDocumentIds.push(invoiceRecord.id);
      createdTestStoragePaths.push(invoiceRecord.storagePath);
      // Verify private download via superAdminClient
      const { data: dlData, error: dlErr } = await superAdminClient.storage.from("invoices").download(invoiceRecord.storagePath);
      if (!dlErr && dlData) {
        recordTest(25, "INVOICES", "Invoice Stored Privately", "PASS", `Saved to private bucket 'invoices' at '${invoiceRecord.storagePath}' (${dlData.size} bytes).`);
      } else {
        recordTest(25, "INVOICES", "Invoice Stored Privately", "FAIL", `Download error from private invoices bucket: ${dlErr?.message}`);
      }
    } else {
      recordTest(25, "INVOICES", "Invoice Stored Privately", "FAIL", `Storage path invalid: ${invoiceRecord?.storagePath}`);
    }

    if (invoiceRecord && invoiceRecord.documentNumber && invoiceRecord.documentNumber.startsWith("FAC-")) {
      recordTest(26, "INVOICES", "Invoice Document Registered", "PASS", `Registered in order_documents with number: ${invoiceRecord.documentNumber}.`);
    } else {
      recordTest(26, "INVOICES", "Invoice Document Registered", "FAIL", `Document not registered or invalid number: ${invoiceRecord?.documentNumber}`);
    }

    // TEST 27: Repeated Generation Returns Immutable Existing Document
    const secondInv = await InvoiceService.generateInvoice(exchOrderId, { forceRegenerate: false, client: superAdminClient });
    if (secondInv.id === invoiceRecord.id && secondInv.documentNumber === invoiceRecord.documentNumber) {
      recordTest(27, "INVOICES", "Repeated Generation Returns Immutable Document", "PASS", `Idempotent request returned identical document (${secondInv.documentNumber}) without creating duplicate record.`);
    } else {
      recordTest(27, "INVOICES", "Repeated Generation Returns Immutable Document", "FAIL", "Invoice was re-generated or ID differed!");
    }

    // =========================================================================
    // SECTION 7: STORAGE / RLS (Points 28 - 30)
    // =========================================================================

    // TEST 28: Anonymous Private-Table Access Blocked
    const { data: anonAdminUsers, error: anonAdminErr } = await (anonClient as any).from("admin_users").select("*");
    const { data: anonAudit, error: anonAuditErr } = await (anonClient as any).from("order_edit_history").select("*");
    const { data: anonMovements, error: anonMoveErr } = await (anonClient as any).from("inventory_movements").select("*");

    const rlsBlocked =
      (!anonAdminUsers || anonAdminUsers.length === 0 || anonAdminErr) &&
      (!anonAudit || anonAudit.length === 0 || anonAuditErr) &&
      (!anonMovements || anonMovements.length === 0 || anonMoveErr);

    if (rlsBlocked) {
      recordTest(28, "STORAGE_RLS", "Anonymous Private-Table Access Blocked", "PASS", "RLS policies blocked anonymous SELECT from admin_users, order_edit_history, inventory_movements.");
    } else {
      recordTest(28, "STORAGE_RLS", "Anonymous Private-Table Access Blocked", "FAIL", "Anonymous client was able to read private admin tables!");
    }

    // TEST 29: Anonymous Invoice Access Blocked
    const { data: _anonInvoiceBlob, error: anonInvoiceErr } = await anonClient.storage.from("invoices").download(invoiceRecord.storagePath);
    if (anonInvoiceErr) {
      recordTest(29, "STORAGE_RLS", "Anonymous Invoice Access Blocked", "PASS", `Storage RLS blocked anonymous download: "${anonInvoiceErr.message}".`);
    } else {
      recordTest(29, "STORAGE_RLS", "Anonymous Invoice Access Blocked", "FAIL", "Anonymous client downloaded private invoice PDF!");
    }

    // TEST 30: Anonymous Storage Write Blocked
    const { error: anonUploadErr } = await anonClient.storage.from("invoices").upload(`test-breach-${Date.now()}.pdf`, Buffer.from("hack"));
    if (anonUploadErr) {
      recordTest(30, "STORAGE_RLS", "Anonymous Storage Write Blocked", "PASS", `Storage RLS blocked anonymous upload: "${anonUploadErr.message}".`);
    } else {
      recordTest(30, "STORAGE_RLS", "Anonymous Storage Write Blocked", "FAIL", "Anonymous client was able to upload to invoices bucket!");
    }

    // =========================================================================
    // SECTION 8: DATA / BUILD (Points 31 - 34)
    // =========================================================================

    // TEST 31: Genuine Historical Orders Preserved
    const { data: historicalOrders } = await (superAdminClient as any)
      .from("orders")
      .select("order_code, customer_name, total")
      .in("order_code", ["AILYS-2609-5783", "AILYS-2609-6208", "AILYS-2609-2349"]);

    if (historicalOrders && historicalOrders.length === 3) {
      recordTest(31, "DATA_BUILD", "Genuine Historical Orders Preserved", "PASS", `All 3 historical orders intact: ${historicalOrders.map((o: any) => o.order_code).join(", ")}.`);
    } else {
      recordTest(31, "DATA_BUILD", "Genuine Historical Orders Preserved", "FAIL", `Found ${historicalOrders?.length || 0}/3 genuine historical orders.`);
    }

    // TEST 32: No Test Artifacts Remain
    // Cleanup temporary test items now and verify database is clean
    for (const path of createdTestStoragePaths) {
      await superAdminClient.storage.from("invoices").remove([path]);
    }

    // Restore baseline variant stocks
    for (const [varId, origStock] of Object.entries(variantOriginalStocks)) {
      await (superAdminClient as any).from("product_variants").update({ stock_quantity: origStock }).eq("id", varId);
    }

    await superAdminClient.rpc("cleanup_regression_test" as any, {
      p_order_ids: createdTestOrderIds,
      p_return_ids: createdTestReturnIds,
      p_doc_ids: createdTestDocumentIds,
      p_restock_ids: createdTestRestockIds,
      p_admin_emails: createdTestAdminEmails,
    });

    // Verify cleanup
    const { data: leftoverOrders } = await (superAdminClient as any).from("orders").select("id").in("id", createdTestOrderIds);
    const { data: leftoverReturns } = await (superAdminClient as any).from("returns").select("id").in("id", createdTestReturnIds);
    const { data: leftoverAdmins } = await (superAdminClient as any).from("admin_users").select("id").in("email", createdTestAdminEmails);

    const isClean = (!leftoverOrders || leftoverOrders.length === 0) &&
                    (!leftoverReturns || leftoverReturns.length === 0) &&
                    (!leftoverAdmins || leftoverAdmins.length === 0);

    if (isClean) {
      recordTest(32, "DATA_BUILD", "No Test Artifacts Remain", "PASS", "All test orders, returns, documents, and admin accounts completely removed.");
    } else {
      recordTest(32, "DATA_BUILD", "No Test Artifacts Remain", "FAIL", `Leftover test artifacts detected: orders=${leftoverOrders?.length}, returns=${leftoverReturns?.length}, admins=${leftoverAdmins?.length}`);
    }

    // TEST 33: TypeScript Passes (npx tsc --noEmit)
    console.log("\n--- RUNNING TYPESCRIPT TYPE CHECK (Point 33) ---");
    let tscPass = false;
    let tscOutput = "";
    try {
      tscOutput = execSync("npx tsc --noEmit", { cwd: process.cwd(), encoding: "utf-8" });
      tscPass = true;
    } catch (e: any) {
      tscOutput = e.stdout || e.stderr || e.message;
      tscPass = false;
    }

    if (tscPass) {
      recordTest(33, "DATA_BUILD", "TypeScript Passes", "PASS", "npx tsc --noEmit exited with code 0.");
    } else {
      recordTest(33, "DATA_BUILD", "TypeScript Passes", "FAIL", `TypeScript compilation failed:\n${tscOutput.slice(0, 300)}`);
    }

    // TEST 34: Production Build Passes (npm run build)
    console.log("\n--- RUNNING NEXT.JS PRODUCTION BUILD (Point 34) ---");
    let buildPass = false;
    let buildOutput = "";
    try {
      buildOutput = execSync("npm run build", { cwd: process.cwd(), encoding: "utf-8" });
      buildPass = true;
    } catch (e: any) {
      buildOutput = e.stdout || e.stderr || e.message;
      buildPass = false;
    }

    if (buildPass) {
      recordTest(34, "DATA_BUILD", "Production Build Passes", "PASS", "npm run build exited with code 0.");
    } else {
      recordTest(34, "DATA_BUILD", "Production Build Passes", "FAIL", `Production build failed:\n${buildOutput.slice(0, 300)}`);
    }

  } catch (error: any) {
    console.error("FATAL ERROR IN FINAL CLOSURE SUITE:", error);
  } finally {
    // Redundant safeguard cleanup in case of unexpected errors
    try {
      for (const path of createdTestStoragePaths) {
        await superAdminClient.storage.from("invoices").remove([path]);
      }
      for (const [varId, origStock] of Object.entries(variantOriginalStocks)) {
        await (superAdminClient as any).from("product_variants").update({ stock_quantity: origStock }).eq("id", varId);
      }
      await superAdminClient.rpc("cleanup_regression_test" as any, {
        p_order_ids: createdTestOrderIds,
        p_return_ids: createdTestReturnIds,
        p_doc_ids: createdTestDocumentIds,
        p_restock_ids: createdTestRestockIds,
        p_admin_emails: createdTestAdminEmails,
      });
    } catch (e) {}

    const passed = testResults.filter((t) => t.status === "PASS").length;
    const failed = testResults.filter((t) => t.status === "FAIL").length;

    console.log("\n================================================================================");
    console.log(`FINAL CLOSURE SUITE SUMMARY: ${passed}/${testResults.length} PASSED (${failed} FAILED)`);
    console.log("================================================================================");
  }
}

runFinalClosureSuite().catch(console.error);
