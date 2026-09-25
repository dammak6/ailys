import fs from "fs";
import path from "path";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const superAdminClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function runExchangeFlowTest() {
  console.log("================================================================================");
  console.log("             AÏLYS SECTION 2: REAL EXCHANGE INVENTORY TEST                      ");
  console.log("             Target: ailys (kafyatqatggifedqtctm, eu-west-1)                   ");
  console.log("================================================================================\n");

  const createdOrderIds: string[] = [];
  const createdReturnIds: string[] = [];

  const adminPassword = process.env.ADMIN_TEST_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_TEST_PASSWORD environment variable is required to run exchange flow tests.");
  }

  // Authenticate as Super Admin
  const { data: authData, error: authErr } = await superAdminClient.auth.signInWithPassword({
    email: "direction@ailys.tn",
    password: adminPassword,
  });

  if (authErr || !authData.session) {
    throw new Error(`Failed to authenticate as super admin: ${authErr?.message}`);
  }
  console.log("✅ Authenticated as Super Admin");

  // Step 1: Pick two distinct active variants with stock > 2
  const { data: variants, error: varErr } = await (superAdminClient as any)
    .from("product_variants")
    .select("id, product_id, sku, stock_quantity")
    .gt("stock_quantity", 2)
    .limit(2);

  if (varErr || !variants || variants.length < 2) {
    throw new Error(`Need at least 2 variants with stock > 2. Found: ${variants?.length}`);
  }

  const variantA = variants[0]; // Returned variant
  const variantB = variants[1]; // Replacement variant

  const initialStockA = variantA.stock_quantity;
  const initialStockB = variantB.stock_quantity;

  console.log(`\nInitial Variants Selected:`);
  console.log(`- Variant A (Returned):    ID=${variantA.id} (${variantA.sku}) | Initial Stock=${initialStockA}`);
  console.log(`- Variant B (Replacement): ID=${variantB.id} (${variantB.sku}) | Initial Stock=${initialStockB}\n`);

  try {
    // Step 2: Create a temporary test order containing Variant A
    const orderPayload = {
      p_customer_name: "Client Test Exchange",
      p_phone: "+216 99 888 777",
      p_governorate: "Tunis",
      p_city: "Tunis",
      p_address: "Avenue Habib Bourguiba",
      p_items: [
        {
          variant_id: variantA.id,
          quantity: 1,
        },
      ],
      p_notes: "Exchange validation order",
    };

    const { data: checkoutRes, error: checkoutErr } = await (superAdminClient as any).rpc("execute_checkout", orderPayload);
    if (checkoutErr || !checkoutRes?.orderId) {
      throw new Error(`Failed to create test order: ${checkoutErr?.message}`);
    }

    const testOrderId = checkoutRes.orderId;
    const testOrderCode = checkoutRes.orderCode;
    createdOrderIds.push(testOrderId);
    console.log(`✅ Step 1: Created test order ${testOrderCode} (${testOrderId})`);

    // Verify checkout decremented Variant A by 1
    const { data: varAAfterOrder } = await (superAdminClient as any)
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantA.id)
      .single();
    const stockABeforeReturn = varAAfterOrder.stock_quantity;
    console.log(`   └─ Variant A stock after order: ${stockABeforeReturn} (decremented from ${initialStockA})`);

    // Fetch order item
    const { data: ordItem } = await (superAdminClient as any)
      .from("order_items")
      .select("*")
      .eq("order_id", testOrderId)
      .single();

    // Step 3: Create an exchange return request with authoritative replacement_variant_id
    const { data: returnRecord, error: returnErr } = await (superAdminClient as any)
      .from("returns")
      .insert({
        order_id: testOrderId,
        order_code: testOrderCode,
        customer_name: "Client Test Exchange",
        customer_phone: "+216 99 888 777",
        type: "echange",
        reason: "Taille non adaptée, demande d'échange",
        status: "recu",
      })
      .select()
      .single();

    if (returnErr || !returnRecord) {
      throw new Error(`Failed to create exchange return: ${returnErr?.message}`);
    }

    const testReturnId = returnRecord.id;
    createdReturnIds.push(testReturnId);

    // Insert return item explicitly linking returned_variant_id and replacement_variant_id
    const { error: itemErr } = await (superAdminClient as any).from("return_items").insert({
      return_id: testReturnId,
      order_item_id: ordItem.id,
      returned_variant_id: variantA.id,
      replacement_variant_id: variantB.id,
      quantity: 1,
      replacement_quantity: 1,
      product_name: ordItem.product_name,
    });

    if (itemErr) {
      throw new Error(`Failed to insert return item: ${itemErr.message}`);
    }
    console.log(`✅ Step 2: Created exchange record ${returnRecord.request_code} linking returned=${variantA.id} -> replacement=${variantB.id}`);

    // Step 4: Execute process_return_restock
    console.log("\n--- EXECUTING process_return_restock (Call 1) ---");
    const { data: restockRes1, error: restockErr1 } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: testReturnId,
    });

    if (restockErr1 || !restockRes1?.success) {
      throw new Error(`process_return_restock failed: ${restockErr1?.message || JSON.stringify(restockRes1)}`);
    }
    console.log(`✅ Step 3: process_return_restock succeeded:`, restockRes1);

    // Step 5: Verify stock movements
    const { data: varAAfterRestock } = await (superAdminClient as any)
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantA.id)
      .single();

    const { data: varBAfterRestock } = await (superAdminClient as any)
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantB.id)
      .single();

    console.log(`\nVerifying Stock After Exchange Restock:`);
    console.log(`- Variant A stock: was ${stockABeforeReturn}, now ${varAAfterRestock.stock_quantity} (Expected: ${stockABeforeReturn + 1})`);
    console.log(`- Variant B stock: was ${initialStockB}, now ${varBAfterRestock.stock_quantity} (Expected: ${initialStockB - 1})`);

    const stockACorrect = varAAfterRestock.stock_quantity === stockABeforeReturn + 1;
    const stockBCorrect = varBAfterRestock.stock_quantity === initialStockB - 1;

    if (!stockACorrect || !stockBCorrect) {
      throw new Error(`Stock verification failed: Stock A correct=${stockACorrect}, Stock B correct=${stockBCorrect}`);
    }
    console.log(`✅ Step 4: Stock changes verified: Variant A +1, Variant B -1`);

    // Step 6: Verify inventory_movements records
    const { data: movements } = await (superAdminClient as any)
      .from("inventory_movements")
      .select("*")
      .eq("related_return_id", testReturnId);

    console.log(`\nVerifying Inventory Movements:`);
    console.log(`- Total movements recorded for return: ${movements?.length}`);
    const returnMovement = movements?.find((m: any) => m.variant_id === variantA.id && m.reason === "return" && m.quantity_delta === 1);
    const exchangeMovement = movements?.find((m: any) => m.variant_id === variantB.id && m.reason === "exchange" && m.quantity_delta === -1);

    if (!returnMovement || !exchangeMovement) {
      throw new Error(`Missing expected inventory movement records for return or exchange!`);
    }
    console.log(`✅ Step 5: Inventory movements verified:`);
    console.log(`   └─ Variant A: reason='return', delta=+1`);
    console.log(`   └─ Variant B: reason='exchange', delta=-1`);

    // Step 7: Idempotency Test - Call process_return_restock 2nd time
    console.log("\n--- TESTING IDEMPOTENCY (Call 2) ---");
    const { data: restockRes2, error: restockErr2 } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: testReturnId,
    });

    if (restockErr2) {
      throw new Error(`Idempotency call raised unexpected error: ${restockErr2.message}`);
    }

    const { data: varAAfter2 } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantA.id).single();
    const { data: varBAfter2 } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantB.id).single();

    const { data: movementsAfter2 } = await (superAdminClient as any)
      .from("inventory_movements")
      .select("*")
      .eq("related_return_id", testReturnId);

    const idempotencyPass =
      restockRes2?.already_restocked === true &&
      varAAfter2.stock_quantity === varAAfterRestock.stock_quantity &&
      varBAfter2.stock_quantity === varBAfterRestock.stock_quantity &&
      movementsAfter2?.length === movements?.length;

    if (!idempotencyPass) {
      throw new Error(`Idempotency failed: ${JSON.stringify(restockRes2)}`);
    }
    console.log(`✅ Step 6: Idempotency verified: already_restocked=true, no second increment/decrement, no duplicate movement`);

    // Step 8: Failure / Rollback Test
    console.log("\n--- TESTING ATOMIC ROLLBACK ON INSUFFICIENT REPLACEMENT STOCK ---");
    // Create a 2nd exchange return where replacement_quantity exceeds available stock (e.g. 99999)
    const { data: failReturn } = await (superAdminClient as any)
      .from("returns")
      .insert({
        order_id: testOrderId,
        order_code: testOrderCode,
        customer_name: "Client Test Exchange Fail",
        customer_phone: "+216 99 888 777",
        type: "echange",
        reason: "Demande échange avec stock excessif",
        status: "recu",
      })
      .select()
      .single();

    createdReturnIds.push(failReturn.id);

    const { error: failItemErr } = await (superAdminClient as any).from("return_items").insert({
      return_id: failReturn.id,
      order_item_id: ordItem.id,
      returned_variant_id: variantA.id,
      replacement_variant_id: variantB.id,
      quantity: 1,
      replacement_quantity: 99999, // Exceeds stock
      product_name: ordItem.product_name,
    });
    if (failItemErr) {
      throw new Error(`Failed to insert fail return item: ${failItemErr.message}`);
    }

    const stockABeforeFail = varAAfter2.stock_quantity;
    const stockBBeforeFail = varBAfter2.stock_quantity;

    const { data: failRes, error: failErr } = await (superAdminClient as any).rpc("process_return_restock", {
      p_return_id: failReturn.id,
    });

    console.log(`Rollback result: error=${failErr?.message}, data=${JSON.stringify(failRes)}`);

    const { data: stockAAfterFail } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantA.id).single();
    const { data: stockBAfterFail } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantB.id).single();

    const rollbackPass =
      failErr &&
      failErr.message.includes("Stock insuffisant") &&
      stockAAfterFail.stock_quantity === stockABeforeFail &&
      stockBAfterFail.stock_quantity === stockBBeforeFail;

    if (!rollbackPass) {
      throw new Error(`Rollback verification failed! Stock modified or error not caught.`);
    }
    console.log(`✅ Step 7: Atomic rollback verified: Exception 'Stock insuffisant' raised, Stock A and Stock B remained completely unchanged`);

  } finally {
    // Step 9: Restore initial variant stocks and run cleanup
    console.log("\n--- RESTORING VARIANT STOCKS & CLEANING TEST ARTIFACTS ---");
    await (superAdminClient as any)
      .from("product_variants")
      .update({ stock_quantity: initialStockA })
      .eq("id", variantA.id);

    await (superAdminClient as any)
      .from("product_variants")
      .update({ stock_quantity: initialStockB })
      .eq("id", variantB.id);

    await (superAdminClient as any).rpc("cleanup_regression_test", {
      p_order_ids: createdOrderIds,
      p_return_ids: createdReturnIds,
    });

    // Double check stocks
    const { data: finalA } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantA.id).single();
    const { data: finalB } = await (superAdminClient as any).from("product_variants").select("stock_quantity").eq("id", variantB.id).single();

    console.log(`Restored stocks: Variant A=${finalA.stock_quantity} (original ${initialStockA}), Variant B=${finalB.stock_quantity} (original ${initialStockB})`);
    console.log("✅ Step 8: Cleaned up temporary test orders, returns, and inventory movements.");
  }

  console.log("\n================================================================================");
  console.log("             SECTION 2 REAL EXCHANGE INVENTORY TEST: ALL PASSED                 ");
  console.log("================================================================================");
}

runExchangeFlowTest().catch((err) => {
  console.error("EXCHANGE TEST ERROR:", err);
  process.exit(1);
});
