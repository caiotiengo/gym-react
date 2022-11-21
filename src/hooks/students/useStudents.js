import {useContext} from "react";
import {StudentsContext} from "./StudentsProvider";
import {addStudent} from "../../services/students";

export default function useStudents()  {
  const { students, fetchStudents } = useContext(StudentsContext)
  const addNewStudent = async (user) => {
    await addStudent(user)
    await fetchStudents()
  }
  
  return {
    students,
    addStudent: addNewStudent
  }
}