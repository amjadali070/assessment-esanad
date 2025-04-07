import React, { useEffect, useState } from "react";
import { Department, Employee } from "../types/types";
import api from "../utils/api";

interface EmployeeWithPopulatedDepartment
  extends Omit<Employee, "departmentId"> {
  departmentId: Department | string;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeWithPopulatedDepartment[]>(
    []
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [limit, setLimit] = useState(10);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] =
    useState<EmployeeWithPopulatedDepartment | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    position: "",
    departmentId: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const fetchEmployees = async (
    name: string,
    deptId: string,
    page: number,
    itemsPerPage: number
  ) => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (deptId) queryParams.append("department", deptId);
    queryParams.append("page", page.toString());
    queryParams.append("limit", itemsPerPage.toString());

    try {
      const res = await api.get<{
        employees: EmployeeWithPopulatedDepartment[];
        totalItems: number;
        totalPages: number;
        currentPage: number;
      }>(`/employees/search?${queryParams.toString()}`);

      setEmployees(res.data.employees);
      setPagination({
        currentPage: res.data.currentPage,
        totalPages: res.data.totalPages,
        totalItems: res.data.totalItems,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get<Department[]>("/departments")
      .then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchEmployees(search, selectedDept, 1, limit);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, selectedDept, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchEmployees(search, selectedDept, newPage, limit);
  };

  // Update employee functions
  const openEditModal = (emp: EmployeeWithPopulatedDepartment) => {
    setCurrentEmployee(emp);
    setEditForm({
      name: emp.name,
      email: emp.email,
      position: emp.position,
      departmentId:
        typeof emp.departmentId === "object"
          ? emp.departmentId._id
          : (emp.departmentId as string),
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    try {
      await api.put(`/employees/${currentEmployee._id}`, editForm);
      setShowEditModal(false);

      fetchEmployees(search, selectedDept, pagination.currentPage, limit);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const openDeleteConfirm = (empId: string) => {
    setEmployeeToDelete(empId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await api.delete(`/employees/${employeeToDelete}`);
      setShowDeleteConfirm(false);

      const isLastItemOnPage =
        employees.length === 1 && pagination.currentPage > 1;
      if (isLastItemOnPage) {
        fetchEmployees(search, selectedDept, pagination.currentPage - 1, limit);
      } else {
        fetchEmployees(search, selectedDept, pagination.currentPage, limit);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const renderPaginationControls = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;

    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        &laquo;
      </button>
    );

    pages.push(
      <span key="info" className="px-3 py-1">
        Page {currentPage} of {totalPages}
      </span>
    );

    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
      >
        &raquo;
      </button>
    );

    return pages;
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Employee List
      </h2>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        />
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-gray-900"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="25">25 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-3 py-2 text-left text-gray-800">Name</th>
                  <th className="px-3 py-2 text-left text-gray-800">Email</th>
                  <th className="px-3 py-2 text-left text-gray-800">
                    Position
                  </th>
                  <th className="px-3 py-2 text-left text-gray-800">
                    Department
                  </th>
                  <th className="px-3 py-2 text-left text-gray-800">
                    Join Date
                  </th>
                  <th className="px-3 py-2 text-left text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td className="px-3 py-2 text-gray-700">{emp.name}</td>
                      <td className="px-3 py-2 text-gray-700">{emp.email}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {emp.position}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {typeof emp.departmentId === "object"
                          ? emp.departmentId.name
                          : departments.find((d) => d._id === emp.departmentId)
                              ?.name || "N/A"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {new Date(emp.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(emp)}
                            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(emp._id ?? "")}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-2 text-center text-gray-700"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {employees.length} of {pagination.totalItems} employees
            </div>
            <div className="flex space-x-1">{renderPaginationControls()}</div>
          </div>
        </>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Employee</h3>
            <form onSubmit={handleUpdateEmployee}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={editForm.position}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Department
                </label>
                <select
                  name="departmentId"
                  value={editForm.departmentId}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEmployee}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
