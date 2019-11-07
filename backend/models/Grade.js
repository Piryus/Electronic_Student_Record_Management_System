const mongoose = requrie('mongoose');
const {Schema} = mongoose;

const gradeSchema = new Schema({
    studentId: Number,
    grade: Number,
    topic: String
});

mongoose.model('grades', gradeSchema);