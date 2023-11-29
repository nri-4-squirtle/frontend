import Fab from '@mui/material/Fab'
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft'

// ...
const SwitchButton = (props) => {
  const changeShowState = props.changeShowState
  const showAllRest = props.showAllRest
  const switchShowMarker = props.switchShowMarker

  return (
    <Fab
      aria-label="switch"
      sx={{
        marginLeft: '10px',
        bgcolor: 'orange',
        '&:hover': { bgcolor: 'orange' },
      }}
      onClick={() => {}}
    >
      <SwitchLeftIcon sx={{ bgcolor: 'orange' }} />
    </Fab>
  )
}

export default SwitchButton
