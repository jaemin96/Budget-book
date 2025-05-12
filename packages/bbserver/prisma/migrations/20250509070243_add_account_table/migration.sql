-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "bankName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "totalBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "availableBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "savingBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "fixedDepositBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "investmentBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "holdBalance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
