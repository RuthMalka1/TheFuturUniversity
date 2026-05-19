import { useState, useEffect } from "react";
import { addCourse } from "../services/coursesApi";
import { getAllSubjects } from "../services/subjectApi";


import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Typography,
  Box
} from "@mui/material";


function AddNewCourse() {
  const [subjects, setSubjects] = useState([]);
  const [course, setCourse] = useState({
    subjectId: "",
    name: "",
    numberMeetings: "",
    content: "",
    coursImage: null
  });

  useEffect(() => {
    //הכנת פונקציה שמבצעת קריאת שרת
    const getSubjects = async () => {
      const data = await getAllSubjects();
      if (Array.isArray(data)) {
        setSubjects(data);
      }
    };
    //זימון הפונקציה
    getSubjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subjectId", course.subjectId);
    formData.append("name", course.name);
    formData.append("numberMeetings", course.numberMeetings);
    formData.append("content", course.content);
    if (course.coursImage) formData.append("coursImage", course.coursImage);

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // axios.post("http://localhost:5000/courses", formData, {
    //   headers: { "Content-Type": "multipart/form-data" }
    // })
    //   .then(() => {
    //     alert("הקורס נוסף בהצלחה");
    //     setCourse({
    //       subjectId: "",
    //       name: "",
    //       numberMeetings: "",
    //       content: "",
    //       coursImage: null
    //     });
    //   })
    //   .catch(err => console.log(err));

    addCourse(formData);

  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        הוספת קורס חדש
      </Typography>

      <form onSubmit={handleSubmit}>

        {/* בחירת מקצוע */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>בחר מקצוע</InputLabel>
          <Select
            value={course.subjectId}
            label="בחר מקצוע"
            onChange={(e) => setCourse({ ...course, subjectId: e.target.value })}
            required
          >
            {subjects.map(subject => (
              <MenuItem key={subject._id} value={subject._id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* שם הקורס */}
        <TextField
          fullWidth
          label="שם הקורס"
          value={course.name}
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
          required
          sx={{ mb: 2 }}
        />

        {/* מספר מפגשים */}
        <TextField
          fullWidth
          type="number"
          label="מספר מפגשים"
          value={course.numberMeetings}
          onChange={(e) => setCourse({ ...course, numberMeetings: e.target.value })}
          required
          sx={{ mb: 2 }}
        />

        {/* תוכן הקורס */}
        <TextField
          fullWidth
          label="תוכן הקורס"
          multiline
          rows={4}
          value={course.content}
          onChange={(e) => setCourse({ ...course, content: e.target.value })}
          required
          sx={{ mb: 2 }}
        />

        {/* העלאת תמונה */}
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          העלאת תמונה
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setCourse({ ...course, coursImage: e.target.files[0] })}
          />
        </Button>

        {course.coursImage && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {course.coursImage.name}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary">
          הוסף קורס
        </Button>
      </form>
    </Box>
  );
}

export default AddNewCourse;