import React, { useEffect, useState } from "react";
import { Department, Employee } from "../types/types";
import api from "../utils/api";

const initialForm: Employee = {
  name: "",
  email: "",
  position: "",
  departmentId: "",
  joinDate: "",
};

const EmployeeForm: React.FC = () => {
  const [form, setForm] = useState<Employee>(initialForm);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.position ||
      !form.departmentId ||
      !form.joinDate
    ) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/employees", form);
      setForm(initialForm);
    } catch (err) {
      console.error("Error submitting form", err);
      setError("Submission failed. Try again.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await api.get<Department[]>("/departments");
      setDepartments(res.data);
    };
    fetchDepartments();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-gray-100 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add New Employee</h2>
      {error && <p className="text-red-500">{error}</p>}

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      />
      <input
        name="position"
        value={form.position}
        onChange={handleChange}
        placeholder="Position"
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      />
      <select
        name="departmentId"
        value={form.departmentId}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      >
        <option value="">Select Department</option>
        {departments.map((dep) => (
          <option key={dep._id} value={dep._id}>
            {dep.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        name="joinDate"
        value={form.joinDate}
        onChange={handleChange}
        className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 text-white py-2 rounded-md transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Adding..." : "Add Employee"}
      </button>
    </form>
  );
};

export default EmployeeForm;
