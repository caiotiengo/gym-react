import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {findProfessors, getProfessorsPerPage, getProfessorsPageCount} from "../../services/professors";

export const ProfessorsContext = createContext()
export const ProfessorsProvider = (props) => {
  const { children } = props
  const [professors, setProfessors] = useState([])
  const [professorsCount, setProfessorsCount] = useState(0)
  
  const fetchProfessors = async (page = 1) => {
    const currentProfessors = await getProfessorsPerPage(page)
    
    setProfessors(currentProfessors)
  }
  
  const searchProfessors = async (name) => {
    if(!name || name === '') fetchProfessors()
    
    const result = await findProfessors(name)
  
    setProfessors(result)
  }
 
  const setPageCount = async () =>{
    const res = await getProfessorsPageCount()
    setProfessorsCount(res)
  }

  useEffect(() => {
    fetchProfessors()
    setPageCount()
    
  }, [])
  
  const values = useMemo(() => ({
    professors,
    professorsCount,
    fetchProfessors,
    searchProfessors,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [professors])
  
  return <ProfessorsContext.Provider value={values}>{children}</ProfessorsContext.Provider>
}

ProfessorsProvider.propTypes = {
  children: PropTypes.node
}