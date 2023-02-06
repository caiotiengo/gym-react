import {useContext} from "react";
import {TrainingContext} from "./TrainingProvider";

export default function useTraining() {
  const {training, setTraining, resetValues} = useContext(TrainingContext)
  
  return {
    training,
    setTraining,
    resetValues
  }
}