import {Box, Button, MenuItem, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DesktopDatePicker, MobileDatePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import dayjs from "dayjs";
import useMediaQuery from "@mui/material/useMediaQuery";
import PropTypes from "prop-types";
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

const NewUserModal = (props) => {
  const { open, handleClose } = props
  const [currentGender, setCurrentGender] = useState('')
  const [birthdate, setBirthdate] = useState(dayjs())
  const matches = useMediaQuery('(min-width: 600px)')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [idade, setIdade] = useState('')
  const [telefone, setTelefone] = useState('')
  const [documento, setDocumento] = useState('')
  const [endereco, setEndereco] = useState('')
  const { addStudent } = useStudents()
  
  const resetValues = () => {
    setCurrentGender('')
    setBirthdate(dayjs())
    setNome('')
    setEmail('')
    setIdade('')
    setTelefone('')
    setDocumento('')
    setEndereco('')
  }
  
  const handleSubmit = async () => {
    const student = {
      nome,
      email,
      idade,
      telefone,
      documento,
      endereco,
      birthdate: birthdate.format(),
      genero: currentGender
    }
  
    await addStudent(student)
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
          Adicionar usuário
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
                required
                id='nome'
                label='Nome'
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <TextField
                required
                id='email'
                label='E-mail'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setIdade(e.target.value)}
              />
              <TextField
                required
                id='telefone'
                label='Telefone'
                type='tel'
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <TextField
                required
                id='cpf'
                label='cpf'
                type='text'
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
              <TextField
                required
                id='endereco'
                label='endereço'
                type='text'
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <TextField
                select
                label='Gênero'
                value={currentGender}
                onChange={(e) => setCurrentGender(e.target.value)}
              >
                {gender.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              {matches
                ? <DesktopDatePicker
                  label="Data de Nascimento"
                  inputFormat="DD/MM/YYYY"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e)}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDatePicker
                  label="Data de Nascimento"
                  inputFormat="DD/MM/YYYY"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e)}
                  renderInput={(params) => <TextField {...params} />}
                />}
              <Stack direction="row" justifyContent='right' width='100%'>
                <Button onClick={handleSubmit} variant='contained'>Adicionar</Button>
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