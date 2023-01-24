import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {findReports, getReportsPageCount, getReportsPerPage, getAllReports} from "../../services/reports";

export const ReportsContext = createContext()
export const ReportsProvider = (props) => {
  const { children } = props
  const [reports, setReports] = useState([])
  const [reportsStats, setReportsStats] = useState([])
  const [totalStudents, setTotalStudents] = useState(0)
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalLate, setTotalLate] = useState(0)
  const [reportCount, setReportCount] = useState(0)
  
  const getTotalPaid = async () => {
    let paid = 0
    await reportsStats.forEach(({ meses }) => {
      if(meses[selectedMonth] === 'pago') {
        paid += 1
      }
    })
    setTotalPaid(paid)
  }
  
  const getTotalLate = () => {
    let late = 0
    reportsStats.forEach(({ meses }) => {
      if(meses[selectedMonth] === 'atraso') {
        late += 1
      }
    })
    setTotalLate(late)
  }
  
  const fetchReports = async (page = 1) => {
    const currentReports = await getReportsPerPage(page)
    const currentReportsStats = await getAllReports(page)
    setTotalStudents(currentReportsStats.length)
    setReports(currentReports)
    setReportsStats(currentReportsStats)
  }
  
  const searchReports = async (name) => {
    if(!name || name === '') fetchReports()
    
    const result = await findReports(name)
  
    setReports(result)
  }
  
  const setPageCount = async () =>{
    const res = await getReportsPageCount()
    setReportCount(res)
  }
  
  useEffect(() => {
    fetchReports()
    setPageCount()
  }, [])
  
  useEffect(() => {
    getTotalPaid()
    getTotalLate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, selectedMonth])
  
  
  const values = useMemo(() => ({
    reports,
    reportCount,
    totalStudents,
    searchReports,
    fetchReports,
    totalPaid,
    totalLate,
    selectedMonth,
    setSelectedMonth,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [reports, totalPaid, totalLate])
  
  return <ReportsContext.Provider value={values}>{children}</ReportsContext.Provider>
}

ReportsProvider.propTypes = {
  children: PropTypes.node
}