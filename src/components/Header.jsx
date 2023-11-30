import * as React from 'react'
import { AppBar, Container, Toolbar } from '@mui/material'
import icon from './icon.png'

// ここまで変更

const Header = () => {
  return (
    <AppBar position="fixed" color="default">
      <Container maxWidth="xl">
        {/* MUIのAppbar上に、左寄せでアイコン画像の表示させたい */}
        <Toolbar disableGutters>
          {/* ここから変更 */}
          <img
            src={icon}
            alt="icon"
            style={{ maxHeight: '50px', padding: '5px' }}
          />
          {/* ここまで変更 */}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
