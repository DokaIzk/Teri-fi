"use client";

import {
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  Bell,
  Headphones,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/MainLayout";

export default function SettingsPage() {
  const router = useRouter();

  const settingsItems = [
    { id: 1, icon: <User className="w-5 h-5" />, label: "Account" },
    {
      id: 2,
      icon: <SlidersHorizontal className="w-5 h-5" />,
      label: "Preferences",
    },
    { id: 3, icon: <Shield className="w-5 h-5" />, label: "Security" },
    { id: 4, icon: <Bell className="w-5 h-5" />, label: "Notification" },
    { id: 5, icon: <HelpCircle className="w-5 h-5" />, label: "Help center" },
    {
      id: 6,
      icon: <Headphones className="w-5 h-5" />,
      label: "Contact support",
    },
    { id: 7, icon: <Settings className="w-5 h-5" />, label: "About Teri-fi" },
  ];

  return (
    <MainLayout>
      <div className="px-6 py-8 w-96">
        {/* Header */}
        <header className="flex items-center mr-23 gap-4 px-6 py-6 justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-normal">Settings</h1>
        </header>

        {/* List */}
        <div className="space-y-3">
          {settingsItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400">{item.icon}</div>
                <p className="text-sm">{item.label}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </div>
          ))}

          {/* Log out */}
          <div className="flex items-center justify-between bg-gray-900 p-4 rounded-2xl border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer mt-2">
            <div className="flex items-center gap-3 text-red-500">
              <LogOut className="w-5 h-5" />
              <p className="text-sm">Log out</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
