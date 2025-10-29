"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const SendMoney = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({
    phone: "",
    token: "",
    amount: ""
  });
  const stableCoins = [
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "USDT", name: "Tether" },
    { symbol: "DAI",  name: "Dai" },
  ];
  const [amount, setAmount] = useState("");
  const [showRecent, setShowRecent] = useState(false);
  const [showTokenDropdown, setShowTokenDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectRecipient = (value: string) => {
    setPhone(value);
    setShowRecent(false);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  // Hide recent dropdown if user types a value not in history
  useEffect(() => {
    if (
      phone.length > 0 &&
      !recentTransactions.some((t) => t.value.startsWith(phone))
    ) {
      setShowRecent(false);
    }
    // Auto-select if phone matches a recent transaction exactly
    const match = recentTransactions.find((t) => t.value === phone);
    if (match) {
      setPhone(match.value);
      setShowRecent(false);
    }
  }, [phone]);

  // Auto-clear errors after a short delay so the UI doesn't stay red
  useEffect(() => {
    const timers: number[] = [];
    if (errors.phone) {
      timers.push(window.setTimeout(() => {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }, 1000));
    }
    if (errors.token) {
      timers.push(window.setTimeout(() => {
        setErrors((prev) => ({ ...prev, token: "" }));
      }, 1000));
    }
    if (errors.amount) {
      timers.push(window.setTimeout(() => {
        setErrors((prev) => ({ ...prev, amount: "" }));
      }, 1000));
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [errors.phone, errors.token, errors.amount]);

  const handleQuickSelect = (value: string) => {
    setAmount(value);
    if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const handleContinue = () => {
    const trimmedPhone = phone.trim();
    const trimmedAmount = amount.trim();
    const newErrors = { phone: "", token: "", amount: "" };

    // Phone or wallet address validation
    if (!trimmedPhone) {
      newErrors.phone = "Please enter a phone number or wallet address";
    } else {
      const isPhone = /^\+?\d{7,15}$/.test(trimmedPhone);
      const isAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmedPhone);
      if (!isPhone && !isAddress) {
        newErrors.phone = "Enter a valid phone number or wallet address";
      }
    }

    // Token selection validation
    if (!token) {
      newErrors.token = "Please select a token";
    }

    // Amount validation (allow presets like "$50")
    if (!trimmedAmount) {
      newErrors.amount = "Please enter an amount";
    } else {
      const numeric = Number(trimmedAmount.replace(/[^0-9.]/g, ""));
      if (!(numeric > 0)) {
        newErrors.amount = "Enter a valid amount greater than 0";
      }
    }

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(Boolean);
    if (!hasErrors) {
      // Save values to localStorage for confirm page
      localStorage.setItem("sendMoney_toPhone", phone);
      localStorage.setItem("sendMoney_token", token);
      localStorage.setItem("sendMoney_amount", amount);
      // Optionally clear pin
      localStorage.removeItem("sendMoney_pin");
      router.push("/sendMoney/confirm");
    }
  };

  useEffect(() => {
    const fetchRecentRecipients = async () => {
      const phoneNumber = typeof window !== 'undefined' ? localStorage.getItem("userPhoneNumber") : null;
      if (!phoneNumber) return;
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        // Fetch user profile to get wallet address
        const userRes = await fetch(`${backendUrl}/api/user/profile/${phoneNumber}`);
        const userData = await userRes.json();
        if (!userRes.ok || !userData.success) return;
        const walletAddress = userData.data.walletAddress;
        // Fetch recent transactions
        const txRes = await fetch(`${backendUrl}/api/wallet/transactions/${walletAddress}`);
        const txData = await txRes.json();
        if (!txRes.ok) return;
        // Extract recipients from transactions
        const recipients = txData.transactions
          ? txData.transactions.map((tx: any) => ({ id: tx.id, value: tx.to }))
          : [];
        setRecentTransactions(recipients);
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchRecentRecipients();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-8 w-95">
      {/* Header */}
      <div className="flex justify-between mr-5 items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Send</h1>
        <X
          className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
          onClick={() => router.back()}
        />
      </div>

      {/* Input fields */}
      <div className="space-y-4">
        <div className="relative">
          <div className={`bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center border ${
            errors.phone ? "border-red-500 ring-1 ring-red-500/30" : "border-gray-800"
          }`}>
            <input
              type="text"
              placeholder="Enter recipient phone/ wallet"
              className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500 w-full"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              onFocus={() => setShowRecent(true)}
              ref={inputRef}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform cursor-pointer ${showRecent ? "rotate-180" : ""
                }`}
              onClick={() => setShowRecent(!showRecent)}
            />
          </div>

          {showRecent && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-lg z-50 max-h-60 overflow-auto border border-gray-700"
            >
              <div className="p-2 text-xs text-gray-400 border-b border-gray-700">
                Recent
              </div>
              {recentTransactions.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">No recent transactions</div>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleSelectRecipient(transaction.value)}
                  >
                    <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{transaction.value}</span>
                  </div>
                ))
              )}
            </div>
          )}
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-xs text-red-400">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="relative">
          <div className={`bg-gray-900 rounded-xl px-4 py-3 flex justify-between items-center border ${
            errors.token ? "border-red-500 ring-1 ring-red-500/30" : "border-gray-800"
          }`}>
            <input
              type="text"
              placeholder="Token type"
              className="bg-transparent outline-none text-sm flex-1 placeholder-gray-500"
              value={token}
              readOnly
              onFocus={() => setShowTokenDropdown(true)}
              onClick={() => setShowTokenDropdown(!showTokenDropdown)}
              aria-invalid={!!errors.token}
              aria-describedby={errors.token ? "token-error" : undefined}
            />
            <ChevronDown
              className={`w-4 h-4 text-gray-400 cursor-pointer transition-transform cursor-pointer ${showTokenDropdown ? "rotate-180" : ""
                }`}
              onClick={() => setShowTokenDropdown(!showTokenDropdown)}
            />
          </div>
          {showTokenDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-gray-800 rounded-xl shadow-lg z-50 border border-gray-700">
              {stableCoins.map((coin) => (
                <div
                  key={coin.symbol}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-sm grid grid-cols-2 gap-4"
                  onClick={() => {
                    setToken(coin.symbol);
                    setShowTokenDropdown(false);
                    if (errors.token) setErrors((prev) => ({ ...prev, token: "" }));
                  }}
                >
                  <span className="font-medium">{coin.symbol}</span>
                  <span className="text-gray-400 text-right pr-2">{coin.name}</span>
                </div>
              ))}
            </div>
          )}
          {errors.token && (
            <p id="token-error" className="mt-1 text-xs text-red-400">
              {errors.token}
            </p>
          )}
        </div>

        <div className={`bg-gray-900 rounded-xl px-4 py-3 border ${
          errors.amount ? "border-red-500 ring-1 ring-red-500/30" : "border-gray-800"
        }`}>
          <input
            type="text"
            placeholder="Enter amount"
            className="bg-transparent outline-none text-sm w-full placeholder-gray-500"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
        </div>
        {errors.amount && (
          <p id="amount-error" className="text-xs text-red-400">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-3 mt-6">
        {["$50", "$100", "$200"].map((val) => (
          <button
            key={val}
            onClick={() => handleQuickSelect(val)}
            className="bg-gray-900 rounded-xl py-3 px-8 text-sm text-gray-200 flex-1 cursor-pointer"
          >
            {val}
          </button>
        ))}
      </div>

      {/* Next button */}
      <div className="mt-10">
        <button
          onClick={handleContinue}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-xl text-sm cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
