"use client";

import { ChevronLeft, Copy, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReceivePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      const storedPhone = typeof window !== 'undefined' ? localStorage.getItem("userPhoneNumber") : null;
      if (storedPhone) setPhoneNumber(storedPhone);
      if (storedPhone && backendUrl) {
        try {
          const res = await fetch(`${backendUrl}/api/user/profile/${storedPhone}`);
          const data = await res.json();
          if (res.ok && data.success) {
            setWalletAddress(data.data.walletAddress);
          }
        } catch {}
      }
    };
    fetchUserData();
  }, [backendUrl]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 w-95">
      {/* Header */}
      <header className="flex items-center mr-23 gap-4 px-6 py-6 justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-normal">Receive</h1>
      </header>

      {/* Share Phone Number */}
      <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between mb-4 border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Share phone number</p>
            <p className="text-xs text-gray-400">{phoneNumber || "-"}</p>
          </div>
        </div>
        <Copy className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
      </div>

      {/* Copy Wallet Address */}
      <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between mb-12 border border-gray-800">
        <div>
          <p className="text-sm font-medium text-white">Copy wallet address</p>
          <p className="text-xs text-gray-400 break-all">
            {walletAddress || "-"}
          </p>
        </div>
        <Copy className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
      </div>

      {/* Note */}
      <p className="text-gray-500 text-sm text-center leading-relaxed">
        Funds received are automatically converted to Naira
      </p>
    </div>
  );
}
