import {Helmet} from 'react-helmet-async';
import {useState} from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Popover,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer, CardContent, Grid, MenuItem, TextField, Paper, IconButton, Pagination
} from '@mui/material';
// components
import {useTheme} from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import useReports from "../hooks/reports/useReports";
import StatusLabel from "../components/status-label";
import useStudents from "../hooks/students/useStudents";
import Iconify from "../components/iconify";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {id: 'nome', label: 'Nome', alignRight: false},
  {id: 'cpf', label: 'CPF', alignRight: false},
  {id: 'meses', label: 'Status do pagamento', alignRight: false},
];

// ----------------------------------------------------------

const monthLookup = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

export default function ReportsPage() {
  const [open, setOpen] = useState(null);
  const [currentReport, setCurrentReport] = useState()
   const { reports, totalStudents, editReport, totalPaid, totalLate, selectedMonth, changeMonth, searchReports, nextPage, reportCount } = useReports()
  const { totalNewStudents } = useStudents()
  const [searchReport, setSearchReport] = useState('')
  const theme = useTheme();
  console.log(students.length, 'total')
  const handleOpenMenu = (event, index) => {
    setCurrentReport(reports[index])
    setOpen(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setOpen(null);
  };
 
  const handleEditStatus = (status) => {
    currentReport.meses[selectedMonth] = status
    editReport(currentReport)
    handleCloseMenu()
  }
  
  const handleSearchInput = async (event) => {
    setSearchReport(event.target.value)
    await searchReports(event.target.value)
  }
  
  const handleSearchButton = async (event) => {
    event.preventDefault()
    await searchReports(searchReport)
  }
  
  const handlePagination = (event, value) => {
    nextPage(value)
  }
  
  return (
    <>
      <Helmet>
        <title> Relatórios | SILVA GYM </title>
      </Helmet>
      
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Relatórios
          </Typography>
          <TextField
            sx={{width: "130px"}}
            select
            label='Selecione o mês'
            value={selectedMonth}
            onChange={(e) => changeMonth(e.target.value)}
          >
            {
              monthLookup.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))
            }
          </TextField>
          
        </Stack>
        
        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
          <Grid item xs={3}>
            <Card style={{backgroundColor: theme.palette.success.light}}>
              <CardContent>
                <Typography fontSize={18}>
                  {totalPaid}
                </Typography>
                <Typography>
                  pagos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card style={{backgroundColor: theme.palette.error.light}}>
              <CardContent>
                <Typography fontSize={18}>
                  {totalLate}
                </Typography>
                Não Pagos
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card >
              <CardContent>
                <Typography fontSize={18}>
                  {totalNewStudents}
                </Typography>
                Novos Alunos
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card >
              <CardContent>
                <Typography fontSize={18}>
                  {totalStudents}
                </Typography>
                Total de alunos
              </CardContent>
            </Card>
          </Grid>
        </Grid>
  
        <Stack direction="row" alignItems="center" justifyContent="space-between" my={5}>
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
        
        <Card style={{marginTop: 18}}>
          <Scrollbar>
            <TableContainer sx={{minWidth: 800}}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                />
                <TableBody>
                  {
                    reports.length
                      ? reports.map((row, index) => {
                        const {id, cpf, nomeAluno, meses} = row;
                        
                        return (
                          <TableRow hover key={id} tabIndex={-1} role="checkbox">
                            <TableCell component="th" scope="row">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="subtitle2" noWrap>
                                  {nomeAluno}
                                </Typography>
                              </Stack>
                            </TableCell>
                            
                            <TableCell align="left">{cpf}</TableCell>
                            
                            <TableCell title="Clique aqui para atualizar o status do pagamento" sx={{ cursor: "pointer" }} onClick={(e) => handleOpenMenu(e, index)} align="left">
                              <StatusLabel sx={{ cursor: "pointer" }} status={meses[selectedMonth]}/>
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
          <Pagination onChange={handlePagination} count={reportCount} variant="outlined" />
        </Stack>
      </Container>
  
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
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
          <Stack>
            <StatusLabel sx={{ cursor: "pointer" }} onClick={() => handleEditStatus('atraso')} status='atraso'/>
            <StatusLabel sx={{ cursor: "pointer" }} onClick={() => handleEditStatus('pago')} status='pago'/>
          </Stack>
        }
      </Popover>
    </>
  );
}
