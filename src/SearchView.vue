<template>
    <div>
        Results for {{ query }}<br>
        <div ref="map" style="flost: right; width:400px; height:400px;" />
        <p v-if="error">
            {{ error }}
        </p>
        <ul v-else-if="homes && homes.length > 0">
            <li v-for="home in homes" :key="home.objectID">
                <router-link :to="`/home/${home.objectID}`">
                    <HomeRow
                        :home="home"
                        @mouseover="highlightMarker(home.objectID, true)"
                        @mouseout="highlightMarker(home.objectID, false)" />
                </router-link>
            </li>
        </ul>
        <div v-else>
            No results found
        </div>
    </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

import { getHomesByLocation } from './api';
import useGoogleMaps from './maps';

import HomeRow from './HomeRow.vue';

export default {
    components: {
        HomeRow,
    },
    setup() {
        const route = useRoute();
        const { label } = route.query;
        const query = ref(label);
        const map = ref();
        const homes = ref();
        const error = ref();
        const { showMap } = useGoogleMaps();

        async function loadData(lat, lng) {
            const { ok, data, error: err } = await getHomesByLocation(lat, lng);
            if (ok) {
                error.value = null;
                homes.value = data;
                const markers = data.map((home) => ({
                    // eslint-disable-next-line no-underscore-dangle
                    ...home._geoloc,
                    pricePerNight: home.pricePerNight,
                    id: home.objectID,
                }));
                showMap(map.value, lat, lng, markers);
            } else {
                error.value = err;
                homes.value = null;
            }
        }

        onMounted(() => loadData(route.query.lat, route.query.lng));
        onBeforeRouteUpdate((to, from) => {
            if (to.query.label !== from.query.label) {
                query.value = to.query.label;
                loadData(to.query.lat, to.query.lng);
            }
        });

        return reactive({
            query,
            map,
            homes,
            error,
        });
    },
    methods: {
        highlightMarker(homeId, isHighlighted) {
            const el = document.getElementsByClassName(`home-${homeId}`)[0];
            el?.classList.toggle('marker-highlight', isHighlighted);
        },
    },
};
</script>

<style>
.marker {
    background: white;
    border: 1px solid lightgrey;
    border-radius: 20px;
    font-weight: bold;
    padding: 5px 8px;
}

.marker-highlight {
    color: white !important;
    background: black;
    border: 1px solid black;
}
</style>
