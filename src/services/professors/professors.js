import {
  collection,
  query,
  startAt,
  endAt,
  orderBy,
  getDocs,
  addDoc,
  startAfter,
  doc,
  updateDoc,
  deleteDoc,
  limit
} from 'firebase/firestore'
import {db} from '../../utils/firebase'

const professorsCollection = collection(db, "professores")

const pageLimit = 10

export const findProfessors = async (name) => {
  const professors = []
  const querySnapshot = await getDocs(queryProfessorsSuggestion(name));
  querySnapshot.forEach((doc) => {
    professors.push({id: doc.id, ...doc.data()});
  });
  
  return professors
}

const queryProfessorsSuggestion = (name) => query(professorsCollection,
  orderBy('nomeCompleto'),
  startAt(name),
  endAt(`${name}\uf8ff`)
);

export const getProfessorsPageCount = async () => {
  const querySnapshot = await getDocs(professorsCollection);
  return Math.ceil(querySnapshot.size / pageLimit)
}

export const getProfessorsPerPage = async (page) => {
  const professors = []
  const firstLimit = page === 1 ? page : (page - 1)
  const first = query(professorsCollection, orderBy('nomeCompleto'), limit(pageLimit * firstLimit))
  const querySnapshot = await getDocs(first);
  const lastProfessor = querySnapshot.docs[querySnapshot.docs.length - 1]
  
  const next = query(professorsCollection, orderBy('nomeCompleto'), startAfter(lastProfessor), limit(pageLimit))
  
  if (page === 1) {
    querySnapshot.forEach((doc) => {
      professors.push({id: doc.id, ...doc.data()});
    });
  } else {
    const nextProfessors = await getDocs(next)
    
    nextProfessors.forEach((doc) => {
      professors.push({id: doc.id, ...doc.data()});
    });
  }
  
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