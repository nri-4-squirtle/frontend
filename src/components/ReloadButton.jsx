import Fab from '@mui/material/Fab'
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft'
import Button from '@mui/material/Button'
// ...
const ReloadButton = (props) => {
  const setLatLng = props.setLatLng
  const getNearFood = props.getNearFood
  const latitude = props.latitude
  const longitude = props.longitude

  return (
    <Button
      variant="contained"
      sx={{
        marginLeft: '10px',
        bgcolor: 'orange',
        '&:hover': { bgcolor: 'orange' },
      }}
      onClick={() => {
        setLatLng()
        getNearFood(latitude, longitude)
      }}
    >
      検索
    </Button>
  )
}

export default ReloadButton
