import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore'
import { db } from '../../utils/firebase'

const agendaCollection = collection(db, "agenda")

const queryAgendaByDate = (({startDate, endDate}) => query(agendaCollection,
    where('horarioInicio', ">=", new Date(startDate)),
    where('horarioInicio', "<", new Date(endDate)))
);

export const getAgenda = async (date) => {
  const agenda = []
  const querySnapshot = await getDocs(queryAgendaByDate(date));
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
  await addDoc(agendaCollection, {
    horarioInicio: appointment.startDate,
    horarioFinal: appointment.endDate,
    nomeAluno: appointment.aluno,
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
    idAluno: appointment.idAluno,
    concluido: false,
    nomeTreino: appointment.title
  })
}

export const deleteAppointment = async (id) => {
  const agendaRef = doc(db, 'agenda', id)

  await deleteDoc(agendaRef)
}
