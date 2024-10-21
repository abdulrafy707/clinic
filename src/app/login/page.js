'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);

    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`/api/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                // Store JWT token in localStorage (or cookies, depending on your preference)
                localStorage.setItem('authToken', token);

                setMessage('Login successful');
                setUser(user);

                // Redirect to the home page or dashboard after successful login
                router.push('/home');
            }
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Log in to Your Account</h2>
                {message && <p className="text-center text-red-500">{message}</p>}
                <form className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleLogin}
                            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                {user && (
                    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">Welcome, {user.username}!</h3> {/* Display logged-in user */}
                    </div>
                )}
            </div>
        </div>
    );
}
