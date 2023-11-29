import { useEffect, useState, useLayoutEffect } from 'react'
import ReactDOMServer from 'react-dom/server'
import { createRoot } from 'react-dom/client'

import './App.css'
import { getIconInfoList } from './api/parkingAreaApi'

import React, { useCallback, useRef } from 'react'
import { GoogleMap, useLoadScript } from '@react-google-maps/api'

import InfoWindowContent from './components/InfoWindowContent'
import ReviewFormComponent from './components/ReviewFormComponent'
import Header from './components/Header'
import SwitchButton from './components/SwitchButton'
import CurrentFocusButton from './components/CurrentFocusButton'
import ReloadButton from './components/ReloadButton'

import Modal from 'react-modal'
import ModalComponent from './components/ModalComponent'

// TODO : Performance warning
const libraries = ['places']
const mapContainerStyle = {
  height: '90vh',
  width: '100%',
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
  const [detailVisible, setDetailVisible] = useState(false)
  const [curentClickedPlace, setCurentClickedPlace] = useState('')

  const handleDetailVisible = () => {
    setDetailVisible(false)
  }

  const mapRef = useRef()
  const onMapLoad = useCallback((map) => {
    mapRef.current = map
  }, [])
  //API読み込み後に再レンダーを引き起こさないため、useStateを使わず、useRefとuseCallbackを使っています。

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBU7KmTSPlbxoqjDzbV05MmZsohzeLPMBM',
    // ここにAPIキーを入力します。今回は.envに保存しています。
    libraries,
  })

  // 口コミなしのマーカーの表示を切り替える
  function switchShowMarker(showAllRest) {
    markerList.forEach((marker) => {
      marker.setVisible(
        showAllRest
          ? parkInfoGlobal[marker.getTitle()].carNum != '0' &&
              parkInfoGlobal[marker.getTitle()].carNum != null
          : true
      )
    })
  }

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

      // 画面表示の編集（不要なGoogleMapのボタンを非表示、ボタンの追加
      Map.setOptions({ mapTypeControl: false })
      Map.setOptions({ fullscreenControl: false })
      Map.setOptions({ streetViewControl: false })
      Map.setOptions({ zoomControl: false })

      // Create SwitchButton and CurrentFocusButton
      const switchButtonDiv = document.createElement('div')
      const switchRoot = createRoot(switchButtonDiv)
      switchRoot.render(
        <SwitchButton
          switchShowMarker={switchShowMarker}
          showAllRest={showAllRest}
          changeShowState={(isState) => setShowAllRest(isState)}
        />
      )
      Map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
        switchButtonDiv
      ) //現在地を示すマーカーを作成する

      // Create SwitchButton and CurrentFocusButton
      const reloadButtonDiv = document.createElement('div')
      const reloadRoot = createRoot(reloadButtonDiv)
      reloadRoot.render(
        <ReloadButton
          setLatLng={setLatLng}
          getNearFood={getNearFood}
          latitude={latitude}
          longitude={longitude}
        />
      )

      Map.controls[google.maps.ControlPosition.TOP_CENTER].push(reloadButtonDiv) //現在地を示すマーカーを作成する

      const currentFocusButtonDiv = document.createElement('div')
      const currentFocusRoot = createRoot(currentFocusButtonDiv)
      currentFocusRoot.render(<CurrentFocusButton setLatLng={setLatLng} />)
      Map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
        currentFocusButtonDiv
      ) //現在地を示すマーカーを作成する
    } catch (error) {
      alert('検索処理でエラーが発生しました！')
      throw error
    }
  }

  /**
   * @description 検索結果をマーカーを新規作成する処理に渡すcallback関数
   * @Input res 検索結果 status 検索結果のステータス
   * @param {google.maps.places.PlaceResult[]} res
   * @param {google.maps.places.PlacesServiceStatus} status
   * @Output なし
   * */
  async function cb(res, status) {
    // 検索結果が正常に取得できなかった場合はエラーを投げる
    if (status != 'OK' && status != 'ZERO_RESULTS') {
      throw new Error(`status not OK ${status}`)
    }
    // 検索結果が0件の場合はダイアログを表示して終了
    if (status == 'ZERO_RESULTS') {
      return
    }

    // 検索結果が1件以上の場合はマーカーを作成する
    const placeIdList = res.map((place) => place.place_id)
    const parkInfo = await getIconInfoList(placeIdList)
    resGlobal = await res
    parkInfoGlobal = await parkInfo
    res.forEach((place) => {
      createMarker(place, parkInfo[place.place_id], true)
    })
    return
  }
  /**
   * @description マーカーを作成する
   * @Input place 検索結果 parkInfo 駐車場情報 visible 表示するかどうか
   * @param {google.maps.places.PlaceResult} place
   * @param {Object} parkInfo
   * @param {boolean} visible
   * @Output なし
   * */

  function createMarker(place, parkInfo, visible) {
    //　場所のジオメトリ情報および位置情報がない場合は処理を終了する
    if (!place.geometry || !place.geometry.location) {
      return
    }

    // お店情報マーカー
    const marker = new google.maps.Marker({
      map: Map,
      position: place.geometry.location,
      title: place.place_id,
      optimized: false,
      visible: parkInfo.carNum != '0' && parkInfo.carNum != null,
      label: {
        className: 'markerLabel',
        text:
          place.name.length > 8 ? place.name.slice(0, 8) + '...' : place.name,
      },
      icon: {
        url: `https://maps.google.com/mapfiles/kml/paddle/${
          parkInfo.carNum == null
            ? 'wht-blank.png'
            : parkInfo.carNum == '0'
              ? 'blu-blank.png'
              : parseInt(parkInfo.carNum) >= 10
                ? '10.png'
                : parseInt(parkInfo.carNum) > 0
                  ? parkInfo.carNum + '.png'
                  : 'blu-blank.png'
        }`,
        scaledSize: new google.maps.Size(60, 60), //マーカーのサイズを縮小
      },
    })

    infoWindows = new google.maps.InfoWindow({
      maxWidth: 300,
    })

    let content
    google.maps.event.addListener(marker, 'click', () => {
      setCurentClickedPlace(marker.title)
      if (infoWindows == undefined || infoWindows == null) return
      infoWindows.close()
      content = ReactDOMServer.renderToString(
        <InfoWindowContent place={place} parkInfo={parkInfo} />
      )

      infoWindows.setContent(content)
      infoWindows.open(Map, marker)
    })

    infoWindows.addListener('domready', () => {
      document.getElementById('button').addEventListener('click', (e) => {
        setDetailVisible(true)
      })
    })
    infoWindows.addListener('closeclick', () => {
      infoWindows.close()
      content = ReactDOMServer.renderToString(
        <InfoWindowContent place={place} parkInfo={parkInfo} />
      )

      infoWindows.setContent(content)
    })

    google.maps.event.addListener(Map, 'click', function () {
      infoWindows.close()
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
      <div
        style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <div
          className="header"
          style={{ flex: '0 0 65px', overflow: 'hidden' }}
        >
          <Header />
        </div>
        <div className="googleMap" style={{ flex: '1', overflow: 'auto' }}>
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
        <ModalComponent
          isOpen={detailVisible}
          curentClickedPlace={curentClickedPlace}
          onClose={() => handleDetailVisible()}
        />
      </div>
    </>
  )
}

export default App
