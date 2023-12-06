<script setup>
import { ref } from 'vue'
import { useTimeoutPoll } from '@vueuse/core'

const vote = ref(0);

const fetchVote = () => {
    fetch('http://localhost:3000/votes').then(data => data.text()).then(votes => {
        console.log(votes)
        vote.value = votes
    });
}

const { resume } = useTimeoutPoll(fetchVote, 1000);
resume();
</script>
<template>
    <h2>{{ vote }}</h2>
    <div>
        <picture>
            <img src="http://localhost:3000/qrcode/up.svg" />
            <caption>Up vote</caption>
        </picture>
        <picture>
            <img src="http://localhost:3000/qrcode/down.svg" />
            <caption>
                Down vote
            </caption>
        </picture>
    </div>
</template>

<style scoped lang="scss">
div {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-around;

    picture {
        width: 25%;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        caption {
            display: block;
            text-align: center;
        }
    }
}
</style>