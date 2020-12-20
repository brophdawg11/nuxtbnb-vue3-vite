<template>
    <div>
        <p v-if="data.isLoading">Loading...</p>
        <div v-else-if="data.home">
            <div style="display: flex;">
                <img v-for="image in data.home.images" :key="image" :src="image" width="200" height="150" />
            </div>
            {{ data.home.title }}<br>
            ${{ data.home.pricePerNight }} / night<br>
            <img src="/images/marker.svg" width="20" height="20" />
            {{ data.home.location.street }}
            {{ data.home.location.city }}
            {{ data.home.location.state }}
            {{ data.home.location.country }}<br>
            <img src="/images/star.svg" width="20" height="20" />{{ data.home.reviewValue }}<br>
            {{ data.home.guests }} guests,
            {{ data.home.bedrooms }} rooms,
            {{ data.home.beds }} beds,
            {{ data.home.bathrooms }} baths<br>
            {{ data.home.description }}

            <div style="width:400px; height:400px;" ref="map"></div>

            <ul v-if="data.reviews">
                <li v-for="review in data.reviews" :key="review.objectID">
                    <img :src="review.reviewer.image" /><br>
                    {{ review.reviewer.name }}<br>
                    {{ formatDate(review.date) }}<br>
                    <ShortText :text="review.comment" :target="50" />
                </li>
            </ul>
            <p v-else>
                Error loading reviews
            </p>

            <div v-if="data.user">
                <img :src="data.user.image" /><br>
                {{ data.user.name }}<br>
                {{ formatDate(data.user.joined) }}<br>
                {{ data.user.reviewCount }}<br>
                {{ data.user.description }}
            </div>
            <p v-else>
                Error loading host information
            </p>

        </div>
        <p v-else>
            {{ data.error }}
        </p>
    </div>
</template>

<script>
import { ref, reactive, readonly, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';

import { getHome, getReviewsByHomeId, getUserByHomeId } from './api';
import useShowMap from './maps';

import ShortText from './ShortText.vue';

function useHomeData(map, showMap) {
    const isLoading = ref(true);
    const home = ref();
    const reviews = ref();
    const user = ref();
    const error = ref();

    onMounted(async () => {
        const route = useRoute();
        const { homeId } = route.params;
        const [homeResponse, reviewsResponse, userResponse] = await Promise.all([
            getHome(homeId),
            getReviewsByHomeId(homeId),
            getUserByHomeId(homeId),
        ]);
        isLoading.value = false;
        const { ok, data, statusText } = homeResponse;
        if (ok) {
            home.value = data;
            if (reviewsResponse.ok) {
                reviews.value = reviewsResponse.data;
            }
            if (userResponse.ok) {
                user.value = userResponse.data;
            }
            const { lat, lng } = data._geoloc;
            nextTick(() => showMap(map.value, lat, lng));
        } else {
            error.value = statusText;
        }
    });

    return readonly(reactive({
        isLoading,
        home,
        reviews,
        user,
        error,
    }));
}

export default {
    components: {
        ShortText,
    },
    setup(props, ctx) {
        const map = ref(null)
        const showMap = useShowMap();
        const data = useHomeData(map, showMap);

        return {
            map,
            data,
        };
    },
    methods: {
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
            });
        },
    }
};
</script>