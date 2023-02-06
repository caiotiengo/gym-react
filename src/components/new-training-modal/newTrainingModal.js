import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  Autocomplete
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useEffect, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
import {DesktopDateTimePicker, MobileDateTimePicker} from "@mui/x-date-pickers";
import useTraining from "../../hooks/training/useTraining";
import useStudents from "../../hooks/students/useStudents";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const NewTrainingModal = (props) => {
  const {open, handleClose, handleAction} = props
  const matches = useMediaQuery('(min-width: 600px)')
  const {
    training,
    setTraining,
    resetValues
  } = useTraining()
  const {suggestion: getStudentsSuggestion} = useStudents()
  const [studentsSuggestion, setStudentsSuggestion] = useState([])
  const [studentName, setStudentName] = useState('')
  
  useEffect(() => {
    const getSuggestion = async () => {
      const studentSuggestion = await getStudentsSuggestion(training.aluno)
      setStudentsSuggestion(studentSuggestion)
    }
    getSuggestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const {
    startDate,
    endDate,
    aluno,
    title,
    newTraining
  } = training
  
  
  const onStudentCustomFieldChange = async (nextValue) => {
    const studentsSuggestion = await getStudentsSuggestion(nextValue?.label || '')
    setStudentsSuggestion(studentsSuggestion)
    setTraining({
      ...training,
      aluno: nextValue?.label ? studentsSuggestion[0].label : '',
      idAluno: nextValue?.label ? studentsSuggestion[0].id : ''
    })
  };
  
  const handleSubmit = async () => {
    await handleAction(training)
    
    resetValues()
    handleClose()
  }
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalStyle}>
        <Typography variant="h3">
          {newTraining ? 'Adicionar' : 'Atualizar'} treino
        </Typography>
        <Paper>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              component='form'
              sx={{
                '& .MuiTextField-root': {m: 1, width: '25ch'},
                'display': 'flex',
                'flexWrap': 'wrap',
                'justifyContent': 'space-between'
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id='title'
                label='Nome do treino'
                value={title}
                onChange={(e) => {
                  setTraining({...training, title: e.target.value})
                }}
              />
              <Autocomplete
                disablePortal
                id="aluno"
                options={studentsSuggestion}
                value={aluno}
                inputValue={studentName}
                onChange={(e, newValue) => onStudentCustomFieldChange(newValue)}
                onInputChange={(e, newInputValue) => setStudentName(newInputValue)}
                renderInput={(params) => <TextField
                  placeholder='Selecione um aluno'
                  {...params}
                />}
              />
              {matches
                ? <DesktopDateTimePicker
                  label="Inicio do treino"
                  inputFormat="DD/MM/YYYY hh:mm"
                  ampm={false}
                  value={startDate}
                  onChange={(e) => {
                    setTraining({...training, startDate: new Date(e.format())})
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDateTimePicker
                  label="Inicio do treino"
                  inputFormat="DD/MM/YYYY hh:mm"
                  ampm={false}
                  value={startDate}
                  onChange={(e) => setTraining({...training, startDate: new Date(e.format())})}
                  renderInput={(params) => <TextField {...params} />}
                />}
              {matches
                ? <DesktopDateTimePicker
                  label="Fim do treino"
                  inputFormat="DD/MM/YYYY hh:mm"
                  ampm={false}
                  value={endDate}
                  onChange={(e) => {
                    setTraining({...training, endDate: new Date(e.format())})
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDateTimePicker
                  label="Fim do treino"
                  inputFormat="DD/MM/YYYY hh:mm"
                  ampm={false}
                  value={endDate}
                  onChange={(e) => setTraining({...training, endDate: new Date(e.format())})}
                  renderInput={(params) => <TextField {...params} />}
                />}
              <Stack direction="row" justifyContent='right' width='100%'>
                <Button onClick={handleSubmit} variant='contained'>{newTraining ? 'Adicionar' : 'Atualizar'}</Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Box>
    </Modal>
  )
}

NewTrainingModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleAction: PropTypes.func
}

export default NewTrainingModal