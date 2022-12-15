import {useContext} from "react";
import {AgendaContext} from "./AgendaProvider";
import {addAppointment, updateAppointment, deleteAppointment} from "../../services/agenda";

export default function useAgenda()  {
  const { agenda, fetchAgenda } = useContext(AgendaContext)
  const addNewAppointment = async (user) => {
    await addAppointment(user)
    await fetchAgenda()
  }
  const editAppointment = async (user) => {
    await updateAppointment(user)
    await fetchAgenda()
  }
  
  const removeAppointment = async (id) => {
    await deleteAppointment(id)
    await fetchAgenda()
  }
  
  return {
    agenda,
    addNewAppointment,
    editAppointment,
    removeAppointment,
  }
}