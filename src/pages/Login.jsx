import React from "react";
import { Lock, Mail } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" /> POS Login
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600">Email</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3">
              <Mail className="text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-2 py-2 outline-none bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600">Password</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3">
              <Lock className="text-gray-400 w-4 h-4" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-2 py-2 outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="text-right">
            <a href="/forgot-password" className="text-sm text-blue-600">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-medium hover:bg-blue-700"
          >
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-600">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
