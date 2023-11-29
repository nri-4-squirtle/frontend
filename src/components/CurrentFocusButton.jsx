import Fab from '@mui/material/Fab'
import NavigationIcon from '@mui/icons-material/Navigation';


// ...
const CurrentFocusButton = (props) => {
  return (
    <Fab  aria-label="Focus" 
          sx={{marginRight:"10px", 
               bgcolor:'orange', 
               "&:hover": {bgcolor: "orange",}}} 
          onClick={() => {
            props.updateCurrentPosition()
          }}>
        <NavigationIcon sx={{bgcolor:'orange'}}/>
    </Fab>
  )
}

export default CurrentFocusButton