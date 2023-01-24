import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {findStudents, getStudentsPerPage, getStudentsPageCount, getAllStutends} from "../../services/students";

export const StudentsContext = createContext()
export const StudentsProvider = (props) => {
  const { children } = props
  const [students, setStudents] = useState([])
  const [allStudents, setAllStudents] = useState([])
  const [totalNewStudents, setTotalNewStudents] = useState(0)
  const [studentsCount, setStudentsCount] = useState(0)
  
  const fetchStudents = async (page = 1) => {
    const currentStudents = await getStudentsPerPage(page)
    const totalStudents = await getAllStutends()
    
    setAllStudents(totalStudents)
    setStudents(currentStudents)
  }
  
  const searchStudents = async (name) => {
    if(!name || name === '') fetchStudents()
    
    const result = await findStudents(name)
    
    setStudents(result)
  }
  
  const getTotalNewStudents = () => {
    let newStudents = 0
    allStudents.forEach(({ status }) => {
      if(!status) {
        newStudents += 1
      }
    })
    setTotalNewStudents(newStudents)
  }
  
  const setPageCount = async () =>{
    const res = await getStudentsPageCount()
    setStudentsCount(res)
  }
  
  useEffect(() => {
    fetchStudents()
    setPageCount()
  }, [])
  
  useEffect(() => {
    getTotalNewStudents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students])
  
  const values = useMemo(() => ({
    students,
    totalNewStudents,
    studentsCount,
    fetchStudents,
    searchStudents
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [students, totalNewStudents])
  
  return <StudentsContext.Provider value={values}>{children}</StudentsContext.Provider>
}

StudentsProvider.propTypes = {
  children: PropTypes.node
}