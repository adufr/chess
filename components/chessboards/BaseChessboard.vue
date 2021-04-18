<template>
  <div class="flex flex-wrap justify-center h-full">
    <!------------------------------------>
    <!-- chessboard ---------------------->
    <!------------------------------------>
    <div
      class="p-2 lg:p-5 rounded-md"
      :class="{ 'order-2': disabled && isSmall }"
      :style="isSmall
        ? 'width: calc(100vh - 144px)'
        : 'width: calc(100vh - 96px)'"
    >
      <player
        color="black"
        :name="blackName"
        img-path="computer.svg"
        :captures="black.captures"
        :advantage="getMaterialDifference('black')"
      />

      <div :id="`chessboard-${uid}`" class="flex items-center justify-center">
        <window-game-over />
      </div>

      <player
        color="white"
        :name="whiteName"
        img-path="white-pawn.svg"
        :captures="white.captures"
        :advantage="getMaterialDifference('white')"
      />
    </div>

    <!------------------------------------>
    <!-- right side ---------------------->
    <!------------------------------------>
    <div
      class="flex-grow w-96 p-2 lg:pt-5 lg:p-5 xl:pl-0"
      :class="{ 'order-1': disabled && isSmall }"
      :style="(disabled && isSmall) ? 'height: calc(100vh - 48px)' : 'height: auto'"
    >
      <slot name="right" />
    </div>
  </div>
</template>

