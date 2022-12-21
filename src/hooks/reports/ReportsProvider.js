import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getReports } from "../../services/reports";

export const ReportsContext = createContext()
export const ReportsProvider = (props) => {
  const { children } = props
  const [reports, setReports] = useState([])
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [totalPaid, setTotalPaid] = useState(0)
  const [totalLate, setTotalLate] = useState(0)
  
  const getTotalPaid = async () => {
    let paid = 0
    await reports.forEach(({ meses }) => {
      if(meses[selectedMonth] === 'pago') {
        paid += 1
      }
    })
    setTotalPaid(paid)
  }
  
  const getTotalLate = () => {
    let late = 0
    reports.forEach(({ meses }) => {
      if(meses[selectedMonth] === 'atraso') {
        late += 1
      }
    })
    setTotalLate(late)
  }
  
  const fetchReports = async () => {
    const currentReports = await getReports()
    setReports(currentReports)
  }
  
  useEffect(() => {
    fetchReports()
  }, [])
  
  useEffect(() => {
    getTotalPaid()
    getTotalLate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, selectedMonth])
  
  
  const values = useMemo(() => ({
    reports,
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