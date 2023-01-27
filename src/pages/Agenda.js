/* eslint-disable react/prop-types */
import {Helmet} from 'react-helmet-async';
// @mui
import {Autocomplete, Box, Button, Container, Modal, Stack, Typography} from '@mui/material';
// ----------------------------------------------------------------------
import Paper from '@mui/material/Paper';
import {EditingState, ViewState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
  DayView,
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
import CloseIcon from '@mui/icons-material/Close';
import useStudents from "../hooks/students/useStudents";
import useAgenda from "../hooks/agenda/useAgenda";

const LabelComponent = (props) => {
  switch (props.text) {
    case 'Details':
      return <AppointmentForm.Label
        {...props}
        text="Nome do treino"
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
  switch (props.type) {
    case 'titleTextEditor': {
      const onValueChangeHandler = async (name) => {
        props.onValueChange(name)
      }
      
      return (
        <AppointmentForm.TextEditor
          type="title"
          value={props.value}
          {...props}
          onValueChange={onValueChangeHandler}
          placeholder='Digite o nome do treino'
        />
      )
    }
    default:
      return null
  }
};

const BasicLayout = ({onFieldChange, appointmentData, ...restProps}) => {
  const {suggestion: getStudentsSuggestion} = useStudents()
  const [studentsSuggestion, setStudentsSuggestion] = useState([])
  
  const onStudentCustomFieldChange = async (nextValue) => {
    const studentsSuggestion = await getStudentsSuggestion(nextValue)
    setStudentsSuggestion(studentsSuggestion)
    onFieldChange({aluno: studentsSuggestion[0].label, idAluno: studentsSuggestion[0].id});
  };
  
  
  useEffect(() => {
    const getSuggestion = async () => {
      const studentSuggestion = await getStudentsSuggestion(restProps.value)
      setStudentsSuggestion(studentSuggestion)
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
        text="Aluno"
        type="title"
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={studentsSuggestion}
        sx={{width: 300}}
        inputValue={appointmentData.aluno}
        onChange={(e) => onStudentCustomFieldChange(e.target.innerText)}
        renderInput={(params) => <AppointmentForm.TextEditor
          {...params}
          onValueChange={onStudentCustomFieldChange}
          placeholder='Selecione um aluno'
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
        backgroundColor: theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center'
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
          <Typography fontSize='small' noWrap> {data?.aluno} </Typography>
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
        <Typography fontSize='large' noWrap> {appointmentData.aluno} </Typography>
      </Stack>
    </AppointmentTooltip.Content>
  )
);

const CellComponent = (props) => {
  const {onDoubleClick, hasLimit, ...rest} = props
  
  const handleDoubleClick = () => {
    if (hasLimit) onDoubleClick()
  }
  
  return (
    <WeekView.TimeTableCell onDoubleClick={handleDoubleClick} {...rest} />
  )
}

const LayoutComponent = (props) => {
  const {children, ...rest} = props
  
  return <AppointmentForm.Layout {...rest} style={{position: "fixed"}}>
    {children}
  </AppointmentForm.Layout>
}

const SuccessAppointmentCreated = (props) => {
  const {open, handleClose} = props
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    display: 'flex',
    justifyContent: 'space-between'
  };
  
  return (<Modal
    open={open}
    onClose={handleClose}
  >
    <Box sx={modalStyle}>
      Treino marcado com sucesso!
      <CloseIcon sx={{cursor: 'pointer'}} onClick={handleClose}/>
    </Box>
  </Modal>)
}

export default function Agenda() {
  const {agenda, addNewAppointment, editAppointment, removeAppointment} = useAgenda()
  const [visible, setVisible] = useState(false)
  const [appointmentState, setAppointmentState] = useState({
    appointmentMeta: {
      target: null,
      data: {}
    }
  })
  const [openSuccessModal, setOpenSuccessModal] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  
  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const onAppointmentMetaChange = ({data, target}) => {
    setAppointmentState({...appointmentState, appointmentMeta: {data, target}})
  }
  
  const MyAppointment = (props) => (
    <Appointment {...props} toggleVisibility={toggleVisibility} onAppointmentMetaChange={onAppointmentMetaChange}/>
  )
  
  const commitChanges = async ({added, changed, deleted}) => {
    if (added) {
      await addNewAppointment({...added, title: added.title})
      setOpenSuccessModal(true)
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
  
  const CellComponentWrapper = (props) => {
    const {startDate: cellStartDate} = props
    const currentAppointments = agenda.filter((appointment) => {
      const cellDate = new Date(cellStartDate).getTime()
      const appointmentDate = new Date(appointment.startDate).getTime()
      
      if (cellDate === appointmentDate) {
        return appointment
      }
      return null
    })
    
    const appointmentLimits = 20
    
    return <CellComponent hasLimit={currentAppointments.length < appointmentLimits} {...props}/>
  }
  
  return (
    <>
      <SuccessAppointmentCreated open={openSuccessModal} handleClose={() => setOpenSuccessModal(false)}/>
      <Helmet>
        <title> SILVA GYM | Agenda </title>
      </Helmet>
      
      <Container>
        <Stack sx={{mb: 4}} direction='row' alignItems='center' justifyContent='space-between' >
          <Typography variant="h4">
            Agenda
          </Typography>
          <Button variant='contained' onClick={() => setFormVisible(true)} >Adicionar treino</Button>
        </Stack>
        <Paper>
          <Scheduler
            data={agenda}
            locale="pt-BR"
          >
            <ViewState />
            <EditingState
              onCommitChanges={commitChanges}
            />
            <DayView
              displayName='Diário'
              startDayHour={5}
              endDayHour={23}
              timeTableCellComponent={CellComponentWrapper}
            />
            
            <Toolbar/>
            
            <DateNavigator/>
            <TodayButton messages={{today: "Voltar para Hoje"}}/>
            
            <EditRecurrenceMenu/>
            <IntegratedEditing/>
            <ConfirmationDialog
              messages={{
                discardButton: "Descartar",
                deleteButton: "Deletar",
                cancelButton: "Cancelar",
                confirmDeleteMessage: "Tem certeza de que deseja deletar essa aula?",
                confirmCancelMessage: "Descartar mudanças não salvas?"
              }}
            />
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
              visible={formVisible}
              onVisibilityChange={() => setFormVisible(!formVisible)}
              booleanEditorComponent={() => null}
              labelComponent={LabelComponent}
              textEditorComponent={InputComponent}
              basicLayoutComponent={BasicLayout}
              layoutComponent={LayoutComponent}
            />
            <DragDropProvider/>
          </Scheduler>
        </Paper>
      </Container>
    </>
  );
}
