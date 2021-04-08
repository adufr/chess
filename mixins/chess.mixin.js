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
    },
    getBlackCaptures () {
      const array = []
      const fen = window.chess.fen().split(' ')[0]

      const pawns = (fen.match(/P/g) || []).length
      for (let i = 0; i < Math.abs(pawns - 8); i++) { array.push('pawn') }

      const knights = (fen.match(/N/g) || []).length
      for (let i = 0; i < Math.abs(knights - 2); i++) { array.push('knight') }

      const bishops = (fen.match(/B/g) || []).length
      for (let i = 0; i < Math.abs(bishops - 2); i++) { array.push('bishop') }

      const rooks = (fen.match(/R/g) || []).length
      for (let i = 0; i < Math.abs(rooks - 2); i++) { array.push('rook') }

      const queen = (fen.match(/Q/g) || []).length
      if (queen === 0) { array.push('queen') }

      return array
    },
    getWhiteCaptures () {
      const array = []
      const fen = window.chess.fen().split(' ')[0]

      const pawns = (fen.match(/p/g) || []).length
      for (let i = 0; i < Math.abs(pawns - 8); i++) { array.push('pawn') }

      const knights = (fen.match(/n/g) || []).length
      for (let i = 0; i < Math.abs(knights - 2); i++) { array.push('knight') }

      const bishops = (fen.match(/b/g) || []).length
      for (let i = 0; i < Math.abs(bishops - 2); i++) { array.push('bishop') }

      const rooks = (fen.match(/r/g) || []).length
      for (let i = 0; i < Math.abs(rooks - 2); i++) { array.push('rook') }

      const queen = (fen.match(/q/g) || []).length
      if (queen === 0) { array.push('queen') }

      return array
    }
  }
}
