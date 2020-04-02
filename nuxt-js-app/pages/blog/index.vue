<template>
  <div class="container">
    <h1 class="text-center">Artículos</h1>
    <div class="row">
      <div
        v-for="articulo in articulos"
        :key="articulo.id"
        class="col-md-6 my-2"
      >
        <div class="card">
          <div class="card-body">
            <div class="card-title">
              <h2>
                <nuxt-link :to="`/blog/${articulo.id}`">
                  {{ articulo.title }}
                </nuxt-link>
              </h2>
            </div>
            <div class="card-text">
              {{ articulo.body }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      articulos: []
    }
  },

  async created() {
    try {
      const res = await axios.get(
        'http://jsonplaceholder.typicode.com/posts?_limit=10'
      )
      this.articulos = res.data
    } catch (error) {
      console.log(error)
    }
  }
}
</script>
