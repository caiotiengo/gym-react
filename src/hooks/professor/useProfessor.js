import {useContext} from "react";
import {ProfessorContext} from "./ProfessorProvider";

export default function useProfessor()  {
  const { professor, setProfessor, resetValues } = useContext(ProfessorContext)
  
  return {
    professor,
    setProfessor,
    resetValues
  }
}