import Employee from "../models/Employee.js";

export const createEmployee = async (req, res) => {
  const employee = new Employee(req.body);
  await employee.save();
  res.status(201).json(employee);
};

export const getEmployees = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  try {
    const totalItems = await Employee.countDocuments();
    const totalPages = Math.ceil(totalItems / limitNum);

    const employees = await Employee.find()
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("departmentId");

    res.json({
      employees,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchEmployees = async (req, res) => {
  const { name, department, page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  try {
    const filter = {};
    if (name) filter.name = new RegExp(name, "i");
    if (department) filter.departmentId = department;

    const totalItems = await Employee.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    const employees = await Employee.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("departmentId");

    res.json({
      employees,
      totalItems,
      totalPages,
      currentPage: pageNum,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
