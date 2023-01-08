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
  TableContainer, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
// components
import StatusLabel from '../components/status-label'
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome', alignRight: false},
  {id: 'idade', label: 'Idade', alignRight: false},
  {id: 'genero', label: 'Gênero', alignRight: false},
  {id: 'telefone', label: 'Telefone', alignRight: false},
  {id: 'email', label: 'E-mail', alignRight: false},
  {id: 'status', label: 'Status', alignRight: false},
  {id: ''},
];

// ----------------------------------------------------------

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const {students, removeStudent} = useStudents()
  const {setStudent, resetValues} = useStudent()
  const [currentStudent, setCurrentStudent] = useState()
  const {catracaFunction} = useStudents();

  const handleCatracas = () =>{
    console.log(currentStudent.nome)
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
    setOpenModalTreino(true);
    setOpen(false);
  }
    
  const handleCloseModalTreino = () => {
    setOpenModalTreino(false)
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
                        const {id, nome, telefone, email, genero, idade, status} = row;
                        
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {nome}
                                </Typography>
                              </Stack>
                            </TableCell>
                            
                            <TableCell align="left">{idade}</TableCell>
                            
                            <TableCell align="left">
                              {genero === 'f' ? 'Feminino' : 'Masculino'}
                            </TableCell>
                            
                            <TableCell align="left">{telefone}</TableCell>
                            
                            <TableCell align="left">{email}</TableCell>
                            
                            <TableCell align="left">
                              <StatusLabel status={status}/>
                            </TableCell>
                            
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
            window.open('https://sandbox.asaas.com/c/610370838991',"_blank");
            }}>
          Pagamento
        </MenuItem>
        <MenuItem onClick={handleOpenTreino}>
          Adicionar Treino
        </MenuItem>
        <MenuItem onClick={handleCatracas}>
          Biometria
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
          Edit
        </MenuItem>
        <MenuItem onClick={handleOpenDelete} sx={{color: 'error.main'}}>
          <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
          Delete
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
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleRemove}>Remover {currentStudent?.nome}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
