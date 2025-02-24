-- CreateTable
CREATE TABLE "URL" (
    "id" TEXT NOT NULL,
    "original" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "URL_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URL_short_key" ON "URL"("short");
