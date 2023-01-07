import {Helmet} from 'react-helmet-async';
// @mui
import {Button, Container, Paper, Stack, TextField, Typography} from '@mui/material';
// components
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import { lockGate } from '../services/gate'

const columns = [
  {field: 'id', headerName: 'ID', width: 90},
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
  {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
  {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
  {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
  {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
  {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
  {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
  {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
  {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
];

export default function GatePage() {
  return (
    <>
      <Helmet>
        <title> SILVA GYM | Catraca </title>
      </Helmet>
      
      <Container>
        <Typography variant="h4" sx={{mb: 5}}>
          Catraca
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Button sx={{alignSelf: 'right', marginRight: 3}} variant="contained" onClick={() => lockGate(true)}>
              Bloquear Catraca
            </Button>
            <Button sx={{alignSelf: 'right'}} variant="contained" onClick={lockGate}>
              Desbloquear Catraca
            </Button>
          </Stack>
  
          <Stack direction="row" alignItems="center" justifyContent="space-between" >
            <TextField
              sx={{alignSelf: 'right', marginRight: 3}}
              size='small'
              id='nome'
              type='number'
              label='Quantidade de pessoas'
            />
            <Button sx={{alignSelf: 'right'}} variant="contained" >
              Salvar
            </Button>
          </Stack>
        </Stack>
        <Paper>
          <Box sx={{height: 400, width: '100%'}}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              experimentalFeatures={{newEditingApi: true}}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
}
