import {createContext, useMemo, useState} from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

export const StudentsContext = createContext()
export const StudentProvider = (props) => {
  const { children } = props
  const initialValues = {
    nome: '',
    email: '',
    idade: '',
    telefone: '',
    documento: '',
    endereco: '',
    aniversario: dayjs(),
    genero: 'm',
    newStudent: true
  }
  const [student, setStudent] = useState(initialValues)

  const resetValues = () => {
    setStudent(initialValues)
  }
  
  const values = useMemo(() => ({
    student,
    setStudent,
    resetValues
  }), [student])
  
  return <StudentsContext.Provider value={values}>{children}</StudentsContext.Provider>
}

StudentProvider.propTypes = {
  children: PropTypes.node
}