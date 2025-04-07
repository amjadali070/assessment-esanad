import express from "express";
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
} from "../controllers/employeeController.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getEmployees);
router.get("/search", searchEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
