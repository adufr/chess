<template>
  <div class="flex flex-wrap justify-center">
    <!------------------------------------>
    <!-- chessboard ---------------------->
    <!------------------------------------>
    <div class="p-2 lg:p-5 rounded-md" :style="'width: calc(100vh - 96px)'">
      <player
        color="black"
        :name="black.name"
        img-path="computer.svg"
        :captures="black.captures"
      />

      <div :id="`chessboard-${uid}`" class="flex items-center justify-center">
        <window-game-over />
      </div>

      <player
        color="white"
        :name="white.name"
        img-path="white-pawn.svg"
        :captures="white.captures"
      />
    </div>

    <!------------------------------------>
    <!-- right side ---------------------->
    <!------------------------------------>
    <div class="flex-grow h-full w-80 p-2 pt-0 lg:p-5 lg:pl-0 ">
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
        name: this.whiteName,
        captures: []
      },
      black: {
        name: this.blackName,
        captures: []
      }
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
  },
  methods: {
    inputHandler (event) {
      if (event.type !== INPUT_EVENT_TYPE.moveDone) { return true }
      this.playMove({ from: event.squareFrom, to: event.squareTo, promotion: 'q' })
    },
    playMove (move) {
      const moveResult = this.game.move(move)

      // illegal move
      if (!this.free && !moveResult) { return this.$sounds.illegal.play() }

      // freemode illegal move
      if (this.free && !moveResult) {
        // TODO: fix playSound()
        const from = this.game.get(move.from)
        this.game.put({ type: from.type, color: from.color }, move.to)
        this.game.remove(move.from)
      }

      setTimeout(() => { // small delay to fix animations
        this.playSound({ move: moveResult, self: true })
        this.board.setPosition(this.game.fen())
        this.checkForGameOver(true)
        this.updateCaptures()
        this.afterMove()
      }, 10)
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
    // ----------------------------------------
    // -- generic methods ---------------------
    // ----------------------------------------
    changeTurn () {
      this.board.disableMoveInput()
      this.free
        ? this.board.enableMoveInput(this.inputHandler)
        : this.board.enableMoveInput(this.inputHandler, this.game.turn())
    },
    checkForGameOver (isWhite) {
      if (this.free) { return }

      if (this.game.game_over()) {
        this.$sounds.gameEnd.play()
        let title, subtitle, type

        if (this.game.in_checkmate()) {
          type = isWhite ? 'victory' : 'defeat'
          title = isWhite ? 'You won!' : 'You lost!'
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
      if (this.game.in_check()) {
        return this.$sounds.moveCheck.play()
      }

      // promote sound
      if (move && move.promotion && move.promotion.toLowerCase() === 'q') {
        return this.$sounds.promote.play()
      }

      // capture sound
      if (move && move.captured) {
        return this.$sounds.capture.play()
      }

      // castle sound
      if (move && move.san && (move.san === 'O-O' || move.san === 'O-O-O')) {
        return this.$sounds.castle.play()
      }

      // otherwise, a simple move
      self ? this.$sounds.moveSelf.play() : this.$sounds.moveOpponent.play()
    }
  }
}
</script>
