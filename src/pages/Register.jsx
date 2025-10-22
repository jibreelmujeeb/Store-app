import React from "react";
import { UserPlus, Mail, Lock, Store } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
      <div className="w-full max-w-sm border border-gray-200 bg-white p-8 rounded-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5 text-green-600" /> Create Account
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-600">Business Name</label>
            <div className="flex items-center border border-gray-300 rounded-xl px-3">
              <Store className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="e.g. Cafe Klang"
                className="w-full px-2 py-2 outline-none bg-transparent"
              />
            </div>
          </div>

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
                placeholder="Create password"
                className="w-full px-2 py-2 outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-green-600">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
