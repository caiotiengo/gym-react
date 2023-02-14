/* eslint-disable react/prop-types */
import {Helmet} from 'react-helmet-async';
// @mui
import {
  Box,
  Button,
  Card, Chip,
  Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, MenuItem,
  Modal, Popover,
  Stack,Grid,
  Table, TableBody, TableCell,
  TableContainer, TableRow, TextField,
  Typography, CardContent
} from '@mui/material';
// ----------------------------------------------------------------------

import {useEffect, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import moment from "moment";
import 'moment/locale/pt-br'
import useMediaQuery from "@mui/material/useMediaQuery";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DesktopDateTimePicker, MobileDateTimePicker} from "@mui/x-date-pickers";
import useHorarios from '../hooks/horarios/useHorarios';
import useAgenda from "../hooks/agenda/useAgenda";
import Scrollbar from "../components/scrollbar/Scrollbar";
import {UserListHead} from "../sections/@dashboard/user";
import USERLIST from "../_mock/user";
import Iconify from "../components/iconify";
import useTraining from "../hooks/training/useTraining";
import NewTrainingModal from "../components/new-training-modal";
import { getHorarios, updateHorarios } from '../services/agenda';

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome do aluno', alignRight: false},
  {id: 'data', label: 'Data e hora', alignRight: false},
  {id: 'titulo', label: 'O que vai treinar', alignRight: false},
  {id: ''}
];

const SuccessMessage = (props) => {
  const {open, handleClose, message} = props
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
    display: 'flex',
    justifyContent: 'space-between'
  };
  
  return (<Modal
    open={open}
    onClose={handleClose}
  >
    <Box sx={modalStyle}>
      {message}
      <CloseIcon sx={{cursor: 'pointer'}} onClick={handleClose}/>
    </Box>
  </Modal>)
}

