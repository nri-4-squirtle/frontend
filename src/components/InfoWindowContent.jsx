import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  makeStyles,
} from '@mui/material'

import './windowContent.css'

const InfoWindowContent = ({ place, parkInfo }) => {
  const reputationInfo =
    parkInfo.reputations == null
      ? ''
      : parkInfo.reputations.map((item) => item.text + '<br/>')
  parkInfo.reputations = ['駐車場が狭くて入りずらかったです', '3台止められます']
  // return (
  //   <Card>
  //     <CardMedia
  //       component="img"
  //       alt={place.name}
  //       height="140"
  //       image={place.photos[0].getUrl()}
  //     />
  //     <CardContent>
  //       <Typography variant="h5" component="div">
  //         {place.name}
  //       </Typography>
  //       <Typography variant="subtitle1" color="textSecondary">
  //         評価：{place.rating == undefined ? '情報無し' : `${place.rating}/5`}
  //       </Typography>
  //       <Typography variant="subtitle1" color="textSecondary">
  //         駐車可能台数 :{' '}
  //         {parkInfo.carNum == null
  //           ? '情報無し'
  //           : parkInfo.carNum + '台' + (parkInfo.carNum === '10' ? '以上' : '')}
  //       </Typography>
  //       <Button variant="contained" color="red">
  //         口コミ投稿
  //       </Button>
  //       <Typography variant="h6" mt={2}>
  //         上位の口コミ
  //       </Typography>
  //       <div
  //         style={{
  //           color: 'black',
  //           width: '250px',
  //           height: '80px',
  //           border: '1px solid #000',
  //           overflowY: 'scroll',
  //         }}
  //       >
  //         {parkInfo.reputations == null ? '' : reputationInfo.join('')}
  //       </div>
  //     </CardContent>
  //   </Card>
  // )

  return (
    <div className="store-info">
      {place.photos && place.photos.length > 0 && (
        <p>
          <img
            style={{ maxWidth: '17rem' }}
            src={place.photos[0].getUrl()}
            alt={place.name}
          />
        </p>
      )}

      <h3 className="store-name">{place.name}</h3>

      <p className="store-parknum">
        駐車可能台数 :{' '}
        {parkInfo.carNum == null
          ? '情報無し'
          : parkInfo.carNum + '台' + (parkInfo.carNum === '10' ? '以上' : '')}
      </p>

      <p className="store-review">
        評価：{place.rating == undefined ? '情報無し' : `${place.rating}/5`}
      </p>

      <div id="top-reviews">
        <h2 class="review-title">最新の口コミ</h2>
        {parkInfo.reputations.map((element) => {
          return (
            <div class="review">
              <p class="review-text">{element}</p>
            </div>
          )
        })}
      </div>

      <button id="button" className="display-post-button" type="submit">
        駐車場の口コミを投稿
      </button>
    </div>
  )
}

export default InfoWindowContent
