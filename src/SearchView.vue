<template>
    <div>
        {{ query }}
    </div>
</template>

<script>
import { reactive, readonly } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const route = useRoute();
        const { query } = route;

        return readonly(reactive({
            query,
        }));
    },
};
</script>
