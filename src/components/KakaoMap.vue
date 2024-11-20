<!-- src/components/KakaoMap.vue -->
<template>
    <div id="map" style="width:100%;height:400px;" class="rounded-lg shadow-sm"></div>
  </template>
  
  <script>
  import { onMounted, onUnmounted } from 'vue';
  
  export default {
    name: 'KakaoMap',
    props: {
      latitude: {
        type: Number,
        default: 33.450701
      },
      longitude: {
        type: Number,
        default: 126.570667
      }
    },
    setup(props) {
      let map = null;
  
      const initMap = () => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(props.latitude, props.longitude),
          level: 3
        };
        map = new window.kakao.maps.Map(container, options);
      };
  
      onMounted(() => {
        if (window.kakao && window.kakao.maps) {
          initMap();
        } else {
          const script = document.createElement('script');
          script.onload = () => {
            window.kakao.maps.load(initMap);
          };
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=2bd4f83bc7309d38194a5a7f96c884e0&autoload=false`;
          document.head.appendChild(script);
        }
      });
  
      onUnmounted(() => {
        if (map) {
          map = null;
        }
      });
  
      return { map };
    }
  };
  </script>