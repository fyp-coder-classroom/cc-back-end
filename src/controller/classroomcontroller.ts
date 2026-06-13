import { Request, Response } from "express";
import Classroom from "../models/Classroom";
import User from "../models/User";
import crypto from "crypto";

// Generate a unique class code (like "AB12CD")
const generateClassCode = (): string => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// CREATE CLASSROOM (Only Teachers)
export const createClassroom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract data from request body
    const { name, description } = req.body;
    const teacherId = req.userId;

    // Validation: Check if name is provided
    if (!name) {
      res.status(400).json({ message: "Classroom name is required" });
      return;
    }

    // Generate unique class code
    const classCode = generateClassCode();

    // Create new classroom document
    const classroom = new Classroom({
      name,
      description: description || "",
      teacherId,
      classCode,
      students: [],
    });

    // Save to database
    await classroom.save();

    // Send success response
    res.status(201).json({
      message: "Classroom created successfully",
      data: {
        classroomId: classroom._id,
        name: classroom.name,
        description: classroom.description,
        classCode: classroom.classCode,
        teacherId: classroom.teacherId,
      },
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    res.status(500).json({ message: "Error creating classroom" });
  }
};

// GET ALL CLASSROOMS OF A TEACHER
export const getTeacherClassrooms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacherId = req.userId;

    // Find all classrooms created by this teacher
    const classrooms = await Classroom.find({ teacherId })
      .populate("students", "name email")
      .exec();

    res.status(200).json({
      message: "Classrooms retrieved successfully",
      data: classrooms,
    });
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    res.status(500).json({ message: "Error fetching classrooms" });
  }
};

// GET CLASSROOM DETAILS
export const getClassroomDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classroomId } = req.params;

    // Find classroom by ID
    const classroom = await Classroom.findById(classroomId)
      .populate("teacherId", "name email")
      .populate("students", "name email")
      .exec();

    if (!classroom) {
      res.status(404).json({ message: "Classroom not found" });
      return;
    }

    res.status(200).json({
      message: "Classroom details retrieved",
      data: classroom,
    });
  } catch (error) {
    console.error("Error fetching classroom details:", error);
    res.status(500).json({ message: "Error fetching classroom details" });
  }
};

// JOIN CLASSROOM (Only Students)
export const joinClassroom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classCode } = req.body;
    const studentId = req.userId;

    // Validation: Check if classCode is provided
    if (!classCode) {
      res.status(400).json({ message: "Class code is required" });
      return;
    }

    // Find classroom by class code
    const classroom = await Classroom.findOne({ classCode });

    if (!classroom) {
      res.status(404).json({ message: "Invalid class code" });
      return;
    }

    // Check if student already joined
    if (classroom.students.includes(studentId as any)) {
      res.status(400).json({ message: "You have already joined this class" });
      return;
    }

    // Add student to classroom
    classroom.students.push(studentId as any);
    await classroom.save();

    res.status(200).json({
      message: "Successfully joined classroom",
      data: {
        classroomId: classroom._id,
        name: classroom.name,
        classCode: classroom.classCode,
      },
    });
  } catch (error) {
    console.error("Error joining classroom:", error);
    res.status(500).json({ message: "Error joining classroom" });
  }
};

// GET ALL CLASSROOMS A STUDENT JOINED
export const getStudentClassrooms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.userId;

    // Find all classrooms where this student is in the students array
    const classrooms = await Classroom.find({
      students: studentId,
    })
      .populate("teacherId", "name email")
      .exec();

    res.status(200).json({
      message: "Student classrooms retrieved",
      data: classrooms,
    });
  } catch (error) {
    console.error("Error fetching student classrooms:", error);
    res.status(500).json({ message: "Error fetching student classrooms" });
  }
};

// REMOVE STUDENT FROM CLASSROOM (Teacher only)
export const removeStudentFromClassroom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { classroomId, studentId } = req.params;
    const teacherId = req.userId;

    // Find classroom and verify teacher owns it
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      res.status(404).json({ message: "Classroom not found" });
      return;
    }

    if (classroom.teacherId.toString() !== teacherId) {
      res.status(403).json({ message: "Only the teacher can remove students" });
      return;
    }

    // Remove student from array
    classroom.students = classroom.students.filter(
      (id) => id.toString() !== studentId
    );

    await classroom.save();

    res.status(200).json({
      message: "Student removed successfully",
    });
  } catch (error) {
    console.error("Error removing student:", error);
    res.status(500).json({ message: "Error removing student" });
  }
};