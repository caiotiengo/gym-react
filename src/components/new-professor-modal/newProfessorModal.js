import {
  Box,
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {forwardRef, useState} from "react";
import PropTypes from "prop-types";
import {IMaskInput} from 'react-imask';
import useProfessor from "../../hooks/professor/useProfessor";
import useProfessors from "../../hooks/professors/useProfessors";

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

const DocumentMaskInput = forwardRef((props, ref) => {
  const {onChange, ...other} = props;
  return (
    <IMaskInput
      {...other}
      mask="#00.000.000-00"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({target: {name: props.name, value}})}
      overwrite
    />
  );
});

DocumentMaskInput.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const NewProfessorModal = (props) => {
  const {open, handleClose} = props
  const {
    professor,
    setProfessor,
    resetValues
  } = useProfessor()
  const {
    newProfessor,
    nomeCompleto,
    cpf
  } = professor
  
  const validateInitialValues = {
    nomeCompleto: '',
    cpf: '',
    avaliacoes: [],
    alunosNoMes: Array(12).fill(0)
  }
  const [validate, setValidate] = useState(validateInitialValues)
  
  const validateNomeCompleto = (value) => {
    if (value === '') {
      setValidate({...validate, nomeCompleto: 'Preencha seu nome'})
      return false
    }
    return true
  }
  const validateCpf = (value) => {
    const formattedValue = value.replace(/\D/g, '')
    if (formattedValue === '') {
      setValidate({...validate, cpf: 'Preencha seu documento de CPF'})
      return false
    }
    if (formattedValue.length < 11) {
      setValidate({...validate, cpf: 'Documento inválido...'})
      return false
    }
    return true
  }
  const resetValidate = () => {
    setValidate({})
  }
  const {addProfessor, editProfessor} = useProfessors()
  
  const handleSubmit = async () => {
    resetValidate()
    if (!validateNomeCompleto(nomeCompleto)) return
    if (!validateCpf(cpf)) return
    
    if (newProfessor) {
      await addProfessor(professor)
    } else {
      await editProfessor(professor)
    }
    resetValues()
    resetValidate()
    handleClose()
  }
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalStyle}>
        <Typography variant="h3">
          {newProfessor ? 'Adicionar' : 'Atualizar'} professor
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
                error={Boolean(validate.nomeCompleto)}
                helperText={validate.nomeCompleto}
                required
                id='nome'
                label='Nome'
                value={nomeCompleto}
                onChange={(e) => {
                  setValidate({...validate, nomeCompleto: ''})
                  setProfessor({...professor, nomeCompleto: e.target.value})
                }}
              />
              <TextField
                required
                id='cpf'
                label='cpf'
                type='text'
                value={cpf}
                error={Boolean(validate.cpf)}
                helperText={validate.cpf}
                onChange={(e) => {
                  setValidate({...validate, cpf: ''})
                  setProfessor({...professor, cpf: e.target.value})
                }}
                InputProps={{
                  inputComponent: DocumentMaskInput
                }}
              />
              <Stack direction="row" justifyContent='right' width='100%'>
                <Button onClick={handleSubmit} variant='contained'>{newProfessor ? 'Adicionar' : 'Atualizar'}</Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Box>
    </Modal>
  )
}

NewProfessorModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}

export default NewProfessorModal