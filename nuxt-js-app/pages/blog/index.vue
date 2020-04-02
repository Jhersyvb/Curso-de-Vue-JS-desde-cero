<template>
  <div class="container">
    <h1 class="text-center">Artículos</h1>
    <div class="row">
      <div
        v-for="articulo in articulos"
        :key="articulo.id"
        class="col-md-4 my-2"
      >
        <div class="card">
          <div class="card-body">
            <div class="card-text">
              <h2>
                <nuxt-link :to="`/blog/${articulo.id}`">
                  {{ articulo.titulo }}
                </nuxt-link>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      articulos: [
        { id: 1, titulo: 'Título #1' },
        { id: 2, titulo: 'Título #2' },
        { id: 3, titulo: 'Título #3' },
        { id: 4, titulo: 'Título #4' }
      ]
    }
  }
}
</script>
