import React, { useState } from "react";
import { User, Mail, Lock, Camera, Save, ShieldCheck } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Aisha Bello",
    email: "aisha@cafeklang.com",
    role: "Cashier",
    lastLogin: "2025-10-21 09:30 AM",
    profilePic: "https://ui-avatars.com/api/?name=Aisha+Bello&background=6366f1&color=fff",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setUser({
          ...user,
          profilePic: URL.createObjectURL(file),
        });
        setUploading(false);
      }, 1000);
    }
  };

  const handleSaveProfile = () => {
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-indigo-600" /> My Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
        {/* Left: Profile Picture */}
        <div className="flex flex-col items-center md:w-1/3 border-r border-gray-100">
          <div className="relative">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700">
              <Camera className="w-4 h-4 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </label>
          </div>

          <p className="mt-3 font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
          <p className="text-xs text-gray-400 mt-1">
            Last Login: {user.lastLogin}
          </p>

          {uploading && (
            <p className="text-xs text-indigo-600 mt-2 animate-pulse">
              Uploading...
            </p>
          )}
        </div>

        {/* Right: Profile Details */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-indigo-600" /> Personal Info
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email Address</label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleProfileChange}
                  className="w-full outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <input
                type="text"
                value={user.role}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Last Login</label>
              <input
                type="text"
                value={user.lastLogin}
                readOnly
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="mt-5 bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>

          <div className="border-t border-gray-200 mt-8 pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-gray-700" /> Change Password
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="New Password"
                className="border border-gray-300 rounded-xl px-3 py-2 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-gray-300 rounded-xl px-3 py-2 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition"
            >
              <Lock className="w-4 h-4" /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
