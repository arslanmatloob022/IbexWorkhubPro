<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import { useThemeColors } from "/@src/composable/useThemeColors";
import { number, string } from "zod";
const themeColors = useThemeColors();

const props = defineProps({
    Statvalue: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default:''
    }
})

const optionsCircle = shallowRef({
    series: [0],
    chart: {
        height: 160,
        type: "radialBar",
        toolbar: {
            show: false,
        },
    },
    colors: [themeColors.accent],
    plotOptions: {
        radialBar: {
            hollow: {
                size: "40%",
            },
            dataLabels: {
                show: true,
                name: {
                    show: true,
                    fontSize: "16px",
                    fontWeight: 500,
                    offsetY: -10,
                    color: props.color ? props.color : [themeColors.accent],
                },
                value: {
                    show: true,
                    fontWeight: 600,
                    color: props.color ? props.color : [themeColors.accent],
                    fontSize: "16px",
                    offsetY: -10,
                },
            },
        },
    },
    labels: [""],
});

onMounted(() => {
})
</script>
<template>
    <div>
        <ApexChart id="radial-circle" class="circle-chart-wrapper" :height="optionsCircle.chart.height"
            :type="optionsCircle.chart.type" :series="[
            props.Statvalue
                ? props.Statvalue
                : 0,
        ]" :options="optionsCircle" />
    </div>
</template>

<style lang="scss" scoped>
</style>