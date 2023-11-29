import Fab from '@mui/material/Fab'
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';


// ...
const SwitchButton = (props) => {
   const setShowAllRest = props.setShowAllRest;
   const showAllRest = props.showAllRest;

  return (
    <Fab  aria-label="switch" 
          sx={{marginLeft:"10px", bgcolor:'orange', "&:hover": {bgcolor: "orange",}}} 
          onClick={() => {
            setShowAllRest((showAllRest) =>!showAllRest);
          }}>
        <SwitchLeftIcon sx={{bgcolor:'orange'}} />
    </Fab>
  )
}

export default SwitchButton