import {useContext} from "react";
import {ProfessorsContext} from "./ProfessorsProvider";
import {addProfessor, updateProfessor, deleteProfessor, suggestProfessor} from "../../services/professors";
import { createGateUser,addToGroup, addBiometry } from '../../services/gate'

export default function useProfessors()  {
  const { professors, fetchProfessors, searchProfessors, professorsCount } = useContext(ProfessorsContext)
  const addNewProfessor = async (user) => {
    await addProfessor(user)
    await fetchProfessors()
  }
  const editProfessor = async (user) => {
    await updateProfessor(user)
    await fetchProfessors()
  }
  const catracaFunction = async (nome) =>{
    const { ids } = await createGateUser(nome)
    await addToGroup(ids[0]);
    await addBiometry(ids[0]);
    alert('Leve o usuário até a catraca para registrar a sua biometria.');

 }
  const removeProfessor = async (id) => {
    await deleteProfessor(id)
    await fetchProfessors()
  }
  
  const suggestion = async (name) => suggestProfessor(name)
  
  const nextPage = async (page) => {
    await fetchProfessors(page)
  }
  
  return {
    professors,
    professorsCount,
    nextPage,
    addProfessor: addNewProfessor,
    editProfessor,
    removeProfessor,
    suggestion,
    catracaFunction,
    searchProfessors
  }
}