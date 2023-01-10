import {
    Box,
    Button,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography
  } from "@mui/material";
  import {useState} from "react";
  import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
  import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
  import PropTypes from "prop-types";
  import TextareaAutosize from '@mui/base/TextareaAutosize';
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
  
  const NewTreinamentoModal = (props) => {
    const {open, handleClose} = props;
    const {
      student
    } = useStudent()
   const {addTreino } = useStudents()
   const [text, setText] = useState("");
   const [textTreino, setTextTreino] = useState("");

    const handleSubmit = async () => {
      await addTreino(student,text, textTreino);
      setText('')
      setTextTreino('')

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
                '& .MuiTextField-root': { mb:1, width: '55ch'},
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
                label='Nome do Professor'
                value={textTreino}
                onChange={(e) => {
                  setTextTreino(e.target.value);
                }}
              />
              <TextareaAutosize
                aria-label="Treino"
                  placeholder="Digite aqui o treino do aluno selecionado"
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  style={{ width: 600, height:300, marginBottom:10, borderRadius:5, boxShadow: 24, padding: 10}}
                  value={text}
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