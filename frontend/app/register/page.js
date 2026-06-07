"use client";

import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      alert("Registration Successful!");
      window.location.href = "/login";
    } catch (error) {
      alert("Registration Failed");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                C
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black">
              Create Account
            </h1>

            <p className="text-gray-600 mt-3">
              Join the Real-Time Chat Platform
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full h-12 px-4 bg-gray-50 text-black border border-gray-300 rounded-xl outline-none transition-all focus:border-black focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full h-12 px-4 bg-gray-50 text-black border border-gray-300 rounded-xl outline-none transition-all focus:border-black focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full h-12 px-4 bg-gray-50 text-black border border-gray-300 rounded-xl outline-none transition-all focus:border-black focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?
              </p>

              <a
                href="/login"
                className="font-semibold text-black hover:text-gray-700 transition"
              >
                Sign In
              </a>
            </div>

          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Real-Time Chat Application
        </p>

      </div>
    </div>
  );
}