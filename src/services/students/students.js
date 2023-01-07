import { collection, query, where, startAt, endAt, orderBy, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc  } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import {createReport} from '../reports'

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
  addDoc(usersCollection, {
    ...student,
    admin: false,
    status: '',
    biometria:false,
    idUserCatraca: ''
  }).then(async docRef => {
    await setDoc(doc(usersCollection,docRef.id),{
        ...student,
        id:docRef.id,
        admin: false,
        status: '',
        biometria:false,
        idUserCatraca: ''
      });
      await createReport(student, docRef.id);

    })
    .catch(error => console.error("Error adding document: ", error))

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