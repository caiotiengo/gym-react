import {createContext, useMemo, useState} from "react";
import PropTypes from "prop-types";

export const ProfessorContext = createContext()
export const ProfessorProvider = (props) => {
  const { children } = props
  const initialValues = {
    nomeCompleto: '',
    cpf: '',
    alunosNoMes: Array(12).fill(0),
    avaliacoes: [],
    newProfessor: true
  }
  const [professor, setProfessor] = useState(initialValues)

  const resetValues = () => {
    setProfessor(initialValues)
  }
  
  const values = useMemo(() => ({
    professor,
    setProfessor,
    resetValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [professor])
  
  return <ProfessorContext.Provider value={values}>{children}</ProfessorContext.Provider>
}

ProfessorProvider.propTypes = {
  children: PropTypes.node
}