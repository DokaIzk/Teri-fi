"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Bell,
  ChevronDown,
  ArrowUp,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

const HomeWithTransactions = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<{ eth: string; usdt: string } | null>(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUserAndTransactions = async () => {
      const phoneNumber = typeof window !== 'undefined' ? localStorage.getItem("userPhoneNumber") : null;
      if (!phoneNumber) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile
        const userRes = await fetch(`${backendUrl}/api/user/profile/${phoneNumber}`);
        const userData = await userRes.json();
        if (!userRes.ok || !userData.success) {
          throw new Error(userData.message || "Failed to fetch user profile");
        }
        setWalletAddress(userData.data.walletAddress);
        setBalance({ eth: userData.data.balance.eth, usdt: userData.data.balance.usdt });
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
    fetchUserAndTransactions();
  }, [backendUrl]);

  return (
    <MainLayout>
      <div>
        {/* Header */}
        <header className="flex justify-between items-center px-6 pt-8 pb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-300">{walletAddress ? `${walletAddress.slice(0, 4)}...` : "Your Wallet"}</h1>
            <ChevronDown className="w-5 h-5 text-gray-300 cursor-pointer" />
          </div>
          <div className="flex items-center gap-4">
            <Copy className="w-5 h-5 text-gray-300 cursor-pointer" />
            <svg
              className="w-5 h-5 text-gray-300 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m-4 12h2a2 2 0 002-2v-2"
              />
              <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
            </svg>
            <button onClick={() => router.push("/notifications")}>
              <Bell className="w-5 h-5 text-gray-300 cursor-pointer" />
            </button>
          </div>
        </header>

        {/* Balance Card */}
        <div className="mx-6 mb-6">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-3xl p-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-gray-400 line-through text-xl">₦</span>
                  <span className="text-3xl font-light tracking-tight">
                    {balanceVisible ? (balance ? balance.usdt : "...") : "••••••"}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {balanceVisible ? (balance ? `${balance.eth} ETH` : "...") : "••••••"}
                </div>
              </div>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="mt-2"
              >
                {balanceVisible ? (
                  <Eye className="w-6 h-6 text-gray-400 cursor-pointer" />
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-400 cursor-pointer" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 mb-12 flex gap-3">
          <button
            onClick={() => router.push("/sendMoney")}
            className="bg-transparent border border-cyan-500 text-cyan-500 font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
            Send Money
          </button>
          <button
            onClick={() => router.push("/receiveMoney")}
            className="bg-transparent border border-cyan-500 text-cyan-500 font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-white transition-colors text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Receive Money
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="px-6 mb-4">
          <div className="bg-gray-900 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base text-white">Recent transactions</h2>
              <button className="text-cyan-500 text-sm cursor-pointer">View All</button>
            </div>
            {loading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            <div className="space-y-4">
              {transactions.length === 0 && !loading && !error && (
                <div className="text-gray-500 text-center py-8">No recent transactions found.</div>
              )}
              {transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">
                          {transaction.type}
                        </span>
                        <span
                          className={`text-xs text-gray-500 flex items-center gap-1`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        to: {transaction.to}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
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
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeWithTransactions;
