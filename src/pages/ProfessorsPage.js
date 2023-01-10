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
  TableContainer, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Paper, Pagination
} from '@mui/material';
// components
import InputBase from "@mui/material/InputBase";
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import useProfessors from "../hooks/professors/useProfessors";
import useProfessor from "../hooks/professor/useProfessor";
import NewProfessorModal from "../components/new-professor-modal";
import ProfessorEvaluation from "../components/professor-evaluation";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome', alignRight: false},
  {id: 'cpf', label: 'CPF', alignRight: false},
  {id: 'alunosNoMes', label: 'Qnt. alunos nesse mês', alignRight: false},
  {id: ''},
];

// ----------------------------------------------------------

export default function ProfessorsPage() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)
  const [openDelete, setOpenDelete] = useState(false);
  const [openEvaluation, setOpenEvaluation] = useState(false);
  const {professors, removeProfessor, searchProfessors, professorsCount, nextPage} = useProfessors()
  const {setProfessor, resetValues} = useProfessor()
  const [currentProfessor, setCurrentProfessor] = useState()
  const [searchProfessor, setSearchProfessor] = useState('')
  
  const {catracaFunction } = useProfessors();

  const handleCatracas = () =>{
    console.log(currentProfessor.nomeCompleto)
    catracaFunction(currentProfessor.nomeCompleto);
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
    setCurrentProfessor(professors[index])
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(null);
  };
  
  const handleEdit = () => {
    setProfessor({
      ...currentProfessor,
      newProfessor: false
    })
    setOpenModal(true)
    setOpen(false)
  }
  
  const handleOpenDelete = () => {
    setOpenDelete(true);
    setOpen(false)
  };
  
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  
  const handleRemove = () => {
    removeProfessor(currentProfessor.id)
    setOpenDelete(false)
  }
  
  const handleOpenEvaluation = () => {
    setProfessor({
      ...currentProfessor
    })
    setOpenEvaluation(true)
    setOpen(false)
  }
  
  const handleClickEvaluation = (index) => {
    setCurrentProfessor(professors[index])
  }
  
  const handleCloseEvaluation = () => {
    setOpenEvaluation(false)
  }
  
  const handleSearchInput = async (event) => {
    setSearchProfessor(event.target.value)
    await searchProfessors(event.target.value)
  }
  
  const handleSearchButton = async (event) => {
    event.preventDefault()
    await searchProfessors(searchProfessor)
  }
  
  const handlePagination = (event, value) => {
    nextPage(value)
  }
  
  return (
    <>
      <Helmet>
        <title> Professores | SILVA GYM </title>
      </Helmet>
      
      <NewProfessorModal open={openModal} handleClose={handleCloseModal}/>
      <ProfessorEvaluation open={openEvaluation} handleClose={handleCloseEvaluation}/>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Professores
          </Typography>
          <Button sx={{alignSelf: 'right'}} onClick={handleOpenModal} variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill"/>}>
            Adicionar professor
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
                    professors.length
                      ? professors.map((row, index) => {
                        const {id, nomeCompleto, cpf, alunosNoMes} = row;
                        
                        const currentMonth = new Date().getMonth()
                        
                        return (
                          <TableRow onClick={() => handleClickEvaluation(index)} onDoubleClick={handleOpenEvaluation} hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {nomeCompleto}
                                </Typography>
                              </Stack>
                            </TableCell>
                            
                            <TableCell align="left">{cpf}</TableCell>
                            
                            <TableCell align="left">{alunosNoMes[currentMonth] || 0}</TableCell>
                            
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
                              Nenhum professor ainda...
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
          <Pagination onChange={handlePagination} count={professorsCount} variant="outlined" />
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
       {
       /* <MenuItem onClick={handleOpenEvaluation}>
          <Iconify icon={'eva:star-fill'} sx={{mr: 2}}/>
          Avaliações
        </MenuItem>
        */
        } 
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
        <DialogTitle>Remover Professor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja remover {currentProfessor?.nomeCompleto} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
          <Button onClick={handleRemove}>Remover {currentProfessor?.nomeCompleto}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
