"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await signInWithEmailAndPassword(auth, email, password);
			// Redirect or show success
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = async () => {
		setLoading(true);
		setError("");
		try {
			const provider = new GoogleAuthProvider();
			await signInWithPopup(auth, provider);
			// Redirect or show success
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
				<h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
				<form onSubmit={handleEmailLogin} className="space-y-4">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						className="w-full px-4 py-2 border rounded"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						className="w-full px-4 py-2 border rounded"
						required
					/>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
						disabled={loading}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>
				<button
					onClick={handleGoogleLogin}
					className="w-full mt-4 bg-red-500 text-white py-2 rounded font-semibold"
					disabled={loading}
				>
					{loading ? "Signing in..." : "Sign in with Google"}
				</button>
				{error && <p className="mt-4 text-red-600 text-center">{error}</p>}
			</div>
		</div>
	);
}
