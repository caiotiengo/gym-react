import 'dayjs/locale/pt-br';
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
    if(nextValue.label) {
      const studentsSuggestion = await getStudentsSuggestion(nextValue?.label)
      setStudentsSuggestion(studentsSuggestion)
      const selectedStudent = studentsSuggestion.filter(suggestion => suggestion.label === nextValue.label)
      setTraining({
        ...training,
        aluno: selectedStudent.label || '',
        idAluno: selectedStudent.id || ''
      })
    } else {
      const studentsSuggestion = await getStudentsSuggestion(nextValue)
      setStudentsSuggestion(studentsSuggestion)
    }
  };
  
  const handleSubmit = async () => {
    const currentTraining = training
    
    if (!training.aluno || training.aluno === '') {
      currentTraining.aluno = studentName
    }
    
    await handleAction(currentTraining)
    
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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-BR'>
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
                freeSolo
                disablePortal
                id="aluno"
                options={studentsSuggestion}
                value={aluno}
                inputValue={studentName}
                onChange={(e, newValue) => onStudentCustomFieldChange(newValue)}
                onInputChange={async(e, newInputValue) => {
                  setStudentName(newInputValue)
                  await onStudentCustomFieldChange(newInputValue)
                }}
                renderOption={(props, option, index) => {
                  const key = `listItem-${index}-${option.id}`;
                  return (
                    <li {...props} key={key}>
                      {option.label}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField
                  placeholder='Selecione um aluno'
                  {...params}
                />}
              />
              {matches
                ? <DesktopDateTimePicker
                  label="Inicio do treino"
                  ampm={false}
                  inputFormat='DD/MM/YYYY HH:mm'
                  value={startDate}
                  onChange={(e) =>
                    setTraining({
                      ...training,
                      startDate: new Date(e?.format()),
                      endDate: new Date(e?.add('30', 'minutes').format())
                    })
                  }
                  renderInput={(params) => <TextField {...params} inputProps={{
                    ...params.inputProps,
                    placeholder: "dd/mm/aaaa hh:mm"
                  }}/>}
                />
                : <MobileDateTimePicker
                  label="Inicio do treino"
                  ampm={false}
                  inputFormat='DD/MM/YYYY HH:mm'
                  value={startDate}
                  onChange={(e) => setTraining({
                    ...training,
                    startDate: new Date(e?.format()),
                    endDate: new Date(e?.add('30', 'minutes').format())
                  })}
                  renderInput={(params) => <TextField {...params} inputProps={{
                    ...params.inputProps,
                    placeholder: "dd/mm/aaaa hh:mm"
                  }}/>}
                />}
              {matches
                ? <DesktopDateTimePicker
                  label="Fim do treino"
                  ampm={false}
                  inputFormat='DD/MM/YYYY HH:mm'
                  value={endDate}
                  onChange={(e) => setTraining({...training, endDate: new Date(e?.format())})}
                  renderInput={(params) => <TextField {...params} inputProps={{
                    ...params.inputProps,
                    placeholder: "dd/mm/aaaa hh:mm"
                  }}/>}
                />
                : <MobileDateTimePicker
                  label="Fim do treino"
                  ampm={false}
                  inputFormat='DD/MM/YYYY HH:mm'
                  value={endDate}
                  onChange={(e) => setTraining({...training, endDate: new Date(e?.format())})}
                  renderInput={(params) => <TextField {...params} inputProps={{
                    ...params.inputProps,
                    placeholder: "dd/mm/aaaa hh:mm"
                  }}/>}
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