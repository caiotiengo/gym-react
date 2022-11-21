import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getStudents } from "../../services/students";

export const StudentsContext = createContext()
export const StudentsProvider = (props) => {
  const { children } = props
  const [students, setStudents] = useState([])
  
  const fetchStudents = async () => {
    const currentStudents = await getStudents()
    
    setStudents(currentStudents)
  }
  
  useEffect(() => {
    fetchStudents()
  }, [])
  
  const values = useMemo(() => ({
    students,
    fetchStudents
  }), [students])
  
  return <StudentsContext.Provider value={values}>{children}</StudentsContext.Provider>
}

StudentsProvider.propTypes = {
  children: PropTypes.node
}