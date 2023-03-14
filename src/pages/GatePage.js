import {useEffect, useState} from "react";
import {Helmet} from 'react-helmet-async';
import { Button, Container, Grid, Stack, TextField, Typography, Popover, List, ListItem, ListItemText, ListItemSecondaryAction, Card, CardHeader, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { TimePicker } from '@mui/lab';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import { lockGate } from '../services/gate';
import useAgenda from "../hooks/agenda/useAgenda";
import { getHorarios, updateHorarios, getFullAgenda } from '../services/agenda';

const WeekdayHeader = styled(Typography)({
  fontWeight: 'bold',
  color: '#333',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

/* eslint-disable no-plusplus */

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
  const [total, setTotalTrainings] = useState('Carregando..') // adicionar o limite aqui
  const [horarioMapeado, setDiaSemana] = useState();
  const [horariosBlock, setHorariosBlock] = useState();
  const [open, setOpen] = useState(null);
  const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const [selectedWeekday, setSelectedWeekday] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [limit, setLimit] = useState(20);
  const [selectedHour, setSelectedHour] = useState('09:00');
  const [currentStartDate, setCurrentStartDate] = useState(new Date().setHours(0,0,0,0))
  const [currentEndDate, setCurrentEndDate] = useState(new Date().setHours(23,59,0,0))
  const [time, setTime] = useState(new Date('2023-03-03T18:00:00'));
  Promise.all([getFullAgenda()]).then((snap) => {
    console.log(snap[0])
    const lista = snap[0];
    setTotalTrainings(snap[0].length);
    console.log(getMostSelectedHorarioInicio(lista))
  })
  function getMostSelectedHorarioInicio(array) {
    // Create an empty object to store the counts of each horarioInicio
    const counts = {};
  
    // Loop through the array and count each horarioInicio
    array.forEach(obj => {
      if(obj.horarioInicio.seconds  > 0){
        const key =  new Date(obj.horarioInicio.seconds * 1000);
        counts[key] = counts[key] ? counts[key] + 1 : 1;
      }

    });
  
    // Find the horarioInicio with the highest count
    let mostSelectedHorarioInicio;
    let highestCount = 0;
    Object.keys(counts).forEach(key => {
      if (counts[key] > highestCount) {
        highestCount = counts[key];
        mostSelectedHorarioInicio = key;
      }
    });

    // Return the most selected horarioInicio as a JavaScript Date object
    return mostSelectedHorarioInicio;
  }
  const today = new Date();
  const data = [
    { name: 'John Doe', time: '10:00 AM' },
    { name: 'Jane Doe', time: '11:00 AM' },
    { name: 'Bob Smith', time: '02:00 PM' },
  ];

  const hours = data.reduce((acc, cur) => {
    const hour = cur.time.substring(0, 5);
    if (acc[hour]) {
      acc[hour] ++;
    } else {
      acc[hour] = 1;
    }
    return acc;
  }, {});

  const sortedHours = Object.entries(hours).sort((a, b) => b[1] - a[1]);
  const mostFrequentHour = sortedHours.length > 0 ? sortedHours[0][0] : '';

  const handleWeekdayClick = (event, weekday) => {
    setSelectedWeekday(weekday);
  }

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  }

  const handleHourChange = (event) => {
    setSelectedHour(event.target.value);
  }

  const handleTimeChange = (value) => {
    setTime(value);
  }

  const handleCloseDashboard = () => {
    setSelectedWeekday(null);
  }

  const handleSave = () => {
    // TODO: handle save logic
    handleCloseDashboard();
  }

  const handleCancel = () => {
    setSelectedHour('');
    handleCloseDashboard();
  }




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
            <Button sx={{alignSelf: 'right'}} variant="contained" onClick={() => lockGate(false)}>
              Desbloquear Catraca
            </Button>
          </Stack>
        </Stack>
        <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <WeekdayHeader variant="h4">Relatório de Entrada</WeekdayHeader>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              {weekdays.map((day) => (
                <Grid item key={day}>
                  <Button color="inherit" onClick={(event) => handleWeekdayClick(event, day)}>
                    {day}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {selectedWeekday}
      </Grid>
    </Grid>
    <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Total de pessoas" />
              <CardContent>
                <Typography variant="h4" align="center">{total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Horário mais frequente" />
              <CardContent>
                <Typography variant="h4" align="center">{mostFrequentHour}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ marginBottom: '8px' }}>Configurações do dia</Typography>
            <FormControl fullWidth sx={{ marginBottom: '16px' }}>
      <InputLabel id="limit-select-label">Limite de pessoas</InputLabel>
      <Select
        labelId="limit-select-label"
        id="limit-select"
        value={limit}
        label="Limite de pessoas"
        onChange={handleLimitChange}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={30}>30</MenuItem>
        <MenuItem value={40}>40</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth sx={{ marginBottom: '16px' }}>
      <InputLabel id="hour-select-label">Horário de abertura</InputLabel>
      <Select
        labelId="hour-select-label"
        id="hour-select"
        value={selectedHour}
        label="Horário de abertura"
        onChange={handleHourChange}
      >
        <MenuItem value="08:00">08:00</MenuItem>
        <MenuItem value="09:00">09:00</MenuItem>
        <MenuItem value="10:00">10:00</MenuItem>
        <MenuItem value="11:00">11:00</MenuItem>
        <MenuItem value="12:00">12:00</MenuItem>
        <MenuItem value="13:00">13:00</MenuItem>
        <MenuItem value="14:00">14:00</MenuItem>
        <MenuItem value="15:00">15:00</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth>
      <TimePicker
        label="Horário de fechamento"
        value={time}
        onChange={handleTimeChange}
        renderInput={(params) => <TextField {...params} />}
        sx={{ marginBottom: '16px' }}
      />
    </FormControl>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Button fullWidth variant="contained" onClick={handleCancel}>Cancelar</Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button fullWidth variant="contained" onClick={handleSave}>Salvar</Button>
      </Grid>
    </Grid>
  </Grid>
        </Grid>
      </Container>
    </>
  );
}
