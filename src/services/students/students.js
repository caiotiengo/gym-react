import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc  } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const usersCollection = collection(db, "usuarios")

const queryStudents = query(usersCollection, where("admin", "==", false));

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