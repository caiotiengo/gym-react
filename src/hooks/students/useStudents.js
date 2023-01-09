import {useContext} from "react";
import {StudentsContext} from "./StudentsProvider";
import {addStudent, deleteStudent,suggestStudent, addTreinamento, updateStudent} from "../../services/students";
import { createGateUser,addToGroup, addBiometry } from '../../services/gate'

export default function useStudents()  {
  const { students, fetchStudents, totalNewStudents } = useContext(StudentsContext)
  const addNewStudent = async (user) => {
    //const { ids } = await createGateUser(user.nome)
    await addStudent(user);
    await fetchStudents();
    //await addToGroup(ids[0]);
    //await addBiometry(ids[0]); 
    //alert('Leve o usuário até a catraca para registrar a sua biometria.');

  }
  const catracaFunction = async (nome) =>{
     const { ids } = await createGateUser(nome)
     await addToGroup(ids[0]);
     await addBiometry(ids[0]);
     alert('Leve o usuário até a catraca para registrar a sua biometria.');

  }
  const addTreino = async(user,treino, professor) =>{
    await addTreinamento(user,treino,professor);
    alert('Treino adicionado com sucesso!');
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
    suggestion,
    catracaFunction,
    addTreino
  }
}
