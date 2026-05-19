import { useState } from "react";

function AddNewSubject() {

    const [subjectName, setSubjectName] = useState("");
     const [subjects, setSubjects] = useState([]);

    function handleAddSubject() {
        if (subjectName.trim() === "") {
            alert("נא להזין שם מקצוע");
            return;
        }

        console.log("המקצוע נוסף:", subjectName);
        setSubjects([...subjects, subjectName]);
        setSubjectName("");
    }
    return (
        <div>
            <h2>הוספת מקצוע</h2>
            <input
                type="text"
                placeholder="שם המקצוע"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
            />
            <button onClick={handleAddSubject}>הוסף מקצוע</button>

            <h3>רשימת מקצועות:</h3>
            <ul>
                {subjects.map((subject, index) => (
                    <li key={index}>{subject}</li>
                ))}
            </ul>
        </div>
    );
}

export default AddNewSubject;