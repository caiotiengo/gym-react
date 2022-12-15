import { collection, query, startAt, endAt, orderBy, getDocs, addDoc, doc, updateDoc, deleteDoc  } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const professorsCollection = collection(db, "professores")

// const queryStudents = query(professorsCollection, where("admin", "==", false));

const queryProfessorsSuggestion = (name) => query(professorsCollection,
  orderBy('nomeCompleto'),
  startAt(name),
  endAt(`${name}\uf8ff`)
);

export const getProfessors = async () => {
  const professors = []
  const querySnapshot = await getDocs(professorsCollection);
  querySnapshot.forEach((doc) => {
    professors.push({id: doc.id, ...doc.data()});
  });
  return professors
}

export const addProfessor = async (professor) => {
  await addDoc(professorsCollection, {
    ...professor
  })
}

export const updateProfessor = async (professor) => {
  const professorRef = doc(db, 'professores', professor.id)

  await updateDoc(professorRef, professor)
}

export const deleteProfessor = async (id) => {
  const professorRef = doc(db, 'professores', id)

  await deleteDoc(professorRef)
}

export const suggestProfessor = async (name) => {
  const professors = []
  const querySnapshot = await getDocs(queryProfessorsSuggestion(name));
  querySnapshot.forEach((doc) => {
    professors.push({id: doc.id, label: doc.data().nomeCompleto});
  });
  
  return professors
}