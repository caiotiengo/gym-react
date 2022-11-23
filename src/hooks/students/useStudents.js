import {useContext} from "react";
import {StudentsContext} from "./StudentsProvider";
import {addStudent, deleteStudent, updateStudent} from "../../services/students";

export default function useStudents()  {
  const { students, fetchStudents } = useContext(StudentsContext)
  const addNewStudent = async (user) => {
    await addStudent(user)
    await fetchStudents()
  }
  const editStudent = async (user) => {
    await updateStudent(user)
    await fetchStudents()
  }
  
  const removeStudent = async (id) => {
    await deleteStudent(id)
    await fetchStudents()
  }
  
  return {
    students,
    addStudent: addNewStudent,
    editStudent,
    removeStudent
  }
}