import { inject } from 'vue';
import { storeSymbol } from './store';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapsStore = {
    state: () => ({
        loaded: false,
        waiting: null,
    }),
    actions: {
        setLoaded({ state }) {
            // eslint-disable-next-line no-param-reassign
            state.loaded = true;
        },
        setWaiting({ state }, payload) {
            // eslint-disable-next-line no-param-reassign
            state.waiting = payload;
        },
    },
};

export default function useShowMap() {
    const store = inject(storeSymbol);
    const { state, dispatch } = store.modules.maps || store.registerModule('maps', mapsStore);

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
        dispatch('setLoaded');
        if (state.waiting) {
            const { el, lat, lng } = state.waiting;
            renderMap(el, lat, lng);
            dispatch('setWaiting', null);
        }
    }

    function addScript() {
        const scriptId = 'google-map';
        if (document.getElementById(scriptId)) {
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    }

    function showMap(el, lat, lng) {
        addScript();
        if (state.loaded) {
            renderMap(el, lat, lng);
        } else {
            dispatch('setWaiting', { el, lat, lng });
        }
    }

    return showMap;
}
