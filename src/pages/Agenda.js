/* eslint-disable react/prop-types */
import {Helmet} from 'react-helmet-async';
// @mui
import {
  Box,
  Button,
  Card, Chip,
  Container, IconButton, MenuItem,
  Modal, Popover,
  Stack,
  Table, TableBody, TableCell,
  TableContainer, TableRow, TextField,
  Typography
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
import useAgenda from "../hooks/agenda/useAgenda";
import Scrollbar from "../components/scrollbar/Scrollbar";
import {UserListHead} from "../sections/@dashboard/user";
import USERLIST from "../_mock/user";
import Iconify from "../components/iconify";

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome do aluno', alignRight: false},
  {id: 'data', label: 'Data e hora', alignRight: false},
  {id: 'titulo', label: 'O que vai treinar', alignRight: false},
  {id: ''}
];

const SuccessAppointmentCreated = (props) => {
  const {open, handleClose} = props
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
      Treino marcado com sucesso!
      <CloseIcon sx={{cursor: 'pointer'}} onClick={handleClose}/>
    </Box>
  </Modal>)
}

const NewTrainingModal = (props) => {
  const {open, handleClose} = props
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
      Treino marcado com sucesso!
      <CloseIcon sx={{cursor: 'pointer'}} onClick={handleClose}/>
    </Box>
  </Modal>)
}

export default function Agenda() {
  const [open, setOpen] = useState(null);
  const [currentStartDate, setCurrentStartDate] = useState(new Date().setHours(0,0,0,0))
  const [currentEndDate, setCurrentEndDate] = useState(new Date().setHours(23,59,0,0))
  const [limitTraining, setLimitTraining] = useState(20)
  const {agenda, fetchAgenda, addNewAppointment, editAppointment, removeAppointment} = useAgenda({startDate: currentStartDate, endDate: currentEndDate})
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [openNewTrainingModal, setOpenNewTrainingModal] = useState(false)
  const [currentTraining, setCurrentTraining] = useState()
  const matches = useMediaQuery('(min-width: 600px)')
  
  //TODO Create, update and delete training
  
  useEffect(() => {
    fetchAgenda({startDate: currentStartDate, endDate: currentEndDate})
    // eslint-disable-next-line
  }, [currentStartDate, currentEndDate])
  
  const disableNewTrainings = agenda.length >= limitTraining
  
  const handleOpenMenu = (event, index) => {
    setCurrentTraining(agenda[index])
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(null);
  };
  
  const handleEdit = () => {
    return null
  }
  
  const handleOpenDelete = () => {
    return null
  }
  
  return (
    <>
      <SuccessAppointmentCreated open={openSuccessModal} handleClose={() => setOpenSuccessModal(false)}/>
      <NewTrainingModal open={openNewTrainingModal} handleClose={() => setOpenNewTrainingModal(false)}/>
      <Helmet>
        <title> SILVA GYM | Agenda </title>
      </Helmet>
      
      <Container>
        <Stack sx={{mb: 4}} direction='row' alignItems='center' justifyContent='space-between' >
          <Typography variant="h4">
            Agenda
          </Typography>
          <Button disabled={disableNewTrainings} variant='contained' onClick={() => setOpenNewTrainingModal(true)} >Adicionar treino</Button>
        </Stack>
        <Stack sx={{mb: 4}} direction='row' alignItems='start' justifyContent='space-between' >
          <Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {matches
                ? <DesktopDateTimePicker
                  label="Dia do treino"
                  inputFormat="DD/MM/YYYY hh:mm"
                  value={currentStartDate}
                  onChange={(e) => {
                    setCurrentStartDate(e.format())
                    setCurrentEndDate(e.add(30, 'minute').format())
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                : <MobileDateTimePicker
                  label="Dia do treino"
                  inputFormat="DD/MM/YYYY"
                  value={currentStartDate}
                  onChange={(e) => setCurrentStartDate(e.format())}
                  renderInput={(params) => <TextField {...params} />}
                />}
              <Button onClick={() => {
                setCurrentStartDate(new Date(currentStartDate).setHours(0,0,0,0))
                setCurrentEndDate(new Date(currentEndDate).setHours(23,59,0,0))
              }}>Mostrar todos os treinos do dia</Button>
            </LocalizationProvider>
          </Stack>
          <Stack>
            <Typography variant="p">
              Alunos para {moment(currentStartDate).calendar()}
            </Typography>
            <Chip color='primary' label={agenda.length} />
          </Stack>
          <Stack>
            <TextField
              id='limit'
              label='Limite de treinos por hora'
              type='number'
              value={limitTraining}
              onChange={(e) => setLimitTraining(e.target.value)}
            />
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
    </>
  );
}
