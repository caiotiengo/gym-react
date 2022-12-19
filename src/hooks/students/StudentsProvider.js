import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getStudents } from "../../services/students";

export const StudentsContext = createContext()
export const StudentsProvider = (props) => {
  const { children } = props
  const [students, setStudents] = useState([])
  const [totalNewStudents, setTotalNewStudents] = useState(0)
  
  const fetchStudents = async () => {
    const currentStudents = await getStudents()
    
    setStudents(currentStudents)
  }
  
  const getTotalNewStudents = () => {
    let newStudents = 0
    students.forEach(({ status }) => {
      if(!status) {
        newStudents += 1
      }
    })
    setTotalNewStudents(newStudents)
  }
  
  useEffect(() => {
    fetchStudents()
  }, [])
  
  useEffect(() => {
    getTotalNewStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students])
  
  const values = useMemo(() => ({
    students,
    totalNewStudents,
    fetchStudents
  }), [students, totalNewStudents])
  
  return <StudentsContext.Provider value={values}>{children}</StudentsContext.Provider>
}

StudentsProvider.propTypes = {
  children: PropTypes.node
}