import {useContext} from "react";
import { HorariosContext } from "./HorariosProvider";

export default function useHorarios()  {
  const { getHorarios, fetchHorarios } = useContext(HorariosContext);
  
  return {
    getHorarios,
    fetchHorarios
  }
}