import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { grey } from '@mui/material/colors'

const ModalComponent = ({ isOpen, onClose }) => {
  //   const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [parkingCount, setParkingCount] = useState('')
  const [parkingReview, setParkingReview] = useState('')

  useEffect(() => {
    setOpen(isOpen) // プロパに渡されたisOpenの状態によってモーダルの表示状態を設定する
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose() // モーダルを閉じるためのコールバックを実行
  }

  const handleSubmit = () => {
    // フォームのデータを送信するための処理を実装する
    // 例えば、サーバーにデータを送信する、他の処理を実行するなど
    console.log('Parking Count:', parkingCount)
    console.log('Parking Review:', parkingReview)

    // モーダルを閉じる
    setOpen(false)
    onClose()
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <div>
          <DialogTitle>駐車場口コミ登録</DialogTitle>
          <DialogContent>
            <TextField
              label="駐車場は何台分ありますか？"
              variant="outlined"
              value={parkingCount}
              onChange={(e) => setParkingCount(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="駐車場はどうでしたか？"
              variant="outlined"
              value={parkingReview}
              onChange={(e) => setParkingReview(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} style={{ color: grey[500] }}>
              キャンセル
            </Button>
            <Button onClick={handleSubmit} color="primary">
              登録
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}

export default ModalComponent
