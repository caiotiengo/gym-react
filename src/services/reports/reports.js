import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase'

const reportsCollection = collection(db, "pagamentos")

export const getReports = async () => {
  const reports = []
  const querySnapshot = await getDocs(reportsCollection);
  querySnapshot.forEach((doc) => {
    reports.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return reports
}

export const updateReport = async (report) => {
  const reportRef = doc(db, 'pagamentos', report.id)

  await updateDoc(reportRef, report)
}
