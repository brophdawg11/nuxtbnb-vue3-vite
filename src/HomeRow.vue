<template>
    <div style="clear: left;">
        <img :src="home.images[0]" style="width: 200px; float:left; padding: 10px;"><br>
        {{ home.title }}<br>
        {{ home.location.address }}
        {{ home.location.city }}
        {{ home.location.state }}<br>
        {{ pluralize(home.guests, 'guest') }},
        {{ pluralize(home.beds, 'bed') }},
        {{ pluralize(home.bathrooms, 'bathroom') }}<br>
        {{ home.pricePerNight }} / night<br>
        <img src="/images/star.svg" width="20" height="20">
        {{ home.reviewValue }} ({{ home.reviewCount }})
    </div>
</template>

<script>
export default {
    props: {
        home: {
            type: Object,
            required: true,
        },
    },
    methods: {
        pluralize(num, word) {
            return `${num} ${word}${num > 1 ? 's' : ''}`;
        },
    },
};
</script>
