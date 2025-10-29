"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";

const ConfirmSend = () => {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [toPhone, setToPhone] = useState("");
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Retrieve values from localStorage (set in sendMoney page)
    setToPhone(localStorage.getItem("sendMoney_toPhone") || "");
    setToken(localStorage.getItem("sendMoney_token") || "");
    setAmount(localStorage.getItem("sendMoney_amount") || "");
    setPin(""); // PIN should be entered by the user on this page
  }, []);

  const handleConfirm = async () => {
    setError("");
    const fromPhone = localStorage.getItem("userPhoneNumber") || "";
    if (!fromPhone || !toPhone || !amount || !pin) {
      setError("All fields are required: fromPhone, toPhone, amount, pin");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/api/wallet/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromPhone, toPhone, amount, pin })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Transaction failed");
        return;
      }
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-8 relative w-95">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
        </button>
        <h1 className="text-xl font-semibold">Send</h1>
        <X 
          className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors" 
          onClick={() => router.back()}
        />
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div className="bg-gray-900 rounded-xl px-4 py-3">
          <input
            readOnly
            value={toPhone}
            className="bg-transparent outline-none text-sm w-full text-gray-300"
          />
        </div>
        <div className="bg-gray-900 rounded-xl px-4 py-3">
          <input
            readOnly
            value={token}
            className="bg-transparent outline-none text-sm w-full text-gray-300"
          />
        </div>
        <div className="bg-gray-900 rounded-xl px-4 py-3">
          <input
            readOnly
            value={amount}
            className="bg-transparent outline-none text-sm w-full text-gray-300"
          />
        </div>
        <div className="bg-gray-900 rounded-xl px-4 py-3">
          <input
            type="password"
            placeholder="Enter your PIN"
            value={pin}
            onChange={e => setPin(e.target.value)}
            className="bg-transparent outline-none text-sm w-full text-gray-300"
          />
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-900 rounded-2xl p-4 mt-8 text-sm text-gray-300">
        <p className="flex justify-between mb-2">
          <span>Amount:</span> <span>{amount}</span>
        </p>
        <p className="flex justify-between mb-2">
          <span>Recipient gets:</span> <span className="text-white">NGN {amount}</span>
        </p>
        <p className="flex justify-between">
          <span>To:</span> <span>{toPhone}</span>
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm text-center mt-4">{error}</div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => router.push("/send")}
          className="flex-1 border border-cyan-500 text-cyan-500 py-3 hover:bg-cyan-500 hover:text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 border border-cyan-500 text-cyan-500 py-3 hover:bg-cyan-500 hover:text-white rounded-xl text-sm font-medium cursor-pointer"
        >
          Confirm and Send
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-gray-900 rounded-2xl p-8 text-center w-72 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-1">Congratulations!</h2>
            <p className="text-gray-400 text-sm">Your transaction was successful.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfirmSend

