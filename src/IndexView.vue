<template>
    <div>
        <p v-if="data.isLoading">Loading...</p>
        <ul v-else-if="data.homes && data.homes.length > 0">
            <li v-for="home in data.homes" :key="home.objectID">
                <HomeCard :home="home" />
            </li>
        </ul>
        <p v-else-if="data.homes && homdataes.homes.length === 0">
            No homes found
        </p>
        <p v-else>
            {{ data.error }}
        </p>
    </div>
</template>

<script>
import { ref, reactive, readonly, onMounted } from 'vue'

import { getHomes } from './api';

import HomeCard from './HomeCard.vue';

function useData() {
    const isLoading = ref(true);
    const homes = ref();
    const error = ref();

    onMounted(async () => {
        const homesResponse = await getHomes();
        isLoading.value = false;
        const { ok, data, statusText } = homesResponse;
        if (ok) {
            homes.value = data.hits;
        } else {
            error.value = statusText;
        }
    });

    // Use readonly to prevent external modifications
    return readonly(reactive({
        isLoading,
        homes,
        error,
    }));
}

export default {
    components: {
        HomeCard,
    },
    setup() {
        const data = useData();
        return {
            data,
        };
    },
};
</script>