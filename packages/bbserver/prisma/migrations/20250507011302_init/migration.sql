-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionCategory" AS ENUM ('SALARY', 'INSURANCE', 'DRINK', 'FOOD', 'SHOPPING', 'TRANSPORT', 'SUBSCRIBE', 'PHONE', 'DUES', 'PRESENT', 'SAVINGS', 'INVESTMENT', 'EMERGENCY_FUND', 'ETC');

-- CreateEnum
CREATE TYPE "TransactionPaymentType" AS ENUM ('CREDIT_CARD', 'CHECK_CARD', 'KAKAO_PAY', 'APPLE_PAY', 'NAVER_PAY', 'TOSS', 'BANK_TRANSFER', 'CASH', 'POINT', 'GIFT_CARD', 'VIRTUAL_ACCOUNT', 'CRYPTO', 'ETC');

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "depositor" TEXT,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" "TransactionCategory" DEFAULT 'ETC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentType" "TransactionPaymentType",

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
