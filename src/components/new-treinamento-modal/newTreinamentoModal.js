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
  import PropTypes from "prop-types";
  import TextareaAutosize from '@mui/base/TextareaAutosize';
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
  

  
  const NewTreinamentoModal = (props) => {
    const {open, handleClose} = props;
    // const {addProfessor, editProfessor} = useProfessors();
    const handleSubmit = async () => {
     /* resetValidate()
      if (!validateNomeCompleto(nomeCompleto)) return
      if (!validateCpf(cpf)) return
      
      if (newProfessor) {
        await addProfessor(professor)
      } else {
        await editProfessor(professor)
      }
      resetValues()
      resetValidate() */

      handleClose()
    }
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h3">
            Treino de hoje
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
              <TextareaAutosize
                aria-label="Treino"
                  placeholder="Digite aqui o treino do aluno selecionado"
                  onChange={(e) => {
                    console.log(e)
                  }}
                  style={{ width: 600, height:300, marginBottom:10, borderRadius:2, boxShadow: 24 }}
                />
               <Stack direction="row" justifyContent='right' width='100%'>
                <Button onClick={handleSubmit} variant='contained'>Salvar treino</Button>
              </Stack>
              </Box>
              </LocalizationProvider>
              </Paper>
        </Box>


      </Modal>
    );
  }
  
  NewTreinamentoModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func
  }
  
  export default NewTreinamentoModal