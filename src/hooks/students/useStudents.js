import {useContext} from "react";
import {StudentsContext} from "./StudentsProvider";
import {addStudent, deleteStudent, suggestStudent, updateStudent} from "../../services/students";

export default function useStudents()  {
  const { students, fetchStudents, totalNewStudents } = useContext(StudentsContext)
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
  
  const suggestion = async (name) => suggestStudent(name)
  
  return {
    students,
    totalNewStudents,
    addStudent: addNewStudent,
    editStudent,
    removeStudent,
    suggestion
  }
}