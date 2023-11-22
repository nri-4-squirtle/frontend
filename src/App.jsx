import { useEffect, useState, useLayoutEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getIconInfoList } from './api/parkingAreaApi'
import { MarkerWithLabel } from '@googlemaps/markerwithlabel'

// import getCurrentPosition from './api/googleMapApi'

import React, { useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api'

// TODO : Performance warning
const libraries = ['places']
const mapContainerStyle = {
  height: '100vh',
  width: '100vh',
}

let Map
let infoWindows
let resGlobal
let parkInfoGlobal
let markerList = []

function App() {
  const [latitude, setLatitude] = useState(100)
  const [longitude, setLongitude] = useState(100)
  const [showAllRest, setShowAllRest] = useState(false)
  //const [status, setStatus] = useState('')
  //const [nearRest, setNearRest] = useState({})

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

  //近くの飲食店の情報を取得する
  function getNearFood(lat, lng) {
    try {
      if (
        document.getElementById('map') == null ||
        typeof document.getElementById('map') == null
      ) {
        return
      }
      //現在地の緯度経度を設定する
      var currentPosition = new google.maps.LatLng(
        parseFloat(lat.toString()),
        parseFloat(lng.toString())
      )
      //現在地を表示するMAPを新規作成する
      Map = new google.maps.Map(document?.getElementById('map'), {
        center: currentPosition,
        zoom: 18,
      })
      //現在地を示すマーカーを作成する
      new google.maps.Marker({
        icon: {
          fillColor: '#115EC3', //塗り潰し色
          fillOpacity: 0.8, //塗り潰し透過率
          path: google.maps.SymbolPath.CIRCLE, //円を指定
          scale: 10, //円のサイズ
          strokeColor: '#FFFFFF', //枠の色
          strokeWeight: 3,
        },
        position: { lat: lat, lng: lng },
        Map,
      })

      //検索条件（近くの飲食店）を設定する
      var request = {
        location: currentPosition,
        radius: 500,
        type: 'restaurant',
      }

      //検索に必要なサービスを作成する
      var service = new google.maps.places.PlacesService(Map)
      //近くの飲食店を検索する
      service.nearbySearch(request, cb)
    } catch (error) {
      alert('検索処理でエラーが発生しました！')
      throw error
    }
  }
  function switchShowMarker(showAllRest) {
    console.log(showAllRest)
    console.log('switch')
    markerList.forEach((marker) => {
      marker.setVisible(
        showAllRest ? parkInfoGlobal[marker.getTitle()].carNum != '0' : true
      )
    })
    /*     resGlobal.forEach((place) => {
      const visible = parkInfoGlobal[place.place_id].carNum != '0'
      console.log(visible)
      createMarker(place, parkInfoGlobal[place.place_id], visible)
    }) */
  }
  //nearbySerchの検索結果をマーカーを新規作成する処理に渡すcallback関数
  async function cb(res, status) {
    if (status != 'OK' && status != 'ZERO_RESULTS') {
      throw new Error(`status not OK ${status}`)
    }
    const placeIdList = res.map((place) => place.place_id)
    console.log(placeIdList)
    const parkInfo = await getIconInfoList(placeIdList)
    resGlobal = await res
    parkInfoGlobal = await parkInfo
    res.forEach((place) => {
      createMarker(place, parkInfo[place.place_id], true)
    })
    console.log(Map)
    return
  }
  //マーカーを作成する
  function createMarker(place, parkInfo, visible) {
    if (!place.geometry || !place.geometry.location) return
    // お店情報マーカー
    const marker = new google.maps.Marker({
      map: Map,
      position: place.geometry.location,
      title: place.place_id,
      optimized: false,
      visible: parkInfo.carNum != '0',
      label: parkInfo.carNum + '台',
      labelAnchor: new google.maps.Point(38, 0), //ラベル文字の基点
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/micons/blue.png',
        scaledSize: new google.maps.Size(60, 60), //マーカーのサイズを縮小
      },
    })
    // お店情報ウィンドウ
    infoWindows = new google.maps.InfoWindow()

    // お店情報ウィンドウにて表示する情報
    const infoList = [
      `<p style = "color: black">${place.name}`,
      `<p style = "color: black">${JSON.stringify(parkInfo)}`,
      place.rating == undefined
        ? `<p style = "color: black">評価：情報なし`
        : `<p style = "color: black">評価：${place.rating}/5`,
      place.photos && place.photos.length > 0
        ? `<p><img style="max-width:200px" src="${place.photos[0].getUrl()}"/></p>`
        : null,
    ]

    const info = infoList.join('</p>') // 改行区切りで加工して見せる
    google.maps.event.addListener(marker, 'click', () => {
      if (infoWindows == undefined || infoWindows == null) return
      infoWindows.close()
      infoWindows.setContent(info)
      infoWindows.open(Map, marker)
    })
    markerList.push(marker)
  }

  //現在地の情報を取得する
  function setLatLng() {
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
      handleLocationError(false, infoWindow, map.getCenter())
    }
  }

  useLayoutEffect(() => {
    setLatLng()
  }, [])

  //近くの飲食店の情報を取得し、マーカーを立てる
  useEffect(() => {
    // TODO : ここで map id 要素が null でなくなるのを待つ.
    setTimeout(() => {
      getNearFood(latitude, longitude)
    }, 1000)
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
        ></GoogleMap>
      </div>
      <input
        type="button"
        value="Switch"
        onClick={() => {
          switchShowMarker(showAllRest)
          setShowAllRest(!showAllRest)
        }}
      />
    </>
  )
}

export default App

//memo
/*           <MarkerF
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
          /> */
