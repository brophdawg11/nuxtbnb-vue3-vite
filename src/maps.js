import { onBeforeUnmount } from 'vue';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function useGoogleMaps() {
    // Cancel any pending map renders if we unmount the requesting component
    let cancelled = false;

    onBeforeUnmount(() => {
        cancelled = true;
    });

    function addScript() {
        window.initMapPromise = new Promise((resolve, reject) => {
            const scriptId = 'google-map';
            if (document.getElementById(scriptId)) {
                window.initMapPromise.then(resolve, reject);
                return;
            }
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
            script.async = true;
            script.onerror = (e) => {
                script.parentNode.removeChild(script);
                reject(e);
            };
            window.initMap = resolve;
            document.head.appendChild(script);
        });
        return window.initMapPromise;
    }

    async function showMap(el, lat, lng, markers) {
        await addScript();
        if (cancelled) {
            return;
        }
        const { maps } = window.google;
        const mapOptions = {
            zoom: 18,
            center: new maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControls: true,
        };
        const map = new maps.Map(el, mapOptions);

        if (markers) {
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach((home) => {
                const position = new maps.LatLng(home.lat, home.lng);
                const marker = new maps.Marker({
                    position,
                    icon: 'https://maps.gstatic.com/mapfiles/transparent.png',
                    label: {
                        text: `$${home.pricePerNight}`,
                        className: `marker home-${home.id}`,
                    },
                    clickable: false,
                });
                marker.setMap(map);
                bounds.extend(position);
            });
            map.fitBounds(bounds);
        } else {
            const position = new maps.LatLng(lat, lng);
            const marker = new maps.Marker({ position });
            marker.setMap(map);
        }
    }

    async function initAutoComplete(el) {
        await addScript();
        if (cancelled) {
            return;
        }
        const { maps } = window.google;
        const autoComplete = new maps.places.Autocomplete(el, {
            types: ['(cities)'],
        });
        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            el.dispatchEvent(new CustomEvent('selected', {
                detail: { place },
            }));
        });
    }

    return { showMap, initAutoComplete };
}
