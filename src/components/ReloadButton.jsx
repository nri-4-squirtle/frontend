import Fab from '@mui/material/Fab'
import SearchIcon from '@mui/icons-material/Search';

// ...
const ReloadButton = (props) => {
  const setLatLng = props.setLatLng
  const getNearFood = props.getNearFood
  const latitude = props.latitude
  const longitude = props.longitude

  return (
    <Fab aria-label="Reload" 
         variant="extended"
         sx={{bgcolor:'orange', "&:hover": {bgcolor: "orange",}}}
         onClick={() => {
          //setLatLng()
          //getNearFood(latitude, longitude)
        }}>
      <SearchIcon sx={{ mr: 1 }} />
      現在地で再検索
    </Fab>
  )

}

export default ReloadButton