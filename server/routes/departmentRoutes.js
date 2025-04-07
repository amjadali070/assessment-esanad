import express from "express";
import {
  createDepartment,
  getDepartments,
  getEmployeeCountByDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.post("/", createDepartment);
router.get("/", getDepartments);
router.get("/employee-count", getEmployeeCountByDepartment);

export default router;
