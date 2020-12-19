<template>
    <div>
        <p v-if="data.isLoading">Loading...</p>
        <div v-else-if="data.home">
            {{ data.home }}
            <div ref="map" style="width: 400px; height: 400px;" />
        </div>
        <p v-else>
            {{ data.error }}
        </p>
    </div>
</template>

<script>
import { ref, reactive, readonly, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import { getHome } from './api';
import useShowMap from './maps';

function useHomeData(map, showMap) {
    const isLoading = ref(true);
    const home = ref();
    const error = ref();

    onMounted(async () => {
        const route = useRoute();
        const homeResponse = await getHome(route.params.homeId);
        isLoading.value = false;
        const { ok, data, statusText } = homeResponse;
        if (ok) {
            home.value = data;
            const { lat, lng } = data._geoloc;
            nextTick(() => showMap(map.value, lat, lng));
        } else {
            error.value = statusText;
        }
    });

    return readonly(reactive({
        isLoading,
        home,
        error,
    }));
}

export default {
    setup(props, ctx) {
        const map = ref(null)
        const showMap = useShowMap();
        const data = useHomeData(map, showMap);

        return {
            map,
            data,
        };
    },
};
</script>