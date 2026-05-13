-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'Ordra Demo',
    "product_name" TEXT NOT NULL,
    "product_image" TEXT,
    "seller_name" TEXT NOT NULL,
    "seller_id" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "payment_method" TEXT NOT NULL,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "estimated_delivery" DATETIME NOT NULL,
    "confidence_score" INTEGER NOT NULL DEFAULT 85,
    "emotional_state" TEXT NOT NULL DEFAULT 'NORMAL',
    "current_stage" TEXT NOT NULL DEFAULT 'payment_verified',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "order_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_by" TEXT,
    "proof_data" JSONB,
    "notes" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "order_events_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_by" TEXT NOT NULL,
    "verification_hash" TEXT NOT NULL,
    CONSTRAINT "ledger_entries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("order_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "seller_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seller_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "reliability_score" REAL NOT NULL DEFAULT 4.5,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profiles_seller_id_key" ON "seller_profiles"("seller_id");
