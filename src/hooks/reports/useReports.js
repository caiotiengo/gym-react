import {useContext} from "react";
import {ReportsContext} from "./ReportsProvider";
import { updateReport } from "../../services/reports";

export default function useReports()  {
  const { reports, totalStudents, fetchReports, totalPaid, totalLate, selectedMonth, setSelectedMonth, searchReports, reportCount } = useContext(ReportsContext)
  
  const editReport = async (report) => {
    await updateReport(report)
    await fetchReports()
  }

  const changeMonth = async (month) => {
    setSelectedMonth(month)
    await fetchReports()
  }
  
  const nextPage = async (page) => {
    await fetchReports(page)
  }
  
  return {
    reports,
    reportCount,
    totalStudents,
    nextPage,
    totalPaid,
    totalLate,
    editReport,
    selectedMonth,
    changeMonth,
    searchReports
  }
}