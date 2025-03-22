import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
        password_confirmation: "",
        role: "waiter", // Add default role value
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    const handleLogin = () => {
        window.location.href = route("login");
    };

    return (
        <div className="flex h-screen">
            {/* Left Side (Visual) */}
            <div 
                className="w-1/2 flex items-center justify-center text-white text-4xl font-bold"
                style={{ backgroundColor: "#1a1a2e" }}
            >
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h1>Join Our Restaurant</h1>
                    <p className="text-lg font-normal mt-4">Create an account to reserve tables and enjoy special offers</p>
                </div>
            </div>

            {/* Right Side (Register Form) */}
            <div className="w-1/2 flex items-center justify-center bg-black text-white">
                <div className="w-full max-w-md p-6">
                    <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

                    <form onSubmit={submit}>
                        {/* Username Field */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData("username", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                autoComplete="username"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                autoComplete="new-password"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-4">
                            <label className="block text-gray-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                                autoComplete="new-password"
                            />
                            {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>}
                        </div>

                        {/* Role Field */}
                        <div className="mb-6">
                            <label className="block text-gray-400 mb-1">Role</label>
                            <select 
                                name="role"
                                value={data.role} 
                                onChange={(e) => setData("role", e.target.value)}
                                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                            >
                                <option value="waiter">Waiter</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-600 font-bold transition-colors"
                                disabled={processing}
                            >
                                {processing ? "Creating Account..." : "Sign Up"}
                            </button>
                            <button 
                                type="button"
                                className="flex-1 border border-gray-500 text-gray-300 p-2 rounded-lg hover:bg-gray-700 font-bold transition-colors"
                                onClick={handleLogin}
                            >
                                Log In
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-gray-400 mt-6 text-sm">
                        © 2025 Your Restaurant. Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}