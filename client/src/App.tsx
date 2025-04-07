import { useState } from "react";
import "./App.css";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeList from "./components/EmployeeList";
import DepartmentForm from "./components/DepartmentForm";
import DepartmentStats from "./components/DepartmentStats";

function App() {
  const [activeComponent, setActiveComponent] = useState("employeeForm");

  const renderComponent = () => {
    switch (activeComponent) {
      case "employeeForm":
        return <EmployeeForm />;
      case "employeeList":
        return <EmployeeList />;
      case "departmentForm":
        return <DepartmentForm />;
      case "departmentStats":
        return <DepartmentStats />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white p-6 md:p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
          eSanad Employee Management System
        </h1>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeComponent === "employeeForm"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveComponent("employeeForm")}
          >
            Add Employee
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeComponent === "employeeList"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveComponent("employeeList")}
          >
            Employee List
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeComponent === "departmentForm"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveComponent("departmentForm")}
          >
            Add Department
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              activeComponent === "departmentStats"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveComponent("departmentStats")}
          >
            Department Stats
          </button>
        </div>

        <div className="mt-6">{renderComponent()}</div>
      </div>
    </div>
  );
}

export default App;
