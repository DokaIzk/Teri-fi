"use client";

import { Home, Send, Clock, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Send, label: "Send", path: "/sendMoney" },
    { icon: Clock, label: "Transactions", path: "/transactions" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-black px-6 py-4 max-w-sm w-full">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            pathname === path || (path === "/home" && pathname === "/");
          return (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                isActive ? "text-cyan-500" : "text-gray-500 hover:text-cyan-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
