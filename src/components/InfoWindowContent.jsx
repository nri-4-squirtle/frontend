import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  makeStyles,
} from '@mui/material'

// const useStyles = makeStyles((theme) => ({
//   card: {
//     maxWidth: 400,
//     margin: 'auto',
//     marginTop: theme.spacing(4),
//   },
//   media: {
//     height: 200,
//   },
//   button: {
//     marginTop: theme.spacing(2),
//   },
//   reviewContainer: {
//     marginTop: theme.spacing(2),
//   },
// }))

const InfoWindowContent = ({ place, parkInfo }) => {
  const reputationInfo =
    parkInfo.reputations == null
      ? ''
      : parkInfo.reputations.map((item) => item.text + '<br/>')

  return (
    <Card>
      <CardMedia
        component="img"
        alt={place.name}
        height="140"
        image={place.photos[0].getUrl()}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          {place.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          評価：{place.rating == undefined ? '情報無し' : `${place.rating}/5`}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          駐車可能台数 :{' '}
          {parkInfo.carNum == null
            ? '情報無し'
            : parkInfo.carNum + '台' + (parkInfo.carNum === '10' ? '以上' : '')}
        </Typography>
        <Button variant="contained" color="red">
          口コミ投稿
        </Button>
        <Typography variant="h6" mt={2}>
          上位の口コミ
        </Typography>
        <div
          style={{
            color: 'black',
            width: '250px',
            height: '80px',
            border: '1px solid #000',
            overflowY: 'scroll',
          }}
        >
          {parkInfo.reputations == null ? '' : reputationInfo.join('')}
        </div>
      </CardContent>
    </Card>
  )

  // return (
  //   <div>
  //     {place.photos && place.photos.length > 0 && (
  //       <p>
  //         <img
  //           style={{ maxWidth: '300px' }}
  //           src={place.photos[0].getUrl()}
  //           alt={place.name}
  //         />
  //       </p>
  //     )}

  //     <p style={{ color: 'black' }}>{place.name}</p>

  //     <p style={{ color: 'black' }}>
  //       評価：{place.rating == undefined ? '情報無し' : `${place.rating}/5`}
  //     </p>

  //     <p style={{ color: 'black' }}>
  // 駐車可能台数 :{' '}
  // {parkInfo.carNum == null
  //   ? '情報無し'
  //   : parkInfo.carNum + '台' + (parkInfo.carNum === '10' ? '以上' : '')}
  //     </p>
  //     <button
  //       id="button"
  //       type="submit"
  //       style={{ color: 'black', cursor: 'pointer' }}
  //     >
  //       駐車場の口コミを投稿する
  //     </button>

  // <div
  //   style={{
  //     color: 'black',
  //     width: '250px',
  //     height: '80px',
  //     border: '1px solid #000',
  //     overflowY: 'scroll',
  //   }}
  // >
  //   {parkInfo.reputations == null ? '' : reputationInfo.join('')}
  // </div>

  //     <input id="submit" type="button" value="口コミ投稿" />
  //   </div>
  // )
}

export default InfoWindowContent
