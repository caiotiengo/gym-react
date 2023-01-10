import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const reportsCollection = collection(db, "pagamentos")

export const getReports = async () => {
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

export const updateReport = async (report) => {
  console.log(report?.uid);
  const reportRef = doc(db, 'pagamentos', report.uid)

  await updateDoc(reportRef, report)
}
export const createReport = async (user,userId) =>{
  await addDoc(reportsCollection, {
    cpf:user?.documento,
    id:userId,
    uid:'',
    meses:[
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
    nomeAluno:user.nome
  }).then(async docRef => {
    const reportReference = doc(db, 'pagamentos', docRef.id)
    await updateDoc(reportReference,{
      uid:docRef.id
    });
  })
    .catch(error => console.error("Error adding document: ", error))
}