export default function Agenda() {



  const [limitTraining, setLimitTraining] = useState(18) // adicionar o limite aqui
  const [diaSemana, setDiaSemana] = useState();
  const [horariosBlock, setHorariosBlock] = useState();
  const [open, setOpen] = useState(null);
  const [currentStartDate, setCurrentStartDate] = useState(new Date().setHours(0,0,0,0))
  const [currentEndDate, setCurrentEndDate] = useState(new Date().setHours(23,59,0,0))
  const {agenda, fetchAgenda, addNewAppointment, editAppointment, removeAppointment} = useAgenda({startDate: currentStartDate, endDate: currentEndDate})
  const [openSuccessCreatedModal, setOpenSuccessCreatedModal] = useState(false)
  const [openSuccessRemoveModal, setOpenSuccessRemoveModal] = useState(false)
  const [openSuccessUpdatedModal, setOpenSuccessUpdatedModal] = useState(false)
  const [openNewTrainingModal, setOpenNewTrainingModal] = useState(false)
  const [currentTraining, setCurrentTraining] = useState()
  const matches = useMediaQuery('(min-width: 600px)')
  const {training, setTraining, resetValues} = useTraining()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  
  useEffect(() => {
    fetchAgenda({startDate: currentStartDate, endDate: currentEndDate})
    // eslint-disable-next-line
    getHora();

  }, [currentStartDate, currentEndDate])

  const getHora = () =>{
    Promise.all([getHorarios()]).then((snap) => {
      const horarios = snap[0];
      const hoje = new Date(currentStartDate);
      const idWeek = hoje.getDay();


      // Bloco para comparação e verificação de limites de horarios
      if(idWeek === 0 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '7' && x.horarios === hours);
          console.log(horarioFiltrado)
          console.log(hours)

          setDiaSemana(horarioFiltrado[0]);
          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '7' && x.horarios ===  hours)
          console.log(horarioFiltrado)
          console.log(hours)
          setDiaSemana(horarioFiltrado[0]);
          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
      }else if(idWeek === 1 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '1' && x.horarios === hours);
          console.log(horarioFiltrado)
          console.log(hours)
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);

          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '1' && x.horarios ===  hours)
          console.log(horarioFiltrado)
          console.log(hours)
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);

          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18);
        }
  
      }else if(idWeek === 2 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '2' && x.horarios === hours);
          setDiaSemana(horarioFiltrado[0]);
          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '2' && x.horarios ===  hours);
          setDiaSemana(horarioFiltrado[0]);
          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
  
      }else if(idWeek === 3 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '3' && x.horarios === hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '3' && x.horarios ===  hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
  
      }else if(idWeek === 4 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '4' && x.horarios === hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '4' && x.horarios ===  hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
  
      }else if(idWeek === 5 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '5' && x.horarios === hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '5' && x.horarios ===  hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
  
      }else if(idWeek === 6 && hoje.getHours() !== 0){
        if(hoje.getMinutes().toLocaleString() === '0'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}0`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '6' && x.horarios === hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))
        }else if(hoje.getMinutes().toLocaleString() === '30'){
          const initialZero = `0${hoje.getHours().toLocaleString()}`;
          const hours =  `${initialZero.slice(-2)}:${hoje.getMinutes().toLocaleString()}`;
          const horarioFiltrado = horarios.filter(x => x.idSemana === '6' && x.horarios ===  hours);
          setDiaSemana(horarioFiltrado[0]);

          console.log(horarioFiltrado[0]?.maxPessoas, horarioFiltrado[0]?.diaSemana);
          setLimitTraining(Number(horarioFiltrado[0]?.maxPessoas))

        }else{
          setLimitTraining(18)
        }
      }else{
        setLimitTraining(18)
      }


      // bloco para atualização de horários vazios
      horarios.forEach((h) =>{
        if(h.diaBloqueado !== 'vazio'){
          const modifyDate = h.diaBloqueado.split('/');
          const dataBloqueada = new Date(+modifyDate[2], modifyDate[1] - 1, +modifyDate[0]);
          if(dataBloqueada.toLocaleDateString("pt-BR") < hoje.toLocaleDateString("pt-BR") ){
            const body ={
              bloqueado: h.bloqueado,
              diaBloqueado:'vazio',
              diaSemana:h.diaSemana,
              horarios:h.horarios,
              idSemana:h.idSemana,
              maxPessoas:h.maxPessoas,
              qtdPessoas:'0'
             }
             updateHorarios(body,h.id);
          }
        }else{
          // blo
        }
      })
    })
  }

  const disableNewTrainings = agenda.length >= limitTraining
  
  const handleOpenMenu = (event, index) => {
    setCurrentTraining(agenda[index])
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(null);
  };
  
  const handleNewTraining = () => {
    resetValues()
    setOpenNewTrainingModal(true)
  }
  const horariosUpdate = (valorLimite) =>{
    const body ={
    bloqueado: diaSemana.bloqueado,
    diaBloqueado:diaSemana.diaBloqueado,
    diaSemana:diaSemana.diaSemana,
    horarios:diaSemana.horarios,
    idSemana:diaSemana.idSemana,
    maxPessoas:String(valorLimite),
    qtdPessoas:diaSemana.qtdPessoas
   }
   updateHorarios(body,diaSemana.id)
  }
  const bloquearHorario = () => {
    const data = new Date(currentStartDate);
    const body ={
      bloqueado: diaSemana.bloqueado,
      diaBloqueado:data.toLocaleDateString("pt-BR"),
      diaSemana:diaSemana.diaSemana,
      horarios:diaSemana.horarios,
      idSemana:diaSemana.idSemana,
      maxPessoas:diaSemana.maxPessoas,
      qtdPessoas:String(agenda.length)
     }
     updateHorarios(body,diaSemana.id);
     alert('Horário bloqueado.');
  }
  const desbloquearHorario = () => {
    const data = new Date(currentStartDate);
    const body ={
      bloqueado: diaSemana.bloqueado,
      diaBloqueado:'vazio',
      diaSemana:diaSemana.diaSemana,
      horarios:diaSemana.horarios,
      idSemana:diaSemana.idSemana,
      maxPessoas:diaSemana.maxPessoas,
      qtdPessoas:String(agenda.length)
     }
     updateHorarios(body,diaSemana.id);
     alert('Horário desbloqueado.');

  }
  const handleEdit = () => {
    setTraining({
      ...currentTraining,
      newTraining: false
    })
    setOpenNewTrainingModal(true)
    setOpen(false)
    setOpenSuccessUpdatedModal(true)
  }
  
  const handleOpenDelete = () => {
    setOpenDeleteDialog(true);
    setOpen(false)
  }
  const handleRemove = () => {
    removeAppointment(currentTraining.id)
    setOpenDeleteDialog(false);
    setOpenSuccessRemoveModal(true)
  }
  
  const handleAction = async (newTraining) => {
    if(training.newTraining){
      await addNewAppointment(newTraining)
      setOpenSuccessCreatedModal(true)
    } else {
      await editAppointment(newTraining)
      setOpenSuccessUpdatedModal(true)
    }
  }
  
  return (
    <>
      <SuccessMessage message='Treino atualizado com sucesso!' open={openSuccessUpdatedModal} handleClose={() => setOpenSuccessUpdatedModal(false)}/>
      <SuccessMessage message='Treino marcado com sucesso!' open={openSuccessCreatedModal} handleClose={() => setOpenSuccessCreatedModal(false)}/>
      <SuccessMessage message='Treino removido com sucesso!' open={openSuccessRemoveModal} handleClose={() => setOpenSuccessRemoveModal(false)}/>
      <NewTrainingModal
        open={openNewTrainingModal}
        handleClose={() => setOpenNewTrainingModal(false)}
        handleAction={(e) => handleAction(e)}
      />
      
      <Helmet>
        <title> SILVA GYM | Agenda </title>
      </Helmet>
      
      <Container>
        <Stack sx={{mb: 4}} direction='row' alignItems='center' justifyContent='space-between' >
          <Typography variant="h4">
            Agenda
          </Typography>
          <Button disabled={disableNewTrainings} variant='contained' onClick={handleNewTraining} >Adicionar treino</Button>
        </Stack>
        <Stack sx={{margin: 2}} direction='row' alignItems='start' justifyContent='space-between'>
            <Card>
              <CardContent>
                <Typography fontSize={18}>
                  {agenda.length}
                </Typography>
                Alunos para {moment(currentStartDate).calendar()}
              </CardContent>
            </Card>
          </Stack>
        <Stack sx={{mb: 4}} direction='row' alignItems='start' >
          <Stack style={{margin:20}} >
            <LocalizationProvider  dateAdapter={AdapterDayjs} adapterLocale='pt-BR'>
              {matches
                ? <DesktopDateTimePicker 
                  label="Dia do treino"
                  value={currentStartDate}
                  inputFormat='DD/MM/YYYY HH:mm'
                  ampm={false}
                  shouldDisableTime={(timeValue, clockType) => {
                    return clockType === "minutes" && timeValue !== 30 && timeValue !== 0;
                  }}
                  onChange={(e) => {
                    setCurrentStartDate(e?.format())
                    setCurrentEndDate(e?.add(30, 'minute').format())
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDateTimePicker
                  label="Dia do treino"
                  value={currentStartDate}
                  inputFormat='DD/MM/YYYY HH:mm'
                  ampm={false}
                  onChange={(e) => setCurrentStartDate(e?.format())}
                  renderInput={(params) => <TextField {...params} />}
                />}
              <Button style={{margin:5}} onClick={() => {
                setCurrentStartDate(new Date(currentStartDate).setHours(0,0,0,0))
                setCurrentEndDate(new Date(currentEndDate).setHours(23,59,0,0))
              }}>Mostrar todos os treinos do dia</Button>
            </LocalizationProvider>
          </Stack>
          <Stack style={{margin:20}} >
            <TextField
              id='limit'
              label='Limite de treinos por hora'
              type='number'
              value={limitTraining}
              onChange={(e) => {horariosUpdate(e.target.value); setLimitTraining(e.target.value)}}
            />
            <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 4}}>
              <Grid item mb={6}>
                <Button style={{margin:5}} onClick={() => { bloquearHorario() }} >Bloquear horário</Button>
              </Grid>
              <Grid item mb={6}>
                <Button style={{margin:5}} onClick={() => { desbloquearHorario() }} >Desbloquear horário</Button>
              </Grid>
            </Grid>
           

          </Stack>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{minWidth: 800}}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                />
                <TableBody>
                  {
                    agenda.length
                      ? agenda.map((row, index) => {
                        const {id, aluno, startDate, title} = row;
                        
                        const date = moment(startDate)
                        date.locale('pt-br')
                      
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {aluno}
                                </Typography>
                              </Stack>
                            </TableCell>
                      
                            <TableCell align="left">{date.format('D MMM') } | {date.format('LT')}</TableCell>
                            
                            <TableCell align="left">{title}</TableCell>
                            
                            <TableCell align="right">
                              <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, index)}>
                                <Iconify icon={'eva:more-vertical-fill'}/>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                      : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography gutterBottom>
                              Nenhum treino marcado para esse dia...
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
  
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{vertical: 'top', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
          Editar
        </MenuItem>
    
        <MenuItem onClick={handleOpenDelete} sx={{color: 'error.main'}}>
          <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
          Deletar
        </MenuItem>
      </Popover>
      
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Remover Treino</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover o treino de {currentTraining?.aluno} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={handleRemove}>Remover</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
