import { useEffect, useState, useLayoutEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import getCurrentPosition from './api/googleMapApi'

import React, { useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'

// TODO : Performance warning
const libraries = ['places']
const mapContainerStyle = {
  height: '100vh',
  width: '100vh',
}

function getNearFood(lat, lng) {
  try {
    if (
      document.getElementById('map') == null ||
      typeof document.getElementById('map') == null
    ) {
      return
    }
    var pyrmont = new google.maps.LatLng(
      parseFloat(lat.toString()),
      parseFloat(lng.toString())
    )
    console.log('pyrmont' + pyrmont)
    const Map = new google.maps.Map(document?.getElementById('map'), {
      center: pyrmont,
      zoom: 18,
    })

    var request = {
      location: pyrmont,
      radius: 500,
      type: 'restaurant',
      keyword: '居酒屋', // 検索地点の付近を`keyword`を使って検索する
    }
    var service = new google.maps.places.PlacesService(Map)
    service.nearbySearch(request, (res) => {
      console.log(res)
    })
  } catch (error) {
    alert('検索処理でエラーが発生しました！')
    throw error
  }
}

function App() {
  const [latitude, setLatitude] = useState(100)
  const [longitude, setLongitude] = useState(100)

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])
  //API読み込み後に再レンダーを引き起こさないため、useStateを使わず、useRefとuseCallbackを使っています。

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_googleMapsApiKey,
    // ここにAPIキーを入力します。今回は.envに保存しています。
    libraries,
  })

  useLayoutEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter())
        }
      )
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter())
    }
  }, [])

  useEffect(() => {
    const func = async () => {
      // TODO : ここで map id 要素が null でなくなるのを待つ.
      setTimeout(() => {
        getNearFood(latitude, longitude)
      }, 1000)
    }

    func()
  }, [latitude])

  if (loadError) return <div>Error</div>
  if (!isLoaded) return <div>Loading</div>

  return (
    <>
      <div className="googleMap">
        <div className="transparent"></div>
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={{
            lat: latitude,
            lng: longitude,
          }}
          onLoad={onMapLoad}
        >
          <MarkerF
            icon={{
              fillColor: '#115EC3', //塗り潰し色
              fillOpacity: 0.8, //塗り潰し透過率
              path: google.maps.SymbolPath.CIRCLE, //円を指定
              scale: 10, //円のサイズ
              strokeColor: '#FFFFFF', //枠の色
              strokeWeight: 3,
            }}
            position={{
              lat: latitude,
              lng: longitude,
            }}
          />
        </GoogleMap>
      </div>
    </>
  )
}

export default App
