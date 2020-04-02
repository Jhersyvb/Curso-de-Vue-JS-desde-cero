<template>
  <div class="container">
    <h1>{{ articulo.title }}</h1>
    <p class="small">{{ articulo.userId }}</p>
    <hr />
    <p>{{ articulo.body }}</p>
    <nuxt-link to="/blog" class="btn btn-primary">Atrás</nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      articulo: {}
    }
  },

  async created() {
    try {
      const res = await axios.get(
        `http://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
      )
      this.articulo = res.data
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
