import React, { useState } from "react";
import { Receipt, Search, Calendar, Printer, Eye, Filter } from "lucide-react";

const ReceiptsHistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const receipts = [
    {
      id: "INV-001",
      date: "2025-10-21",
      customer: "John Doe",
      total: 5500,
      payment: "Cash",
      items: [
        { name: "Latte", qty: 2, price: 1500 },
        { name: "Donut", qty: 1, price: 2500 },
      ],
    },
    {
      id: "INV-002",
      date: "2025-10-22",
      customer: "Jane Smith",
      total: 8200,
      payment: "Card",
      items: [
        { name: "Iced Coffee", qty: 2, price: 3000 },
        { name: "Croissant", qty: 1, price: 2200 },
      ],
    },
  ];

  const filteredReceipts = receipts.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterDate || r.date === filterDate)
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Receipt className="w-6 h-6 text-indigo-600" /> Receipts & Sales History
      </h1>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by receipt ID or customer..."
            className="w-full outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            className="outline-none text-sm"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
        <button className="bg-indigo-600 text-white rounded-xl px-5 py-2 flex items-center gap-2 hover:bg-indigo-700 transition">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Receipts Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="text-left p-3">Receipt ID</th>
              <th className="text-left p-3">Customer</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Payment</th>
              <th className="text-right p-3">Total</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((r) => (
              <tr
                key={r.id}
                className="border-t border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.customer}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.payment}</td>
                <td className="p-3 text-right font-medium">
                  ₦{r.total.toLocaleString()}
                </td>
                <td className="p-3 text-right flex justify-end gap-3">
                  <button
                    onClick={() => setSelectedReceipt(r)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-700">
                    <Printer className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReceipts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center text-gray-500 p-6 text-sm"
                >
                  No receipts found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Detail Drawer */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-full sm:w-[400px] p-6 border-l border-gray-200 animate-slideIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" /> {selectedReceipt.id}
              </h2>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-1">
              <strong>Customer:</strong> {selectedReceipt.customer}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Date:</strong> {selectedReceipt.date}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Payment:</strong> {selectedReceipt.payment}
            </p>

            <div className="border-t border-gray-200 mt-2 mb-3"></div>
            <h3 className="text-sm font-semibold mb-2">Items:</h3>
            <ul className="text-sm text-gray-700">
              {selectedReceipt.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b border-gray-100 py-1"
                >
                  <span>{item.name} x{item.qty}</span>
                  <span>₦{item.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 mt-3 pt-2 text-right font-semibold">
              Total: ₦{selectedReceipt.total.toLocaleString()}
            </div>

            <button
              className="mt-4 w-full bg-green-600 text-white rounded-xl py-2 flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptsHistoryPage;
