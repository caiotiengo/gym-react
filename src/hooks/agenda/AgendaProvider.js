import {createContext, useMemo, useState} from "react";
import PropTypes from "prop-types";
import { getAgenda } from "../../services/agenda";

export const AgendaContext = createContext()
export const AgendaProvider = (props) => {
  const { children } = props
  const [agenda, setAgenda] = useState([])
  
  const fetchAgenda = async (date) => {
    const currentAgenda = await getAgenda(date)
  
    setAgenda(currentAgenda)
  }
  
  const values = useMemo(() => ({
    agenda,
    fetchAgenda
  }), [agenda])
  
  return <AgendaContext.Provider value={values}>{children}</AgendaContext.Provider>
}

AgendaProvider.propTypes = {
  children: PropTypes.node
}