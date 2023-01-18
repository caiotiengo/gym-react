import {
  collection,
  query,
  where,
  startAt,
  endAt,
  orderBy,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  limit, startAfter
} from 'firebase/firestore'
import { db } from '../../utils/firebase'
import {createReport} from '../reports'
import {capitalizeFirstLetter} from "../../utils/capitilizeString";

const usersCollection = collection(db, "usuarios")
const treinosCollection = collection(db, "treinamentos")

const queryStudents = query(usersCollection, where("admin", "==", false));

const pageLimit = 10

const queryStudentsSuggestion = (name) => query(usersCollection,
  where("admin", "==", false),
  orderBy('nome'),
  startAt(capitalizeFirstLetter(name)),
  endAt(`${name}\uf8ff`)
);

export const findStudents = async (name) => {
  const students = []
  
  const querySnapshot = await getDocs(queryStudentsSuggestion(name));
  querySnapshot.forEach((doc) => {
    students.push({id: doc.id, ...doc.data()});
  });
  
  return students
}

export const getStudentsPageCount = async () => {
  const querySnapshot = await getDocs(queryStudents);
  return Math.ceil(querySnapshot.size / pageLimit)
}

export const getStudentsPerPage = async (page) => {
  const students = []
  const firstLimit = page === 1 ? page : (page - 1)
  const first = query(queryStudents, orderBy('nome'), limit(pageLimit * firstLimit))
  const querySnapshot = await getDocs(first);
  const lastStudent = querySnapshot.docs[querySnapshot.docs.length - 1]
  const next = query(queryStudents, orderBy('nome'), startAfter(lastStudent), limit(pageLimit))
  
  if (page === 1) {
    querySnapshot.forEach((doc) => {
      students.push({id: doc.id, ...doc.data()});
    });
  } else {
    const nextStudents = await getDocs(next)
    
    nextStudents.forEach((doc) => {
      students.push({id: doc.id, ...doc.data()});
    });
  }
  
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
export const addTreinamento = async(student, treinoText, profe)=>{
  const date = Date.now()
  addDoc(treinosCollection,{
    nomeAluno: student.nome,
    dia: date,
    treino: treinoText,
    alunoUID: student.id,
    professor:profe
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