<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn
            color="primary"
            class="mr-4"
            dark
            @click="mostrarFormulario = true"
            >Agregar</v-btn
          >
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-2" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 días</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          locale="es-pe"
          :short-weekdays="false"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-dialog v-model="mostrarFormulario">
          <v-card>
            <v-card-text>
              <v-form @submit.prevent="agregarEvento">
                <v-text-field
                  type="text"
                  label="Agregar nombre"
                  v-model="nuevoEvento.name"
                ></v-text-field>
                <v-text-field
                  type="text"
                  label="Agregar detalles"
                  v-model="nuevoEvento.details"
                ></v-text-field>
                <v-text-field
                  type="date"
                  label="Inicio del evento"
                  v-model="nuevoEvento.start"
                ></v-text-field>
                <v-text-field
                  type="date"
                  label="Fin del evento"
                  v-model="nuevoEvento.end"
                ></v-text-field>
                <v-text-field
                  type="color"
                  label="Color"
                  v-model="nuevoEvento.color"
                ></v-text-field>
                <v-btn
                  type="submit"
                  color="primary"
                  class="mr-4"
                  @click.stop="mostrarFormulario = false"
                  >Agregar</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon @click="eliminarEvento(selectedEvent)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <div v-if="eventoEditado !== selectedEvent.id">
                <div>{{ selectedEvent.name }}</div>
                <div>{{ selectedEvent.details }}</div>
              </div>
              <v-form v-else>
                <v-text-field
                  type="text"
                  v-model="selectedEvent.name"
                  label="Editar nombre"
                ></v-text-field>
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                ></textarea-autosize>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
              <v-btn
                text
                v-if="eventoEditado !== selectedEvent.id"
                @click.prevent="eventoEditado = selectedEvent.id"
              >
                Editar
              </v-btn>
              <v-btn
                v-else
                text
                @click.prevent="actualizarEvento(selectedEvent)"
              >
                Guardar cambios
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { db } from '../main'

export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      '4day': '4 Días'
    },
    start: null,
    end: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: [
      'blue',
      'indigo',
      'deep-purple',
      'cyan',
      'green',
      'orange',
      'grey darken-1'
    ],
    names: [
      'Meeting',
      'Holiday',
      'PTO',
      'Travel',
      'Event',
      'Birthday',
      'Conference',
      'Party'
    ],
    // Variables adicionales
    mostrarFormulario: false,
    nuevoEvento: {
      name: null,
      details: null,
      start: null,
      end: null,
      color: null
    },
    eventoEditado: null
  }),
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) {
        return ''
      }

      const startMonth = this.monthFormatter(start)
      const endMonth = this.monthFormatter(end)
      const suffixMonth = startMonth === endMonth ? '' : endMonth

      const startYear = start.year
      const endYear = end.year
      const suffixYear = startYear === endYear ? '' : endYear

      const startDay = start.day + this.nth(start.day)
      const endDay = end.day + this.nth(end.day)

      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case '4day':
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC',
        month: 'long'
      })
    }
  },
  created() {
    this.obtenerEventos()
  },
  mounted() {
    this.$refs.calendar.checkChange()
  },
  methods: {
    async actualizarEvento(ev) {
      try {
        await db
          .collection('eventos')
          .doc(ev.id)
          .update({
            name: ev.name,
            details: ev.details
          })

        this.selectedOpen = false
        this.eventoEditado = null
      } catch (error) {
        console.log(error)
      }
    },
    async eliminarEvento(ev) {
      try {
        await db
          .collection('eventos')
          .doc(ev.id)
          .delete()
        this.selectedOpen = false
        this.obtenerEventos()
      } catch (error) {
        console.log(error)
      }
    },
    async agregarEvento() {
      try {
        if (
          this.nuevoEvento.name &&
          this.nuevoEvento.start &&
          this.nuevoEvento.end
        ) {
          await db.collection('eventos').add({
            name: this.nuevoEvento.name,
            details: this.nuevoEvento.details,
            start: this.nuevoEvento.start,
            end: this.nuevoEvento.end,
            color: this.nuevoEvento.color
          })

          this.obtenerEventos()

          this.nuevoEvento = {
            name: null,
            details: null,
            start: null,
            end: null,
            color: null
          }
        } else {
          console.log('Campos obligatorios')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerEventos() {
      try {
        const snapshot = await db.collection('eventos').get()
        const eventos = []

        snapshot.forEach(doc => {
          let evento = doc.data()
          evento.id = doc.id
          eventos.push(evento)
        })

        this.events = eventos
      } catch (error) {
        console.log(error)
      }
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => (this.selectedOpen = true), 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      /* const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: this.formatDate(first, !allDay),
          end: this.formatDate(second, !allDay),
          color: this.colors[this.rnd(0, this.colors.length - 1)]
        })
      }

      this.start = start
      this.end = end
      this.events = events */
    },
    nth(d) {
      return d > 3 && d < 21
        ? 'th'
        : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
    }
  }
}
</script>
