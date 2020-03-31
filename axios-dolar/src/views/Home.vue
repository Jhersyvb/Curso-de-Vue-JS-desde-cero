<template>
  <v-layout wrap>
    <v-flex xs12>
      <v-card>
        <v-date-picker v-model="fecha" full-width></v-date-picker>
      </v-card>
      <v-card color="error" dark>
        <v-card-text class="display-1 text-center">
          650 - {{ fecha }}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Home',

  data() {
    return {
      fecha: ''
    }
  }
}
</script>
