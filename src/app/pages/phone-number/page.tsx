"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PhoneNumberPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 15) {
      setPhoneNumber(value);
      if (error) setError("");
    }
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation: must be at least 10 digits
    if (phone.length < 10) {
      return "Phone number must be at least 10 digits";
    }
    return "";
  };

  const handleContinue = () => {
    const validationError = validatePhoneNumber(phoneNumber);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    // Save phone number to localStorage
    localStorage.setItem("userPhoneNumber", phoneNumber);
    
    // Navigate to setup password page
    router.push("/pages/password-pages/setup-password");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-2xl font-semibold mb-2">Enter your phone number</h1>
        </div>

        {/* Phone Input */}
        <div className="mb-2">
          <div className="relative">
            
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="e.g +2348126273411"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-4 pl-8  mb-[20px] text-white text-lg placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
              autoFocus
            />
          </div>
          
          {/* Error message */}
          {error && (
            <p className="mt-2 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}
          
    
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={phoneNumber.length < 10}
          className={`w-full py-3 rounded-lg text-white text-lg font-medium transition-all ${
            phoneNumber.length >= 10
              ? "bg-sky-500 hover:bg-sky-600 active:bg-sky-700"
              : "bg-neutral-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          Continue
        </button>

        {/* Additional info */}
        <div className="mt-25 text-center">
          <p className="text-xs text-gray-500">
            Your phone number will be used to send and receive money across Africa
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneNumberPage;
