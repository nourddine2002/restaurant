import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="flex h-screen">
            {/* Left Side (Visual) */}
            <div 
                className="w-1/2 flex items-center justify-center text-white text-4xl font-bold"
                style={{ backgroundColor: "#1a1a2e" }} // Replace with your restaurant's main color
            >
                Welcome to Our Restaurant 🍽️
            </div>

            {/* Right Side (Login Form) */}
            <div className="w-1/2 flex items-center justify-center bg-black text-white">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-3xl font-bold text-center mb-6">Get Started</h2>

                    <form onSubmit={submit}>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-400">Username</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData("username", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label className="block text-gray-400">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-600 font-bold"
                                disabled={processing}
                            >
                                Log In
                            </button>
                            <button 
                                type="button"
                                className="flex-1 border border-gray-500 text-gray-300 p-2 rounded-lg hover:bg-gray-700 font-bold"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-400 mt-4 text-sm">
                        © 2025 Your Restaurant. Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
