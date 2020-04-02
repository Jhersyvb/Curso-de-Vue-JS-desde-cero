<template>
  <div class="container">
    <h1>{{ articulo.title }}</h1>
    <p class="small">{{ articulo.nombreAutor }}</p>
    <hr />
    <p>{{ articulo.body }}</p>
    <nuxt-link to="/blog" class="btn btn-primary">Atrás</nuxt-link>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) {
    try {
      const resArticulo = await axios.get(
        `http://jsonplaceholder.typicode.com/posts/${params.id}`
      )
      const articulo = resArticulo.data

      const resAutor = await axios.get(
        `http://jsonplaceholder.typicode.com/users/${articulo.userId}`
      )
      articulo.nombreAutor = resAutor.data.name

      return {articulo}
    } catch (error) {
      console.log(error)
      return { error: error }
    }
  }
}
</script>
