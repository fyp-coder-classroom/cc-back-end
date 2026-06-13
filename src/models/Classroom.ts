import mongoose , {Document, Schema} from "mongoose";

export interface IClassroom extends Document {
    name: string;
    description: string;
    teacherId: mongoose.Types.ObjectId;
    classCode: string;
    students: mongoose.Types.ObjectId[];
    createdAt: Date;
}
 
const ClassroomSchema : Schema=new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
        default: "", //decription is optional,default is empty
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //Links with user model(teacher)
        required: true,
    },
    classCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // each student ID links to User model
              },
            ],
},
{
    timestamps: true,
});

//Model
const Classroom = mongoose.model<IClassroom>("Classroom", ClassroomSchema);
export default Classroom;