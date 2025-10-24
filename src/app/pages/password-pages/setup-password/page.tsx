"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SetupPasswordPage = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleInput = (num: string) => {
    if (pin.length < 4) setPin(pin + num);
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleContinue = async () => {
    const storedPhoneNumber = typeof window !== 'undefined' ? localStorage.getItem("userPhoneNumber") : null;
    console.log("Stored Phone Number:", storedPhoneNumber);
    if (pin.length === 4 && storedPhoneNumber) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendUrl}/user/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: storedPhoneNumber,
            pin,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }
        router.push("/pages/password-pages/confirm-password");
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Something went wrong");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    } else if (!storedPhoneNumber) {
      setError("Phone number is required");
    } else if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center text-white px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold">Setup your password</h1>
        <p className="text-gray-400 mt-2">
          You will use this to log into your account
        </p>
      </div>

      {/* PIN display */}
      <div className="flex gap-2 mb-6">
        {Array(6)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full ${
                pin.length > i ? "bg-white" : "bg-gray-700"
              }`}
            ></div>
          ))}
      </div>

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4">
        {[..."123456789"].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num)}
            className="text-2xl font-semibold bg-neutral-800 w-16 h-16 rounded-full"
          >
            {num}
          </button>
        ))}
        <div></div>
        <button
          onClick={() => handleInput("0")}
          className="text-2xl font-semibold bg-neutral-800 w-16 h-16 rounded-full"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="text-blue-400 text-lg font-medium"
        >
          Delete
        </button>
      </div>

      {/* Continue button - shows when PIN is complete */}
      {pin.length === 6 && (
        <button
          onClick={handleContinue}
          className="mt-8 w-full max-w-xs py-3 bg-sky-500 rounded-lg text-white text-lg font-medium"
          disabled={loading}
        >
          {loading ? "Loading..." : "Continue"}
        </button>
      )}

      {/* Error message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && <div className="text-gray-400 mt-4">Registering...</div>}
    </div>
  );
};

export default SetupPasswordPage;