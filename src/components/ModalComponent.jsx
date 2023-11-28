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

const ModalComponent = ({ isOpen, onClose, curentClickedPlace }) => {
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

  const handleSubmit = async () => {
    const BASE_URL =
      'https://i5hb8iyaf3.execute-api.us-east-1.amazonaws.com/dev/reputation' // エンドポイントのURL

    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        placeId: curentClickedPlace,
        carNum: parkingCount,
        text: parkingReview,
      }),
    })
    const data = await res.json()

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
