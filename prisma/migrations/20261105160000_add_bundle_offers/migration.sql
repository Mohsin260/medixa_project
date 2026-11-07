-- Native bundling / quantity breaks (purely additive)
-- Creates two new tables and their indexes/foreign keys.
-- No existing table, column, model, or row is modified by this migration.

-- CreateTable
CREATE TABLE "bundle_offers" (
    "id" SERIAL NOT NULL,
    "product_id" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "badge_text" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bundle_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_tiers" (
    "id" SERIAL NOT NULL,
    "bundle_offer_id" INTEGER NOT NULL,
    "quantity_required" INTEGER NOT NULL,
    "discount_value" DECIMAL(10,2) NOT NULL,
    "discount_type" VARCHAR(50) NOT NULL,
    "label" VARCHAR(255),

    CONSTRAINT "bundle_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bundle_offers_product_id_idx" ON "bundle_offers"("product_id");

-- CreateIndex
CREATE INDEX "bundle_offers_is_active_idx" ON "bundle_offers"("is_active");

-- CreateIndex
CREATE INDEX "bundle_tiers_bundle_offer_id_idx" ON "bundle_tiers"("bundle_offer_id");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_tiers_bundle_offer_id_quantity_required_key" ON "bundle_tiers"("bundle_offer_id", "quantity_required");

-- AddForeignKey
ALTER TABLE "bundle_offers" ADD CONSTRAINT "bundle_offers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bundle_tiers" ADD CONSTRAINT "bundle_tiers_bundle_offer_id_fkey" FOREIGN KEY ("bundle_offer_id") REFERENCES "bundle_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
