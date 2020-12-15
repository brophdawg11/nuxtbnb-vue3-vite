<template>
    <div>
        <p v-if="isLoading">Loading...</p>
        <div v-else-if="home">
            {{ home }}
        </div>
        <p v-else>
            {{ error }}
        </p>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { getHome } from './api';

export default {
    setup() {
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
            } else {
                error.value = statusText;
            }
        });

        return {
            isLoading,
            home,
            error,
        };
    },
};
</script>