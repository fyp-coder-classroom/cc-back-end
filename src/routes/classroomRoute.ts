import { Router } from "express";
import {
  createClassroom,
  getTeacherClassrooms,
  getClassroomDetails,
  joinClassroom,
  getStudentClassrooms,
  removeStudentFromClassroom,
} from "../controller/classroomcontroller";
import { authMiddleware, teacherMiddleware, studentMiddleware } from "../middleware/authMiddleware";
const router = Router();
//  TEACHER ROUTES
// POST /api/classrooms/create
// Teacher creates a new classroom
router.post(
  "/create",
  authMiddleware,      // Check if logged in
  teacherMiddleware,   // Check if teacher
  createClassroom      // Run controller
);
// GET /api/classrooms/teacher
// Teacher gets all their classrooms
router.get(
  "/teacher",
  authMiddleware,      // Check if logged in
  teacherMiddleware,   // Check if teacher
  getTeacherClassrooms // Run controller
);
// GET /api/classrooms/:classroomId
// Get details of a specific classroom
router.get(
  "/:classroomId",
  authMiddleware,      // Check if logged in
  getClassroomDetails  // Run controller
);
// DELETE /api/classrooms/:classroomId/:studentId
// Teacher removes a student from classroom
router.delete(
  "/:classroomId/:studentId",
  authMiddleware,              // Check if logged in
  teacherMiddleware,           // Check if teacher
  removeStudentFromClassroom   // Run controller
);
// STUDENT ROUTES
// POST /api/classrooms/join
// Student joins a classroom using class code
router.post(
  "/join",
  authMiddleware,     // Check if logged in
  studentMiddleware,  // Check if student
  joinClassroom       // Run controller
);
// GET /api/classrooms/student
// Student gets all classrooms they joined
router.get(
  "/student",
  authMiddleware,      // Check if logged in
  studentMiddleware,   // Check if student
  getStudentClassrooms // Run controller
);

export default router;