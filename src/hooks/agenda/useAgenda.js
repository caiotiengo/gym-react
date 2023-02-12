import {useContext} from "react";
import {AgendaContext} from "./AgendaProvider";
import {addAppointment, updateAppointment, deleteAppointment} from "../../services/agenda";

export default function useAgenda(date)  {
  const { agenda, fetchAgenda } = useContext(AgendaContext)
  
  const addNewAppointment = async (appointment) => {
    await addAppointment(appointment)
    await fetchAgenda(date)
  }
  const editAppointment = async (appointment) => {
    await updateAppointment(appointment)
    await fetchAgenda(date)
  }
  
  const removeAppointment = async (id) => {
    await deleteAppointment(id)
    await fetchAgenda(date)
  }

  return {
    agenda,
    fetchAgenda,
    addNewAppointment,
    editAppointment,
    removeAppointment
  }
}