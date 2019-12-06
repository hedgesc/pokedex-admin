<template>
    <div>
        <b-dropdown id="dropdown-buttons" text="Generations" class="m-2">
            <b-dropdown-item-button 
                v-for="gen in generations" 
                v-bind:key="gen" 
                v-bind:class="{ active: filters.gen == gen }" 
                @click="filters.gen = gen">
                Generation {{ gen }}
            </b-dropdown-item-button>
        </b-dropdown>
    </div>
</template>

<script>
export default {
    name: 'GenerationFilter',
    data () {
        return {
            generations: [1, 2, 3, 4, 5, 6, 7],
            filters: { gen: 1 }
        }
    },
    methods: {
    
    }
}
</script>