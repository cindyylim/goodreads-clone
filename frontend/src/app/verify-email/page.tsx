'use client';

import { api, setAuth } from "@/utils/auth";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const [error, setError] = useState('');

    const handleChange = (index: number, value: string) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex]?.focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
		}
	};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        setIsLoading(true);
        setError('');
    
		const verificationCode = code.join("");
		try {
            const response = await api.post('/users/verify-email', {verificationCode});
            // Store the token and user data using the auth utility
            setAuth(response.data.token, response.data.user);
            router.push('/books');
		} catch (error: any) {
            if (error.response) {
                // ✅ Server responded with a status outside 2xx range
                if (error.response.status === 400) {
                    setError(error.response.data.message || 'Invalid verification code. Please try again.');
                } else {
                    setError(error.response.data.message || 'Something went wrong. Please try again later.');
                }
            } else if (error.request) {
                // 🟡 Request was made but no response received
                setError('No response from server. Please check your internet connection.');
            } else {
                // 🔴 Something went wrong in setting up the request
                setError('An unexpected error occurred.');
            }
		} finally {
            setIsLoading(false);
        }
	};

    return (
    <div className="min-h-screen bg-green-800 flex items-center justify-center px-4">
    <div className='max-w-md w-full bg-gray-500 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
        <h2 className='text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">Enter the 6-digit code sent to your email address.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between">
            {code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => {inputRefs.current[index] = el;}}
								type='text'
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
							/>
			))}
            		{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
					<button
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</button>
            </div>
        </form>
    </div>
    </div>)
}