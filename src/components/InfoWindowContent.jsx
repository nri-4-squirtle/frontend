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

  function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)

    return `${year}/${month}/${day}`
  }

  const formattedDate = formatDateToYYYYMMDD(
    parkInfo.reputations[parkInfo.reputations.length - 1].dt
  )
  console.log(parkInfo.reputations[parkInfo.reputations.length - 1].dt)
  console.log(formattedDate)
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
        <h2 className="review-title">最新の口コミ</h2>
        {parkInfo.reputations
          .filter((element) => element.text)
          .slice(-3)
          .map((element) => {
            return (
              <div className="review">
                <p className="review-text">{element.text}</p>
                <p className="review-date">
                  {formatDateToYYYYMMDD(element.dt)}
                </p>
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
