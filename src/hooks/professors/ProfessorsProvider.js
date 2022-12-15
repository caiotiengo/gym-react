import {createContext, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getProfessors } from "../../services/professors";

export const ProfessorsContext = createContext()
export const ProfessorsProvider = (props) => {
  const { children } = props
  const [professors, setProfessors] = useState([])
  
  const fetchProfessors = async () => {
    const currentProfessors = await getProfessors()
    
    setProfessors(currentProfessors)
  }
  
  useEffect(() => {
    fetchProfessors()
  }, [])
  
  const values = useMemo(() => ({
    professors,
    fetchProfessors
  }), [professors])
  
  return <ProfessorsContext.Provider value={values}>{children}</ProfessorsContext.Provider>
}

ProfessorsProvider.propTypes = {
  children: PropTypes.node
}