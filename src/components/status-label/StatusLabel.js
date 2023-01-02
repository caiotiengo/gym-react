import PropTypes from "prop-types";
import Label from "../label";

const StatusLabel = (props) => {
  const {status = 'default', onClick, ...rest} = props
  const statusLookup = {
    'default': {
      color: 'warning',
      text: 'Novo aluno'
    },
    'pago': {
      color: 'success',
      text: 'Em dia'
    },
    'atraso': {
      color: 'error',
      text: 'Pendente'
    }
  }
  
  return (
    <Label {...rest} onClick={onClick} color={statusLookup[status || 'default'].color}>{statusLookup[status || 'default'].text}</Label>
  )
}

StatusLabel.propTypes = {
  status: PropTypes.string,
  onClick: PropTypes.func
}

export default StatusLabel