<template>
    <span>
        {{ displayText }}
        <button v-if="showButton" @click="isExpanded = !isExpanded">
            {{ isExpanded ? 'Show Less' : 'Show More' }}
        </button>
    </span>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
        target: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            isExpanded: false,
        };
    },
    computed: {
        isTooLong() {
            return this.text.length > this.target;
        },
        showButton() {
            const { isExpanded, isTooLong, displayText, text } = this;
            return isTooLong && (isExpanded || text.length > displayText.length);
        },
        displayText() {
            if (!this.isTooLong || this.isExpanded) {
                return this.text;
            }

            const idx = this.text.indexOf(' ', this.target);
            if (idx < 0 || idx >= this.text.length) {
                return this.text;
            } else {
                return `${this.text.substr(0, idx)}...`;
            }
        },
    },
};
</script>

<style scoped>
button {
    color: blue;
    background-color: inherit;
    border: none;
    text-decoration: underline;
    cursor: pointer;
}

button:focus {
    border: none;
    outline: none;
}
</style>