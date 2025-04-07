import React, { useState } from "react";
import api from "../utils/api";

const DepartmentForm: React.FC = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Department name is required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/departments", { name });
      setName("");
    } catch {
      setError("Error adding department.");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add Department</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 text-white py-2 rounded-md transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Department"}
      </button>
    </form>
  );
};

export default DepartmentForm;
