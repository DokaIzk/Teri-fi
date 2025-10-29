"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowDownLeft, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      const phoneNumber = typeof window !== 'undefined' ? localStorage.getItem("userPhoneNumber") : null;
      if (!phoneNumber) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile to get wallet address
        const userRes = await fetch(`${backendUrl}/api/user/profile/${phoneNumber}`);
        const userData = await userRes.json();
        if (!userRes.ok || !userData.success) {
          throw new Error(userData.message || "Failed to fetch user profile");
        }
        const walletAddress = userData.data.walletAddress;
        // Fetch transactions
        const txRes = await fetch(`${backendUrl}/api/wallet/transactions/${walletAddress}`);
        const txData = await txRes.json();
        if (!txRes.ok) {
          throw new Error(txData.message || "Failed to fetch transactions");
        }
        setTransactions(txData.transactions || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [backendUrl]);

  const getStatusIcon = (status: string) => {
    if (status === "Delivered" || status === "Success") {
      return (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill="currentColor" opacity="0.2" />
          <path
            d="M3.5 6L5.5 8L8.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    if (status === "Pending") {
      return (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6 3V6L8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    if (status === "Failed") {
      return (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill="currentColor" opacity="0.2" />
          <path
            d="M4 4L8 8M8 4L4 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="w-96">
        {/* Header */}
        <header className="flex items-center mr-20 gap-4 px-6 py-6 justify-between mr-10 ">
          <button
            onClick={() => router.push("/home")}
            className="text-gray-300 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-normal">Transaction history</h1>
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">{error}</div>
        ) : transactions.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
              <Image
                src="/history.png"
                alt="You have no recent transactions yet"
                width={300}
                height={300}
                className="mx-auto opacity-90"
                priority
              />
            </div>
          </div>
        ) : (
          // Transactions List
          <div className="px-6 py-6 space-y-3">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                onClick={() => router.push(`/transactions/${transaction.id}`)}
                className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between gap-1 border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {/* Left Side - Icon and Info */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                    {transaction.type === "sent" ? (
                      <ArrowUpRight className="w-5 h-5 text-cyan-500" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-sm font-medium">
                        {transaction.title}
                      </span>
                      <span
                        className={`text-xs flex items-center gap-1`}
                      >
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.to}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.date}
                    </div>
                  </div>
                </div>

                {/* Right Side - Amount */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-white font-medium text-sm mb-1">
                    {transaction.amount}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {transaction.nairaAmount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionHistory;
