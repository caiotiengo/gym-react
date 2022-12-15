import { collection, query, where, startAt, endAt, orderBy, getDocs, addDoc, doc, updateDoc, deleteDoc  } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const usersCollection = collection(db, "usuarios")

const queryStudents = query(usersCollection, where("admin", "==", false));

const queryStudentsSuggestion = (name) => query(usersCollection,
  where("admin", "==", false),
  orderBy('nome'),
  startAt(name),
  endAt(`${name}\uf8ff`)
);

export const getStudents = async () => {
  const students = []
  const querySnapshot = await getDocs(queryStudents);
  querySnapshot.forEach((doc) => {
    students.push({id: doc.id, ...doc.data()});
  });
  return students
}

export const addStudent = async (student) => {
  await addDoc(usersCollection, {
    ...student,
    admin: false,
    status: ''
  })
}

export const updateStudent = async (student) => {
  const studentRef = doc(db, 'usuarios', student.id)
  
  await updateDoc(studentRef, student)
}

export const deleteStudent = async (id) => {
  const studentRef = doc(db, 'usuarios', id)
  
  await deleteDoc(studentRef)
}

export const suggestStudent = async (name) => {
  const students = []
  const querySnapshot = await getDocs(queryStudentsSuggestion(name));
  querySnapshot.forEach((doc) => {
    students.push({id: doc.id, label: doc.data().nome});
  });
  
  return students
}