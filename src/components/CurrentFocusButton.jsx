import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation';


// ...
const CurrentFocusButton = (props) => {
  return (
    <Fab  aria-label="switch" 
          sx={{marginRight:"10px", 
               bgcolor:'orange', 
               "&:hover": {bgcolor: "orange",}}} 
          onClick={() => {
            props.setLatLng()
          }}>
        <NavigationIcon sx={{bgcolor:'orange'}}/>
    </Fab>
  )
}

export default CurrentFocusButton
