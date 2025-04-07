import Department from "../models/Department.js";
import Employee from "../models/Employee.js";

export const createDepartment = async (req, res) => {
  const department = new Department(req.body);
  await department.save();
  res.status(201).json(department);
};

export const getDepartments = async (req, res) => {
  const departments = await Department.find();
  res.json(departments);
};

export const getEmployeeCountByDepartment = async (req, res) => {
  const counts = await Employee.aggregate([
    { $group: { _id: "$departmentId", count: { $sum: 1 } } },
  ]);
  res.json(counts);
};
