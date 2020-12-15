<template>
    <div>
        <p v-if="isLoading">Loading...</p>
        <ul v-else-if="homes && homes.length > 0">
            <li v-for="home in homes" :key="home.objectID">
                <HomeCard :home="home" />
            </li>
        </ul>
        <p v-else-if="homes && homes.length === 0">
            No homes found
        </p>
        <p v-else>
            {{ error }}
        </p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import { getHomes } from './api';

import HomeCard from './HomeCard.vue';

export default {
    components: {
        HomeCard,
    },
    setup() {
        const isLoading = ref(true);
        const homes = ref();
        const error = ref();

        onMounted(async () => {
            const homesResponse = await getHomes();
            isLoading.value = false;
            const { ok, data, statusText } = homesResponse;
            if (ok) {
                homes.value = data.hits;
                console.log(homes);
            } else {
                error.value = statusText;
            }
        });

        return {
            isLoading,
            homes,
            error,
        };
    },
};
</script>