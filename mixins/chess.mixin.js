export default {
  methods: {
    playSound ({ sound, moveResult, self }) {
      // play a specifid sound
      if (sound) {
        return this.$sounds[sound].play()
      }

      // check sound
      if (window.chess.in_check()) {
        return this.$sounds.moveCheck.play()
      }

      // promote sound
      if (moveResult && moveResult.promotion &&
        moveResult.promotion.toLowerCase() === 'q') {
        return this.$sounds.promote.play()
      }

      // capture sound
      if (moveResult && moveResult.captured) {
        return this.$sounds.capture.play()
      }

      // castle sound
      if (moveResult && moveResult.san &&
        (moveResult.san === 'O-O' || moveResult.san === 'O-O-O')) {
        return this.$sounds.castle.play()
      }

      // otherwise, a simple move
      self ? this.$sounds.moveSelf.play() : this.$sounds.moveOpponent.play()
    }
  }
}
