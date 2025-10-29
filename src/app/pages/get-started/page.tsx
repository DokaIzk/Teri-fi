"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

const GetStartedPage = () => {


  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-4">
          Send money to any phone number in Africa instantly
        </h1>
        <Image
          src="/illustration.png" 
          alt="Send money illustration"
          width={250}
          height={250}
          className="mx-auto"
        />
      </div>

      <button
        onClick={() => router.push("/pages/phone-number")}
        className="mt-8 w-full max-w-xs py-3 bg-sky-500 rounded-lg text-white text-lg font-medium cursor-pointer"
      >
        Get Started
      </button>
    </div>
  )
}

export default GetStartedPage
