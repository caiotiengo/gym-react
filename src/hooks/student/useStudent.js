import {useContext} from "react";
import {StudentsContext} from "./StudentProvider";

export default function useStudent()  {
  const { student, setStudent, resetValues } = useContext(StudentsContext)
  
  return {
    student,
    setStudent,
    resetValues
  }
}