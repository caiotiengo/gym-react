import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  orderBy,
  startAt,
  endAt,
  limit, startAfter
} from 'firebase/firestore'
import {db} from '../../utils/firebase'
import {capitalizeFirstLetter} from "../../utils/capitilizeString";

const reportsCollection = collection(db, "pagamentos")

const pageLimit = 10

const queryReportsByName = (name) => query(reportsCollection,
  orderBy('nomeAluno'),
  startAt(capitalizeFirstLetter(name)),
  endAt(`${name}\uf8ff`)
);

export const findReports = async (name) => {
  const reports = []
  const querySnapshot = await getDocs(queryReportsByName(name));
  querySnapshot.forEach((doc) => {
    reports.push({id: doc.id, ...doc.data()});
  });
  
  return reports
}

export const getReportsPageCount = async () => {
  const querySnapshot = await getDocs(reportsCollection);
  return Math.ceil(querySnapshot.size / pageLimit)
}

export const getAllReports = async () => {
  const reports = []
  const querySnapshot = await getDocs(reportsCollection);
  querySnapshot.forEach((doc) => {
    reports.push({
      id: doc.uid,
      ...doc.data()
    });
  });
  return reports
}

export const getReportsPerPage = async (page) => {
  const reports = []
  const firstLimit = page === 1 ? page : (page - 1)
  const first = query(reportsCollection, orderBy('nomeAluno'), limit(pageLimit * firstLimit))
  const querySnapshot = await getDocs(first);
  const lastReport = querySnapshot.docs[querySnapshot.docs.length - 1]
  const next = query(reportsCollection, orderBy('nomeAluno'), startAfter(lastReport), limit(pageLimit))
  
  if (page === 1) {
    querySnapshot.forEach((doc) => {
      reports.push({id: doc.id, ...doc.data()});
    });
  } else {
    const nextReport = await getDocs(next)
    
    nextReport.forEach((doc) => {
      reports.push({id: doc.id, ...doc.data()});
    });
  }
  
  return reports
}

export const updateReport = async (report) => {
  const reportRef = doc(db, 'pagamentos', report.uid)
  
  await updateDoc(reportRef, report)
}

export const createReport = async (user, userId) => {
  await addDoc(reportsCollection, {
    cpf: user?.documento,
    id: userId,
    uid: '',
    meses: [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null],
    nomeAluno: user.nome
  }).then(async docRef => {
      const reportReference = doc(db, 'pagamentos', docRef.id)
      await updateDoc(reportReference, {
        uid: docRef.id
      });
    })
    .catch(error => console.error("Error adding document: ", error))
}

