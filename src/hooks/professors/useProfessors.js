import {useContext} from "react";
import {ProfessorsContext} from "./ProfessorsProvider";
import {addProfessor, updateProfessor, deleteProfessor, suggestProfessor} from "../../services/professors";

export default function useProfessors()  {
  const { professors, fetchProfessors } = useContext(ProfessorsContext)
  const addNewProfessor = async (user) => {
    await addProfessor(user)
    await fetchProfessors()
  }
  const editProfessor = async (user) => {
    await updateProfessor(user)
    await fetchProfessors()
  }
  
  const removeProfessor = async (id) => {
    await deleteProfessor(id)
    await fetchProfessors()
  }
  
  const suggestion = async (name) => suggestProfessor(name)
  
  return {
    professors,
    addProfessor: addNewProfessor,
    editProfessor,
    removeProfessor,
    suggestion
  }
}