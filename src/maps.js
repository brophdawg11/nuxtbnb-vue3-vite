import { reactive } from 'vue';

// TODO: won't work right for SSR?
const data = reactive({
    loaded: false,
    waiting: null,
});

export default function useShowMap() {
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
        data.loaded = true;
        if (data.waiting) {
            const { el, lat, lng } = data.waiting;
            renderMap(el, lat, lng);
            data.waiting = null;
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
        if (data.loaded) {
            renderMap(el, lat, lng);
        } else {
            data.waiting = { el, lat, lng };
        }
    }

    return showMap;
}
