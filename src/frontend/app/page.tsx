'use client'

import { useRouter } from 'next/navigation'
import Image from "next/image";
import React, { useState } from "react";

export default function LoginPage() {

  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter()

  const validateEmail = (email: string) => {
    return email.endsWith('@mcmaster.ca')
  }

  const handleSubmit = (event: React.FormEvent) => {

    event.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid McMaster email address")
      return;
    }

    setError("")

    router.push('/userInfoGeneral')

  }

  return (
    <>
      <div id="loginScreenContainer" className="flex flex-row min-h-screen min-w-screen bg-background">
        <div id="loginScreenLeftContainer" className="bg-stone-800 min-h-screen w-2/5"></div>
        <div id="loginScreenFormContainer" className="flex flex-col items-center justify-center h-screen w-3/5 bg-transparent space-y-5">

          <Image src="/mesLogo.png" alt="MES Logo" width={150} height={150}></Image>

          <p className="text-primary-text font-bold text-lg">Welcome to the McMaster Engineering Society Reimbursement Platform</p>

          <p className="text-secondary-text font-semibold text-sm">Enter your McMaster email to continue</p>

          <input type='email' className="bg-foreground px-3 py-2 rounded-md w-1/3 border-white drop-shadow-md" placeholder="johnsmith@mcmaster.ca" value={email} onChange={(e) => setEmail(e.target.value)} onClick={() => setError('')}></input>

          {error && (
            <p className='text-red-500 text-sm'>{error}</p>
          )}

          <div className="w-1/3">
            <button onClick={handleSubmit} className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg">Login</button>
          </div>

        </div>
      </div>
    </>
  );
}