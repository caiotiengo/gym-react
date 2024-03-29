import {Helmet} from 'react-helmet-async';
import {useState} from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Button,
  Popover,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, Pagination,
} from '@mui/material';
import InputBase from '@mui/material/InputBase';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import useStudents from "../hooks/students/useStudents";
import NewUserModal from "../components/new-user-modal";
import NewTreinamentoModal from "../components/new-treinamento-modal";
import useStudent from "../hooks/student/useStudent";
import { lockGate } from '../services/gate';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome', alignRight: false},
  {id: 'telefone', label: 'Telefone', alignRight: false},
  {id: 'email', label: 'E-mail', alignRight: false},
  {id: 'Plano', label: 'Plano', alignRight: false},
  {id: ''},
];

// ----------------------------------------------------------

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const {students, removeStudent, searchStudents, nextPage, studentsCount, catracaFunction} = useStudents()
  const {setStudent, resetValues} = useStudent()
  const [currentStudent, setCurrentStudent] = useState()
  const [searchStudent, setSearchStudent] = useState('')

  const handleCatracas = () =>{
    catracaFunction(currentStudent.nome);
    setOpen(false)
  }

  const handleOpenModal = () => {
    resetValues()
    setOpenModal(true)
  }
  
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  
  const handleOpenMenu = (event, index) => {
    setCurrentStudent(students[index])
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(false);
  };
  
  const handleEdit = () => {
    setStudent({
      ...currentStudent,
      newStudent: false
    })
    setOpenModal(true)
    setOpen(false)
  }
  
  const [openDelete, setOpenDelete] = useState(false);
  
  const handleOpenDelete = () => {
    setOpenDelete(true);
    setOpen(false)
  };
  
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  
  const handleRemove = () => {
    removeStudent(currentStudent.id)
    setOpenDelete(false)
  }
  const [openModalTreino, setOpenModalTreino] = useState(false);

  const handleOpenTreino =() =>{
    setStudent({
      ...currentStudent,
      newStudent: false
    })
    setOpenModalTreino(true);
    setOpen(false);
  }
    
  const handleCloseModalTreino = () => {
    setOpenModalTreino(false)
  }

  const handleSearchInput = async (event) => {
    setSearchStudent(event.target.value)
    await searchStudents(event.target.value)
  }
  
  const handleSearchButton = async (event) => {
    event.preventDefault()
    await searchStudents(searchStudent)
  }
  
  const handlePagination = (event, value) => {
    nextPage(value)
  }
  
  return (
    <>
      <Helmet>
        <title> User | SILVA GYM </title>
      </Helmet>
      
      <NewUserModal open={openModal} handleClose={handleCloseModal}/>
      <NewTreinamentoModal open={openModalTreino} handleClose={handleCloseModalTreino}/>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Alunos
          </Typography>
          <Button sx={{alignSelf: 'right'}} onClick={handleOpenModal} variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill"/>}>
            Adicionar aluno
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 300 }}
            noValidate
            autoComplete="off"
            onSubmit={handleSearchButton}
          >
            <InputBase
              sx={{ ml: 1, flex: 6 }}
              placeholder="Buscar por nome"
              onChange={handleSearchInput}
            />
            <IconButton onClick={handleSearchButton} sx={{ ml: 1, flex: 1 }} type="button" aria-label="search">
              <Iconify icon="eva:search-fill"/>
            </IconButton>
          </Paper>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button sx={{alignSelf: 'right', marginRight: 3}} variant="contained" onClick={() => lockGate(true)}>
              Bloquear Catraca
            </Button>
            <Button sx={{alignSelf: 'right'}} variant="contained" onClick={() => lockGate(false)}>
              Desbloquear Catraca
            </Button>
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
                    students.length
                      ? students.map((row, index) => {
                        const {id, nome, telefone, email, plano} = row;
                        
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {nome}
                                </Typography>
                              </Stack>
                            </TableCell>
                            
                            <TableCell align="left">{telefone}</TableCell>
                            
                            <TableCell align="left">{email}</TableCell>
                            
                            <TableCell align="left">{plano}</TableCell>
                            
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
                            <Typography  gutterBottom>
                              Nenhum aluno ainda...
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
  
        <Stack alignItems="center" justifyContent="space-between" mt={2}>
          <Pagination onChange={handlePagination} count={studentsCount} variant="outlined" />
        </Stack>
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
        <MenuItem onClick={(e) => {
            e.preventDefault();
            if(currentStudent.plano === 'Mensal'){
              window.open('https://www.asaas.com/c/860524753111',"_blank");
              setOpen(false);

            }else if(currentStudent.plano === 'Trimestral'){
              window.open('https://www.asaas.com/c/341969192509',"_blank");
              setOpen(false);


            }else if(currentStudent.plano === 'Semestral'){
              window.open('https://www.asaas.com/c/981430672935',"_blank");
              setOpen(false);


            }else if(currentStudent.plano === 'Day Use'){
              window.open('https://www.asaas.com/c/327772926828',"_blank");
              setOpen(false);


            }else if(currentStudent.plano === 'Anual'){
              window.open('https://www.asaas.com/c/018467455664',"_blank");
              setOpen(false);


            }else{
              alert('Aluno sem plano ou experimental')
            }
        }}>
          Pagamento
        </MenuItem>
        <MenuItem onClick={handleCatracas}>
          Biometria
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
          Editar
        </MenuItem>
        <MenuItem onClick={handleOpenDelete} sx={{color: 'error.main'}}>
          <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
          Deletar
        </MenuItem>
      </Popover>
  
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Remover Aluno</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover {currentStudent?.nome} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleRemove}>Remover {currentStudent?.nome}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
