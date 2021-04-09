export default {
  methods: {
    checkForGameOver (isWhite) {
      if (window.chess.game_over()) {
        this.$sounds.gameEnd.play()
        let title, subtitle, type

        if (window.chess.in_checkmate()) {
          type = isWhite ? 'victory' : 'defeat'
          title = isWhite ? 'You won!' : 'You lost!'
          subtitle = 'by checkmate'
        } else if (window.chess.in_stalemate()) {
          type = 'draw'
          title = 'It\'s a draw!'
          subtitle = 'by stalemate'
        } else if (window.chess.in_threefold_repetition()) {
          type = 'draw'
          title = 'It\'s a draw!'
          subtitle = 'by repetition'
        } else if (window.chess.insufficient_material()) {
          type = 'draw'
          title = 'It\'s a draw!'
          subtitle = 'by insufficient material'
        }

        this.$game_over({
          type,
          title,
          subtitle,
          whiteName: 'Player',
          blackName: 'Computer'
        })
      }
    },
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
