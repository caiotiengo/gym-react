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
  TableContainer,
} from '@mui/material';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import useStudents from "../hooks/students/useStudents";
import Label from "../components/label";
import NewUserModal from "../components/new-user-modal";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome', alignRight: false},
  {id: 'idade', label: 'Idade', alignRight: false},
  {id: 'genero', label: 'Gênero', alignRight: false},
  {id: 'telefone', label: 'Telefone', alignRight: false},
  {id: 'email', label: 'E-mail', alignRight: false},
  {id: ''},
];

// ----------------------------------------------------------

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false)

  const {students} = useStudents()
  
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(null);
  };
  
  const emptyRows = students > 0 ? Math.max(0, (1 + students)) : 0;
  
  return (
    <>
      <Helmet>
        <title> User | Minimal UI </title>
      </Helmet>
      
      <NewUserModal open={openModal} handleClose={handleCloseModal}/>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button sx={{alignSelf: 'right'}} onClick={handleOpenModal} variant="contained" startIcon={<Iconify icon="eva:plus-fill"/>}>
            Adicionar usuário
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
                  {students.map((row) => {
                    const {id, nome, telefone, email, genero, idade} = row;
                    
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
                          <Label
                            color={(genero === 'f' && 'primary') || 'secondary'}>{genero === 'f' ? 'Feminino' : 'Masculino'}</Label>
                        </TableCell>
                        
                        <TableCell align="left">{telefone}</TableCell>
                        
                        <TableCell align="left">{email}</TableCell>
                        
                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                            <Iconify icon={'eva:more-vertical-fill'}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{height: 53 * emptyRows}}>
                      <TableCell colSpan={6}/>
                    </TableRow>
                  )}
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
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{mr: 2}}/>
          Edit
        </MenuItem>
        
        <MenuItem sx={{color: 'error.main'}}>
          <Iconify icon={'eva:trash-2-outline'} sx={{mr: 2}}/>
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
