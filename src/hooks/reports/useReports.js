import {useContext} from "react";
import {ReportsContext} from "./ReportsProvider";
import { updateReport } from "../../services/reports";

export default function useReports()  {
  const { reports, fetchReports, totalPaid, totalLate, selectedMonth, setSelectedMonth } = useContext(ReportsContext)
  
  const editReport = async (report) => {
    await updateReport(report)
    await fetchReports()
  }

  
  return {
    reports,
    totalPaid,
    totalLate,
    editReport,
    selectedMonth,
    setSelectedMonth
  }
}