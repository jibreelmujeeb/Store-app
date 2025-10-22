import { Save, Settings, Building, CreditCard, Percent } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </header>

      {/* Settings Form */}
      <section className="p-6 space-y-8">
        {/* Business Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Business Name</label>
              <input
                type="text"
                placeholder="Enter your business name"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Business Email</label>
              <input
                type="email"
                placeholder="example@business.com"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input
                type="text"
                placeholder="+234 812 345 6789"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Business Address</label>
              <input
                type="text"
                placeholder="123 Example Street, Lagos"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tax and Currency */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-green-600" />
            Tax & Currency Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Tax Rate (%)</label>
              <input
                type="number"
                placeholder="7.5"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Currency</label>
              <select className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                <option value="NGN">₦ — Nigerian Naira</option>
                <option value="USD">$ — US Dollar</option>
                <option value="GBP">£ — British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-medium mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Payment Options
          </h2>
          <div className="space-y-3">
            {["Cash", "POS Terminal", "Bank Transfer", "Online Payment"].map((method, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-600" />
                {method}
              </label>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
