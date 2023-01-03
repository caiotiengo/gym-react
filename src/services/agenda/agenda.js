import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc  } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const agendaCollection = collection(db, "agenda")

export const getAgenda = async () => {
  const agenda = []
  const querySnapshot = await getDocs(agendaCollection);
  querySnapshot.forEach((doc) => {
    agenda.push({
      id: doc.id,
      startDate: doc.data().horarioInicio.toDate(),
      endDate: doc.data().horarioFinal.toDate(),
      aluno: doc.data().nomeAluno,
      title: doc.data().nomeTreino,
      professor: doc.data().nomeProfessor,
      idProfessor: doc.data().idProfessor,
      idAluno: doc.data().idAluno
    });
  });
  return agenda
}

export const addAppointment = async (appointment) => {
  console.log(appointment)
  await addDoc(agendaCollection, {
    horarioInicio: appointment.startDate,
    horarioFinal: appointment.endDate,
    nomeAluno: appointment.aluno,
    nomeProfessor: appointment.professor,
    idProfessor: appointment.idProfessor,
    idAluno: appointment.idAluno,
    concluido: false,
    nomeTreino: appointment.title
  })
}

export const updateAppointment = async (appointment) => {
  const agendaRef = doc(db, 'agenda', appointment.id)

  await updateDoc(agendaRef, {
    horarioInicio: appointment.startDate,
    horarioFinal: appointment.endDate,
    nomeAluno: appointment.aluno,
    nomeProfessor: appointment.professor,
    idProfessor: appointment.idProfessor,
    idAluno: appointment.idAluno,
    concluido: false,
    nomeTreino: appointment.title
  })
}

export const deleteAppointment = async (id) => {
  const agendaRef = doc(db, 'agenda', id)

  await deleteDoc(agendaRef)
}
