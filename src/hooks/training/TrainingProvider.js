import {createContext, useMemo, useState} from "react";
import PropTypes from "prop-types";

export const TrainingContext = createContext()
export const TrainingProvider = (props) => {
  const { children } = props
  const initialValues = {
    startDate: '',
    endDate: '',
    aluno: '',
    idAluno: '',
    concluido: false,
    title: '',
    newTraining: true
  }
  const [training, setTraining] = useState(initialValues)

  const resetValues = () => {
    setTraining(initialValues)
  }
  
  const values = useMemo(() => ({
    training,
    setTraining,
    resetValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [training])
  
  return <TrainingContext.Provider value={values}>{children}</TrainingContext.Provider>
}

TrainingProvider.propTypes = {
  children: PropTypes.node
}