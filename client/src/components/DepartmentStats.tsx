import React, { useEffect, useState } from "react";
import { Department } from "../types/types";
import api from "../utils/api";

interface Count {
  _id: string;
  count: number;
}

const DepartmentStats: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [counts, setCounts] = useState<Count[]>([]);

  useEffect(() => {
    api
      .get<Department[]>("/departments")
      .then((res) => setDepartments(res.data));
    api
      .get<Count[]>("/departments/employee-count")
      .then((res) => setCounts(res.data));
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Department Stats
      </h2>
      <ul className="space-y-3">
        {counts.map((count) => {
          const department = departments.find((dep) => dep._id === count._id);
          return (
            <li
              key={count._id}
              className="border border-gray-300 p-3 rounded-md text-gray-700"
            >
              <span className="font-semibold text-gray-800">
                {department?.name || "Unknown"}
              </span>
              : {count.count} employee(s)
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DepartmentStats;
