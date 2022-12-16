import PropTypes from "prop-types";
import {Box, Card, CardContent, Modal, Paper, Stack, Typography} from "@mui/material";
import useProfessor from "../../hooks/professor/useProfessor";
import Iconify from "../iconify";

const ProfessorEvaluation = (props) => {
  const {open, handleClose} = props
  const {
    professor
  } = useProfessor()
  const {
    avaliacoes,
  } = professor
  
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
  };
    
  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalStyle}>
        <Typography variant="h3">
          Avaliações
        </Typography>
        <Paper>
          {
            avaliacoes.length
              ?
              avaliacoes.map((evaluation) => (
                <Card key={evaluation.id} sx={{ display: 'flex' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                        {evaluation.alunoNome}
                      </Typography>
                      <Typography py={2}  variant="subtitle1" color="text.secondary" component="div">
                        {evaluation.qtdAlunos}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                        <Iconify icon={'eva:star-fill'} sx={{mr: 2}}/>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                          {evaluation.estrelas}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Box>
                </Card>
              ))
              :
              <Stack>
                <Typography>
                  Nenhuma avaliação disponível ainda
                </Typography>
              </Stack>
          }
        </Paper>
      </Box>
    </Modal>
  )
}

ProfessorEvaluation.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func
}

export default ProfessorEvaluation