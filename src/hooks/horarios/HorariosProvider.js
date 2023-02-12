import {createContext, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getHorarios } from "../../services/agenda";

export const HorariosContext = createContext();
export const HorariosProvider = (props) => {
  const { children } = props
  const [Horarios, setHorarios] = useState([])
  
  const fetchHorarios = async () => {
    const currentHorarios = await getHorarios()
  
    setHorarios(currentHorarios)
  }
  
  const values = useMemo(() => ({
    Horarios,
    fetchHorarios
  }), [Horarios])
  
  return <HorariosContext.Provider value={values}>{children}</HorariosContext.Provider>
}

HorariosProvider.propTypes = {
  children: PropTypes.node
}