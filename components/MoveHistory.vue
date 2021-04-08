<template>
  <p
    class="text-sm text-gray-600"
    v-html="historyString"
  />
</template>

<script>
export default {
  data () {
    return {
      history: []
    }
  },
  computed: {
    historyString () {
      let str = ''
      let moveNumber = 1

      this.history.forEach((move, index) => {
        if (this.isOdd(index + 1)) {
          str += `${moveNumber}. `
          moveNumber++
        }

        str += `<b>${move}</b> `
      })

      return str
    }
  },
  mounted () {
    this.$options.interval = setInterval(() => {
      this.history = window.chess.history()
    }, 100)
  },
  beforeDestroy () {
    clearInterval(this.$options.interval)
  },
  methods: {
    isOdd (number) {
      return number % 2
    }
  }
}
</script>
