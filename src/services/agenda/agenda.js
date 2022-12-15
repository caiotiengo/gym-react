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
      title: doc.data().nomeAluno,
      professor: doc.data().nomeProfessor
    });
  });
  return agenda
}

export const addAppointment = async (appointment) => {
  await addDoc(agendaCollection, {
    horarioInicio: appointment.startDate,
    horarioFinal: appointment.endDate,
    nomeAluno: appointment.title,
    nomeProfessor: appointment.professor
  })
}

export const updateAppointment = async (appointment) => {
  const agendaRef = doc(db, 'agenda', appointment.id)

  await updateDoc(agendaRef, {
    horarioInicio: appointment.startDate,
    horarioFinal: appointment.endDate,
    nomeAluno: appointment.title,
    nomeProfessor: appointment.professor
  })
}

export const deleteAppointment = async (id) => {
  const agendaRef = doc(db, 'agenda', id)

  await deleteDoc(agendaRef)
}
