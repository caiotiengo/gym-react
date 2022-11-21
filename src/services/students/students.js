import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
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
  const docRef = await addDoc(usersCollection, {
    ...student,
    admin: false
  })
  
  console.log(docRef.id)
}