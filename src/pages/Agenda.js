/* eslint-disable react/prop-types */
import {Helmet} from 'react-helmet-async';
// @mui
import {Autocomplete, Container, Stack, Typography} from '@mui/material';
// ----------------------------------------------------------------------
import Paper from '@mui/material/Paper';
import {EditingState, ViewState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  DateNavigator,
  Toolbar,
  TodayButton,
  DragDropProvider,
  EditRecurrenceMenu,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import {useEffect, useState} from "react";
import {useTheme} from "@mui/material/styles";
import useStudents from "../hooks/students/useStudents";

const LabelComponent = (props) => {
  switch (props.text) {
    case 'Details':
      return <AppointmentForm.Label
        {...props}
        text="Aluno"
      />
    case '-':
      return <AppointmentForm.Label
        {...props}
      />
    case 'More Information':
    default:
      return null
  }
};

const InputComponent = (props) => {
  const {suggestion} = useStudents()
  const [studentsSuggestion, setStudentsSuggestion] = useState([])
  
  useEffect(() => {
    const getSuggestion = async () => {
      const studentsSuggestion = await suggestion(props.value)
      setStudentsSuggestion(studentsSuggestion)
    }
    getSuggestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  switch (props.type) {
    case 'titleTextEditor': {
      const onValueChangeHandler = async (name) => {
        const studentsSuggestion = await suggestion(name)
        setStudentsSuggestion(studentsSuggestion)
        props.onValueChange(name)
      }
      
      return (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={studentsSuggestion}
          sx={{width: 300}}
          onChange={(e) => onValueChangeHandler(e)}
          renderInput={(params) => <AppointmentForm.TextEditor
            {...params}
            {...props}
            onValueChange={onValueChangeHandler}
            placeholder='Selecione um aluno'
          />}
        />
      )
    }
    default:
      return null
  }
};

const BasicLayout = ({onFieldChange, appointmentData, ...restProps}) => {
  const onCustomFieldChange = (nextValue) => {
    onFieldChange({professor: nextValue?.innerText});
  };
  
  const options = [
    {label: 'The Godfather', id: 1},
    {label: 'Pulp Fiction', id: 2},
  ];
  
  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <AppointmentForm.Label
        text="Professor"
        type="title"
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{width: 300}}
        onChange={(e) => onCustomFieldChange(e.target)}
        renderInput={(params) => <AppointmentForm.TextEditor
          {...params}
          value={appointmentData.customField}
          onValueChange={onCustomFieldChange}
          placeholder="Selecione um professor"
        />}
      />
    
    </AppointmentForm.BasicLayout>
  );
};

const Appointment = ({
                       data,
                       onClick,
                       toggleVisibility,
                       onAppointmentMetaChange,
                       ...restProps
                     }) => {
  const theme = useTheme();
  
  return (
    <Appointments.Appointment
      style={{
        backgroundColor: theme.palette.primary.main
      }}
      onClick={({target}) => {
        onClick()
        toggleVisibility();
        onAppointmentMetaChange({target: target.parentElement.parentElement, data})
      }}
      {...restProps}
    >
      <>
        <Stack px='8px' color='white'>
          {data.title}
          <br/>
          {data?.professor}
        </Stack>
      </>
    </Appointments.Appointment>
  )
}


export default function Agenda() {
  const [schedulerData, setSchedulerData] = useState([
    {id: 1, startDate: '2022-12-15T09:45', endDate: '2022-12-15T11:00', title: 'Meeting'},
    {id: 2, startDate: '2022-12-15T12:00', endDate: '2022-12-15T13:30', title: 'Go to a gym'},
  ])
  
  const [visible, setVisible] = useState(false)
  
  const [appointmentState, setAppointmentState] = useState({
    appointmentMeta: {
      target: null,
      data: {}
    }
  })
  
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const onAppointmentMetaChange = ({data, target}) => {
    setAppointmentState({...appointmentState, appointmentMeta: {data, target}})
  }
  
  const MyAppointment = (props) => (
    <Appointment {...props} toggleVisibility={toggleVisibility} onAppointmentMetaChange={onAppointmentMetaChange}/>
  )
  
  const commitChanges = ({added, changed, deleted}) => {
    let data = schedulerData
    
    if (added) {
      const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
      data = [...data, {id: startingAddedId, ...added}];
    }
    if (changed) {
      data = data.map(appointment => (
        changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment));
    }
    if (deleted !== undefined) {
      data = data.filter(appointment => appointment.id !== deleted);
    }
    setSchedulerData(data);
  }

  return (
    <>
      <Helmet>
        <title> Sylva GYM | Agenda </title>
      </Helmet>
      
      <Container>
        <Typography variant="h4" sx={{mb: 5}}>
          Agenda
        </Typography>
        <Paper>
          <Scheduler
            data={schedulerData}
            locale="pt-BR"
          >
            <ViewState/>
            <EditingState
              onCommitChanges={commitChanges}
            />
            <WeekView startDayHour={5}
                      endDayHour={23}/>
            
            <Toolbar/>
            <DateNavigator/>
            <TodayButton messages={{today: "Voltar para Hoje"}}/>
            
            <EditRecurrenceMenu/>
            <IntegratedEditing/>
            <ConfirmationDialog/>
            <Appointments appointmentComponent={MyAppointment}/>
            <AppointmentTooltip
              showCloseButton
              showOpenButton
              showDeleteButton
              visible={visible}
              onVisibilityChange={toggleVisibility}
              appointmentMeta={appointmentState.appointmentMeta}
              onAppointmentMetaChange={onAppointmentMetaChange}
            />
            <AppointmentForm
              booleanEditorComponent={() => null}
              labelComponent={LabelComponent}
              textEditorComponent={InputComponent}
              basicLayoutComponent={BasicLayout}
            />
            
            <DragDropProvider/>
          </Scheduler>
        </Paper>
      </Container>
    </>
  );
}
