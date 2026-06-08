import { Router } from "express";
import * as ClassroomController from "@/controllers/classroom.controller";
import validate from "@/middlewares/validate";
import auth from "@/middlewares/auth";
import classroomValidation from "@/validations/classroom.validation";

const router = Router();

router.post(
  "/",
  auth,
  validate(classroomValidation.createClassroom),
  ClassroomController.createClassroom,
);

router.get("/teacher/my-classrooms", auth, ClassroomController.getTeacherClassrooms);

router.patch(
  "/:classroomId",
  auth,
  validate(classroomValidation.updateClassroom),
  ClassroomController.updateClassroom,
);

router.delete(
  "/:classroomId",
  auth,
  validate(classroomValidation.getClassroomById),
  ClassroomController.deleteClassroom,
);

router.delete(
  "/:classroomId/students/:studentId",
  auth,
  validate(classroomValidation.removeStudentFromClassroom),
  ClassroomController.removeStudentFromClassroom,
);

router.post(
  "/join",
  auth,
  validate(classroomValidation.joinClassroom),
  ClassroomController.joinClassroom,
);

router.get(
  "/student/my-classrooms",
  auth,
  ClassroomController.getStudentClassrooms,
);

router.get(
  "/:classroomId",
  auth,
  validate(classroomValidation.getClassroomById),
  ClassroomController.getClassroomById,
);

export default router;