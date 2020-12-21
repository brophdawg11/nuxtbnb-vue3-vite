import { useStore } from './store';

export default function useShowMap() {
    const { state, dispatch } = useStore();

    function renderMap(el, lat, lng) {
        const { maps } = window.google;
        const mapOptions = {
            zoom: 18,
            center: new maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControls: true,
        };
        const map = new maps.Map(el, mapOptions);
        const position = new maps.LatLng(lat, lng);
        const marker = new maps.Marker({ position });
        marker.setMap(map);
    }

    function initMap() {
        dispatch('setMapsLoaded');
        if (state.maps.waiting) {
            const { el, lat, lng } = state.maps.waiting;
            renderMap(el, lat, lng);
            dispatch('setMapsWaiting', null);
        }
    }

    function addScript() {
        const scriptId = 'google-map';
        if (document.getElementById(scriptId)) {
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDSa2UMyIWLF5VlmG7w2lmq3UtxCj5Ic8A&libraries=places&callback=initMap';
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    }

    function showMap(el, lat, lng) {
        addScript();
        if (state.maps.loaded) {
            renderMap(el, lat, lng);
        } else {
            dispatch('setMapsWaiting', { el, lat, lng });
        }
    }

    return showMap;
}
