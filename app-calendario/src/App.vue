<template>
  <v-app>
    <v-content>
      <Calendario />
    </v-content>
  </v-app>
</template>

<script>
import Calendario from './components/Calendario'

export default {
  name: 'App',

  components: {
    Calendario
  },

  data: () => ({
    //
  })
}
</script>