<script>
import Chess from 'chess.js'
import { Chessboard, FEN_START_POSITION, BORDER_TYPE, INPUT_EVENT_TYPE } from 'cm-chessboard/src/cm-chessboard/Chessboard'
import 'cm-chessboard/styles/cm-chessboard.css'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    fen: {
      type: String,
      default: FEN_START_POSITION
    },
    free: {
      type: Boolean,
      default: false
    },
    whiteName: {
      type: String,
      default: ''
    },
    blackName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      uid: Date.now(),
      game: null,
      board: null,
      white: {
        captures: []
      },
      black: {
        captures: []
      },
      materialCount: 0,
      windowWidth: window.innerWidth
    }
  },
  computed: {
    isSmall () {
      return this.windowWidth <= 1026
    }
  },
  mounted () {
    this.game = new Chess(this.fen)

    this.board = new Chessboard(document.getElementById(`chessboard-${this.uid}`), {
      position: this.fen,
      responsive: true,
      style: { borderType: BORDER_TYPE.frame },
      sprite: { url: require('@/assets/images/svg/chessboard-sprite-staunty.svg'), cache: true }
    })

    this.changeTurn()

    window.addEventListener('resize', (e) => {
      this.windowWidth = window.innerWidth
    })
  },
  methods: {
    inputHandler (event) {
      if (this.disabled) { return false }

      this.board.removeMarkers()

      // @ move start
      if (event.type === INPUT_EVENT_TYPE.moveStart) {
        this.drawPossibleMoves(event.square)
      }

      // @ move done
      if (event.type !== INPUT_EVENT_TYPE.moveDone) { return true }
      const result = this.playMove({ from: event.squareFrom, to: event.squareTo, promotion: 'q' })
      return result
    },
    drawPossibleMoves (square) {
      const moves = this.game.moves({ square, verbose: true })
      moves.forEach((move) => {
        (move.captured)
          ? this.board.addMarker(move.to, { class: 'legal-capture', slice: 'markerCircle' })
          : this.board.addMarker(move.to, { class: 'legal-move', slice: 'markerSmallCircle' })
      })
    },
    playMove (move) {
      const moveResult = this.game.move(move)

      // illegal move
      if (!this.free && !moveResult) { return false }

      // freemode illegal move
      if (this.free && !moveResult) {
        // TODO: fix playSound()
        const from = this.game.get(move.from)
        this.game.put({ type: from.type, color: from.color }, move.to)
        this.game.remove(move.from)
      }

      this.playSound({ move: moveResult, self: true })
      this.board.setPosition(this.game.fen())
      this.checkForGameOver(true)
      this.updateCaptures()
      setTimeout(() => {
        this.afterMove()
      }, 500)
      return true
    },
    afterMove () {
      this.changeTurn()
    },

    // ----------------------------------------
    // -- captures logic ----------------------
    // ----------------------------------------
    updateCaptures () {
      this.white.captures = this.getWhiteCaptures()
      this.black.captures = this.getBlackCaptures()
      this.materialCount = this.getMaterialCount()
    },
    getBlackCaptures () {
      const array = []
      const fen = this.game.fen().split(' ')[0]

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
      const fen = this.game.fen().split(' ')[0]

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
    },
    getMaterialCount () {
      let whiteTotal = 0
      let blackTotal = 0
      this.white.captures.forEach((capture) => {
        switch (capture) {
          case 'pawn': whiteTotal += 1; break
          case 'knight': whiteTotal += 3; break
          case 'bishop': whiteTotal += 3; break
          case 'rook': whiteTotal += 5; break
          case 'queen': whiteTotal += 9; break
        }
      })

      this.black.captures.forEach((capture) => {
        switch (capture) {
          case 'pawn': blackTotal += 1; break
          case 'knight': blackTotal += 3; break
          case 'bishop': blackTotal += 3; break
          case 'rook': blackTotal += 5; break
          case 'queen': blackTotal += 9; break
        }
      })

      return whiteTotal - blackTotal
    },
    getMaterialDifference (color) {
      return (color === 'white')
        ? this.materialCount > 0
          ? Math.abs(this.materialCount)
          : 0
        : this.materialCount < 0
          ? Math.abs(this.materialCount)
          : 0
    },
    // ----------------------------------------
    // -- generic methods ---------------------
    // ----------------------------------------
    changeTurn () {
      this.board.disableMoveInput()
      this.free
        ? this.board.enableMoveInput(this.inputHandler)
        : this.board.enableMoveInput(this.inputHandler, this.game.turn())
    },
    checkForGameOver () {
      if (this.free) { return }

      const turn = this.game.turn()

      if (this.game.game_over()) {
        this.$sounds.gameEnd.play()
        let title, subtitle, type

        if (this.game.in_checkmate()) {
          type = turn === 'b' ? 'victory' : 'defeat'
          title = turn === 'b' ? 'You won!' : 'You lost!'
          subtitle = 'by checkmate'
        } else if (this.game.in_stalemate()) {
          type = 'draw'
          title = 'It\'s a draw!'
          subtitle = 'by stalemate'
        } else if (this.game.in_threefold_repetition()) {
          type = 'draw'
          title = 'It\'s a draw!'
          subtitle = 'by repetition'
        } else if (this.game.insufficient_material()) {
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
    playSound ({ sound, move, self }) {
      // play a specifid sound
      if (sound) {
        return this.$sounds[sound].play()
      }

      // check sound
      if (move && move.san.includes('+')) {
        return this.$sounds.moveCheck.play()
      }

      // capture sound
      if (move && move.san.includes('x')) {
        return this.$sounds.capture.play()
      }

      // castle sound
      if (move && move.san && (move.san === 'O-O' || move.san === 'O-O-O')) {
        return this.$sounds.castle.play()
      }

      // promote sound
      if (move && move.san.includes('=')) {
        return this.$sounds.promote.play()
      }

      // otherwise, a simple move
      self ? this.$sounds.moveSelf.play() : this.$sounds.moveOpponent.play()
    }
  }
}
</script>

<style>
/* custom "legal move" marker */
.cm-chessboard .markers .marker.legal-move {
  stroke: black;
  stroke-width: 6px;
  opacity: 0.1;
}

/* custom "legal capture" marker */
.cm-chessboard .markers .marker.legal-capture {
  stroke: black;
  stroke-width: 3px;
  opacity: 0.1;
}
</style>
