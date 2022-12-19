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
  TableContainer, CardContent, Grid, MenuItem, TextField
} from '@mui/material';
// components
import {useTheme} from "@mui/material/styles";
import Scrollbar from '../components/scrollbar';
// sections
import {UserListHead} from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import useReports from "../hooks/reports/useReports";
import StatusLabel from "../components/status-label";
import useStudents from "../hooks/students/useStudents";

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
   const { reports, editReport, totalPaid, totalLate, selectedMonth, setSelectedMonth } = useReports()
  const { students, totalNewStudents } = useStudents()
  const theme = useTheme();
  
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

  return (
    <>
      <Helmet>
        <title> Relatórios | SYLVA GYM </title>
      </Helmet>
      
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Relatórios
          </Typography>
          <TextField
            select
            label='Selecione o mês'
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
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
                  {students.length}
                </Typography>
                Total de alunos
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
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
                            
                            <TableCell onClick={(e) => handleOpenMenu(e, index)} align="left">
                              <StatusLabel status={meses[selectedMonth]}/>
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
            <StatusLabel onClick={() => handleEditStatus('atraso')} status='atraso'/>
            <StatusLabel onClick={() => handleEditStatus('pago')} status='pago'/>
          </Stack>
        }
      </Popover>
    </>
  );
}
