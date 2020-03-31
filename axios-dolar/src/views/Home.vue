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
          @change="getDolar(fecha)"
        ></v-date-picker>
      </v-card>
      <v-card color="error" dark>
        <v-card-text class="display-1 text-center">
          {{ valor }}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'

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
    this.getDolar(this.fecha)
  },

  methods: {
    ...mapMutations(['mostrarLoading', 'ocultarLoading']),

    async getDolar(dia) {
      let ddmmyyyy = dia.split('-').reverse().join('-')

      try {
        this.mostrarLoading({ titulo: 'Accediendo a información' })
        let datos = await axios.get(
          `https://mindicador.cl/api/dolar/${ddmmyyyy}`
        )

        if (datos.data.serie.length) {
          this.valor = await datos.data.serie[0].valor
        } else {
          this.valor = 'Sin resultados'
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.ocultarLoading()
      }
    }
  }
}
</script>
