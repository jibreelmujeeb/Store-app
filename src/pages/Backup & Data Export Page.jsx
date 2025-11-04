import React, { useState } from "react";
import { Database, Download, Upload, RefreshCw, CheckCircle2 } from "lucide-react";

const BackupExportPage = () => {
  const [status, setStatus] = useState("");
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleBackup = () => {
    setIsBackingUp(true);
    setStatus("Backing up data...");
    setTimeout(() => {
      setIsBackingUp(false);
      setStatus("Backup completed successfully!");
    }, 2000);
  };

  const handleExport = (type) => {
    setIsExporting(true);
    setStatus(`Exporting ${type.toUpperCase()} data...`);
    setTimeout(() => {
      setIsExporting(false);
      setStatus(`${type.toUpperCase()} data exported successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Database className="w-6 h-6 text-blue-600" /> Backup & Data Export
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Data Backup */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" /> Backup Database
          </h2>
          <p className="text-gray-500 text-sm">
            Safely back up all your system data including sales, customers, inventory, and suppliers.
          </p>
          <button
            onClick={handleBackup}
            disabled={isBackingUp}
            className={`${
              isBackingUp ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-xl px-5 py-2 flex items-center justify-center gap-2 transition`}
          >
            {isBackingUp ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Backing Up...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" /> Start Backup
              </>
            )}
          </button>
        </div>

        {/* Data Export */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" /> Export Data
          </h2>
          <p className="text-gray-500 text-sm">
            Export POS data into downloadable formats for reports or migration.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport("csv")}
              className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <Download className="w-4 h-4 text-green-600" /> CSV
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <Download className="w-4 h-4 text-green-600" /> Excel
            </button>
            <button
              onClick={() => handleExport("json")}
              className="border border-gray-300 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-100 transition"
            >
              <Download className="w-4 h-4 text-green-600" /> JSON
            </button>
          </div>
        </div>
      </div>

      {/* Status message */}
      {status && (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-gray-700 text-sm">{status}</span>
        </div>
      )}

      {/* Restore section (optional) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Upload className="w-5 h-5 text-purple-600" /> Restore Backup (Optional)
        </h2>
        <p className="text-gray-500 text-sm mb-3">
          You can upload a backup file (.zip or .json) to restore data.
        </p>
        <input
          type="file"
          accept=".zip,.json"
          className="border border-gray-300 rounded-xl p-2 w-full"
        />
        <button className="mt-3 bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition">
          Restore Backup
        </button>
      </div>
    </div>
  );
};

export default BackupExportPage;
