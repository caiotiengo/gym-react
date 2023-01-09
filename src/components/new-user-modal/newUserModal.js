import {
  Box,
  Button,
  MenuItem,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
  Select,
  InputLabel
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, MobileDatePicker} from "@mui/x-date-pickers";
import {forwardRef, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
import {IMaskInput} from 'react-imask';
import useStudents from "../../hooks/students/useStudents";
import useStudent from "../../hooks/student/useStudent";

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

const gender = [
  {
    value: 'm',
    label: 'Masculino'
  },
  {
    value: 'f',
    label: 'Feminino'
  }
]

const TelefoneMaskInput = forwardRef((props, ref) => {
  const {onChange, ...other} = props;
  return (
    <IMaskInput
      {...other}
      mask="(#0) 0 0000-0000"
      definitions={{
        '#': /[1-9]/,
      }}
      inputRef={ref}
      onAccept={(value) => onChange({target: {name: props.name, value}})}
      overwrite
    />
  );
});

TelefoneMaskInput.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
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

const NewUserModal = (props) => {
  const {open, handleClose} = props
  const matches = useMediaQuery('(min-width: 600px)')
  const {
    student,
    setStudent,
    resetValues
  } = useStudent()
  const {
    newStudent,
    nome,
    email,
    idade,
    telefone,
    documento,
    endereco,
    aniversario,
    genero, 
    plano
  } = student
  
  const validateInitialValues = {
    nome: '',
    email: '',
    idade: '',
    telefone: '',
    documento: '',
    endereco: ''
  }
  const [validate, setValidate] = useState(validateInitialValues)
  
  const validateNome = (value) => {
    if (value === '') {
      setValidate({...validate, nome: 'Preencha seu nome'})
      return false
    }
    return true
  }
  const validateEmail = (value) => {
    if (value === '') {
      setValidate({...validate, email: 'Preencha seu email'})
      return false
    }
    return true
  }
  const validateIdade = (value) => {
    if (value === '') {
      setValidate({...validate, idade: 'Preencha sua idade'})
      return false
    }
    return true
  }
  const validateTelefone = (value) => {
    const formattedValue = value.replace(/\D/g, '')
    if (formattedValue === '') {
      setValidate({...validate, telefone: 'Preencha seu telefone'})
      return false
    }
    if (formattedValue.length < 11) {
      setValidate({...validate, telefone: 'Telefone está faltando dígitos...'})
      return false
    }
    return true
  }
  const validateDocumento = (value) => {
    const formattedValue = value.replace(/\D/g, '')
    if (formattedValue === '') {
      setValidate({...validate, documento: 'Preencha seu documento de CPF'})
      return false
    }
    if (formattedValue.length < 11) {
      setValidate({...validate, documento: 'Documento inválido...'})
      return false
    }
    return true
  }
  const validateEndereco = (value) => {
    if (value === '') {
      setValidate({...validate, endereco: 'Preencha seu endereço'})
      return false
    }
    return true
  }
  const resetValidate = () => {
    setValidate({})
  }
  const {addStudent, editStudent} = useStudents()
  
  const handleSubmit = async () => {
    resetValidate()
    if (!validateNome(nome)) return
    if (!validateEmail(email)) return
    if (!validateIdade(idade)) return
    if (!validateTelefone(telefone)) return
    if (!validateDocumento(documento)) return
    if (!validateEndereco(endereco)) return
    
    if (newStudent) {
      await addStudent(student)
    } else {
      await editStudent(student)
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
          {newStudent ? 'Adicionar' : 'Atualizar'} usuário
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
                error={Boolean(validate.nome)}
                helperText={validate.nome}
                required
                id='nome'
                label='Nome'
                value={nome}
                onChange={(e) => {
                  setValidate({...validate, nome: ''})
                  setStudent({...student, nome: e.target.value})
                }}
              />
              <TextField
                error={Boolean(validate.email)}
                helperText={validate.email}
                required
                id='email'
                label='E-mail'
                value={email}
                onChange={(e) => {
                  setValidate({...validate, email: ''})
                  setStudent({...student, email: e.target.value})
                }}
              />
              <TextField
                required
                type='number'
                id='idade'
                label='Idade'
                InputLabelProps={{
                  shrink: true,
                }}
                value={idade}
                error={Boolean(validate.idade)}
                helperText={validate.idade}
                onChange={(e) => {
                  setValidate({...validate, idade: ''})
                  setStudent({...student, idade: e.target.value})
                }}
              />
              <TextField
                required
                id='telefone'
                label='Telefone'
                type='tel'
                value={telefone}
                error={Boolean(validate.telefone)}
                helperText={validate.telefone}
                onChange={(e) => {
                  setValidate({...validate, telefone: ''})
                  setStudent({...student, telefone: e.target.value})
                }}
                InputProps={{
                  inputComponent: TelefoneMaskInput,
                }}
              />
              <TextField
                required
                id='cpf'
                label='cpf'
                type='text'
                value={documento}
                error={Boolean(validate.documento)}
                helperText={validate.documento}
                onChange={(e) => {
                  setValidate({...validate, documento: ''})
                  setStudent({...student, documento: e.target.value})
                }}
                InputProps={{
                  inputComponent: DocumentMaskInput
                }}
              />
              <TextField
                required
                id='endereco'
                label='endereço'
                type='text'
                value={endereco}
                error={Boolean(validate.endereco)}
                helperText={validate.endereco}
                onChange={(e) => {
                  setValidate({...validate, endereco: ''})
                  setStudent({...student, endereco: e.target.value})
                }}
              />
              <TextField
                select
                label='Gênero'
                value={genero}
                onChange={(e) => setStudent({...student, genero: e.target.value})}
              >
                {gender.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Select
                label="Planos"
                id="demo-simple-select"
                sx={{ width: '46%', marginRight: 1, height:55, marginTop: 1 }}
                defaultValue='Planos'
                displayEmpty
                renderValue={value => value?.length ? Array.isArray(value) ? value.join(', ') : value : value}
                onChange={(e) =>{
                  console.log(e.target.value);
                  setStudent({...student, plano: e.target.value})
                }}
              >
                <MenuItem value='Experimental'>Experimental</MenuItem>
                <MenuItem value='Day Use'>Day Use</MenuItem>
                <MenuItem value='Mensal'>Mensal</MenuItem>
                <MenuItem value='Trimestral'>Trimestral</MenuItem>
                <MenuItem value='Semestral'>Semestral</MenuItem>
                <MenuItem value='Anual'>Anual</MenuItem>

              </Select>
              {matches
                ? <DesktopDatePicker
                  label="Data de Nascimento"
                  inputFormat="DD/MM/YYYY"
                  value={aniversario}
                  onChange={(e) => {
                    setStudent({...student, aniversario: e.format()})
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDatePicker
                  label="Data de Nascimento"
                  inputFormat="DD/MM/YYYY"
                  value={aniversario}
                  onChange={(e) => setStudent({...student, aniversario: e.format()})}
                  renderInput={(params) => <TextField {...params} />}
                />}
              <Stack direction="row" justifyContent='right' width='100%'>
                <Button onClick={handleSubmit} variant='contained'>{newStudent ? 'Adicionar' : 'Atualizar'}</Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </Paper>
      </Box>
    </Modal>
  )
}

NewUserModal.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}

export default NewUserModal