<template>
    <router-link :to="`/home/${home.objectID}`">
        <img :src="home.images[0]" style="width: 200px;"><br>
        {{ home.title }}<br>
        {{ home.location.address }}
        {{ home.location.city }}
        {{ home.location.state }}<br>
        {{ home.guests }} guests<br>
        {{ home.pricePerNight }} / night<br>
    </router-link>
</template>

<script>
export default {
    props: {
        home: {
            type: Object,
            required: true,
        },
    },
};
</script>
