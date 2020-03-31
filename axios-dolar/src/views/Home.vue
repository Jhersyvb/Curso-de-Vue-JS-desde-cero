<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card>
        <v-date-picker
          v-model="fecha"
          full-width
          locale="es-pe"
          :min="minimo"
          :max="maximo"
        ></v-date-picker>
      </v-card>
      <v-card color="error" dark>
        <v-card-text class="display-1 text-center">
          {{ valor }} - {{ fecha }}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',

  data() {
    return {
      fecha: new Date().toISOString().substr(0, 10),
      minimo: '1984',
      maximo: new Date().toISOString().substr(0, 10),
      valor: null
    }
  },

  created() {
    this.getDolar('31-03-2020')
  },

  methods: {
    async getDolar(dia) {
      let datos = await axios.get(`https://mindicador.cl/api/dolar/${dia}`)
      console.log(datos)
      this.valor = await datos.data.serie[0].valor
    }
  }
}
</script>
