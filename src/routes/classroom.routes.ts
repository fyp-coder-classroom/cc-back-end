import { Router } from "express";
import * as ClassroomController from "@/controllers/classroom.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import classroomValidation from "@/validations/classroom.validation";
import { STUDENT, TEACHER } from "@/config/roles";

const router = Router();

router.post(
  "/",
  auth([TEACHER]),
  validate(classroomValidation.createClassroom),
  ClassroomController.createClassroom,
);

router.get(
  "/teacher/my-classrooms",
  auth([TEACHER]),
  ClassroomController.getTeacherClassrooms,
);

router.patch(
  "/:classroomId",
  auth([TEACHER]),
  validate(classroomValidation.updateClassroom),
  ClassroomController.updateClassroom,
);

router.delete(
  "/:classroomId",
  auth([TEACHER]),
  validate(classroomValidation.getClassroomById),
  ClassroomController.deleteClassroom,
);

router.delete(
  "/:classroomId/students/:studentId",
  auth([TEACHER]),
  validate(classroomValidation.removeStudentFromClassroom),
  ClassroomController.removeStudentFromClassroom,
);

router.post(
  "/join",
  auth([STUDENT]),
  validate(classroomValidation.joinClassroom),
  ClassroomController.joinClassroom,
);

router.get(
  "/student/my-classrooms",
  auth([STUDENT]),
  ClassroomController.getStudentClassrooms,
);

router.get(
  "/:classroomId",
  auth([STUDENT, TEACHER]),
  validate(classroomValidation.getClassroomById),
  ClassroomController.getClassroomById,
);

export default router;
