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
import useProfessors from "../hooks/professors/useProfessors";
import useAgenda from "../hooks/agenda/useAgenda";

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
          inputValue={props.value}
          onChange={(e) => onValueChangeHandler(e.target.innerText)}
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
  const onCustomFieldChange = async (nextValue) => {
    const professorSuggestion = await suggestion(nextValue)
    setProfessorsSuggestion(professorSuggestion)
    onFieldChange({professor: nextValue});
  };
  const { suggestion } = useProfessors()
  
  const [professorSuggestion, setProfessorsSuggestion] = useState([])
  
  useEffect(() => {
    const getSuggestion = async () => {
      const professorSuggestion = await suggestion(restProps.value)
      setProfessorsSuggestion(professorSuggestion)
    }
    getSuggestion()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
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
        options={professorSuggestion}
        sx={{width: 300}}
        inputValue={appointmentData.professor}
        onChange={(e) => onCustomFieldChange(e.target.innerText)}
        renderInput={(params) => <AppointmentForm.TextEditor
          {...params}
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
        console.log(target.parentElement.parentElement)
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

const Content = (({
                    appointmentData, ...restProps
                  }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Stack px={3}>
      Professor: {appointmentData.professor}
    </Stack>
  </AppointmentTooltip.Content>
));

export default function Agenda() {
  const {agenda, addNewAppointment, editAppointment, removeAppointment} = useAgenda()
  
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
    if (added) {
      addNewAppointment(added)
    }
    if (changed) {
      const [updatedAppointment] = agenda.map(appointment => (
        changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment));
      editAppointment(updatedAppointment)
    }
    if (deleted !== undefined) {
      removeAppointment(deleted)
    }
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
            data={agenda}
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
              contentComponent={Content}
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
