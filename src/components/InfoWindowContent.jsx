import React, { useState } from 'react'
import ReviewFormComponent from './ReviewFormComponent'

const InfoWindowContent = ({ place, parkInfo, submitReputation }) => {
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleReviewClick = () => {
    console.log(true)
    setShowReviewForm(true)
  }
  const reputationInfo =
    parkInfo.reputations == null
      ? ''
      : parkInfo.reputations.map((item) => item.text + '<br/>')

  return (
    <div>
      {place.photos && place.photos.length > 0 && (
        <p>
          <img
            style={{ maxWidth: '300px' }}
            src={place.photos[0].getUrl()}
            alt={place.name}
          />
        </p>
      )}

      <p style={{ color: 'black' }}>{place.name}</p>

      <p style={{ color: 'black' }}>
        評価：{place.rating == undefined ? '情報無し' : `${place.rating}/5`}
      </p>

      <p style={{ color: 'black' }}>
        駐車可能台数 :{' '}
        {parkInfo.carNum == null
          ? '情報無し'
          : parkInfo.carNum + '台' + (parkInfo.carNum === '10' ? '以上' : '')}
      </p>
      <button
        style={{ color: 'black', cursor: 'pointer' }}
        onClick={handleReviewClick}
      >
        駐車場の口コミを投稿する
      </button>
      {/* 
      ボタンが押下されたら駐車場口コミ登録画面に遷移するようにする
      {showReviewForm && <div>{<ReviewFormComponent />}</div>} */}

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

      <input
        id="submit"
        type="button"
        value="口コミ投稿"
        // onClick={submitReputation}
      />
    </div>
  )
}

export default InfoWindowContent
