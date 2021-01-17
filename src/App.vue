<template>
    <nav>
        <router-link to="/">
            Home
        </router-link>
        <input ref="search" @selected="onSelected">
    </nav>
    <router-view />
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import useGoogleMaps from './maps';

export default {
    name: 'App',
    setup() {
        const router = useRouter();
        const search = ref();
        const { initAutoComplete } = useGoogleMaps();

        onMounted(() => {
            initAutoComplete(search.value);
        });

        router.afterEach(() => {
            search.value.value = null;
        });

        return {
            search,
        };
    },
    methods: {
        onSelected(e) {
            const { place } = e.detail;
            if (!place || !place.geometry) {
                return;
            }
            const { location } = place.geometry;
            this.$router.push({
                path: '/search',
                query: {
                    lat: location.lat(),
                    lng: location.lng(),
                    label: this.$refs.search.value,
                },
            });
        },
    },
};
</script>
