<template>
  <div>
    <h1>Galería de fotos</h1>

    <router-link
      v-for="(item, index) in fotos"
      :key="index"
      :to="{ name: 'Fotos', params: { id: item } }"
    >
      <button>Foto {{ item }}</button>
    </router-link>

    <Foto />

    <button @click="home">Home</button>
    <button @click="anterior">Anterior</button>
    <button @click="siguiente">Siguiente</button>
  </div>
</template>

<script>
  import Foto from '@/components/Fotografia.vue'

  export default {
    components: { Foto },

    data() {
      return {
        fotos: [1, 2, 3]
      }
    },

    methods: {
      home() {
        this.$router.push('/')
      },

      anterior() {
        this.$router.go(-1)
      },

      siguiente() {
        this.$router.go(1)
      }
    }
  }
</script>
