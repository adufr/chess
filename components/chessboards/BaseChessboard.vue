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
        :color="opponentColor"
        :name="opponentName"
        :img-path="opponentImage"
        :captures="opponent.captures"
        :advantage="getMaterialDifference(opponentColor)"
      />

      <div :id="`chessboard-${uid}`" class="flex items-center justify-center">
        <window-game-over />
      </div>

      <!-- TODO: fix img -->
      <player
        player
        :color="playerColor"
        :name="playerName"
        :img-path="playerImage"
        :captures="player.captures"
        :advantage="getMaterialDifference(playerColor)"
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
import { Chessboard, FEN_START_POSITION, BORDER_TYPE, INPUT_EVENT_TYPE, SQUARE_SELECT_TYPE } from 'cm-chessboard/src/cm-chessboard/Chessboard'
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
    playerName: {
      type: String,
      default: ''
    },
    playerImage: {
      type: String,
      default: 'white-pawn.svg'
    },
    opponentName: {
      type: String,
      default: ''
    },
    opponentImage: {
      type: String,
      default: 'computer.svg'
    },
    playerColor: {
      type: String,
      default: 'w'
    }
  },
  data () {
    return {
      uid: Date.now(),
      game: null,
      board: null,
      player: { captures: [] },
      opponent: { captures: [] },
      materialCount: 0,
      windowWidth: window.innerWidth,
      isControlKeyDown: false,
      isAltKeyDown: false,
      rcMarker: { class: 'emphasize', slice: 'markerSquare' },
      altRcMarker: { class: 'emphasize2', slice: 'markerSquare' },
      ctrlRcMarker: { class: 'emphasize3', slice: 'markerSquare' },
      lastMoveMarker: { class: 'emphasize4', slice: 'markerSquare' }
    }
  },
  computed: {
    isSmall () {
      return this.windowWidth <= 1026
    },
    opponentColor () {
      return (this.playerColor === 'w') ? 'b' : 'w'
    }
  },
  watch: {
    playerColor (newVal) {
      this.board.setOrientation(newVal)
    },
    disabled (newVal) {
      // update turn on game start
      if (newVal === false) { this.afterMove() }
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

    this.board.enableSquareSelect((event) => {
      switch (event.type) {
        // left click
        case SQUARE_SELECT_TYPE.primary:
          return this.removeAllSquareMarkers()

        // right click
        case SQUARE_SELECT_TYPE.secondary: {
          const hasMarkers = (this.board.getMarkers(event.square).length > 0)

          if (this.isControlKeyDown) {
            return hasMarkers
              ? this.removeAllSquareMarkers(event.square)
              : this.board.addMarker(event.square, this.ctrlRcMarker)
          }

          if (this.isAltKeyDown) {
            return hasMarkers
              ? this.removeAllSquareMarkers(event.square)
              : this.board.addMarker(event.square, this.altRcMarker)
          }

          return hasMarkers
            ? this.removeAllSquareMarkers(event.square)
            : this.board.addMarker(event.square, this.rcMarker)
        }
      }
    })

    this.changeTurn()

    // --------------------------------------------
    // Event listeners
    // --------------------------------------------
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('keyup', this.keyupHandler)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('keyup', this.keyupHandler)
  },
  methods: {
    resizeHandler () {
      this.windowWidth = window.innerWidth
    },
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
    playMove (move) {
      const moveResult = this.game.move(move)

      // illegal move
      if (!moveResult) { return false }

      this.playSound({ move: moveResult, self: true })
      this.drawLastMove(move)
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
      this.player.captures = this.playerColor === 'w' ? this.getWhiteCaptures() : this.getBlackCaptures()
      this.opponent.captures = this.opponentColor === 'w' ? this.getWhiteCaptures() : this.getBlackCaptures()
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
      let playerTotal = 0
      let opponentTotal = 0
      this.player.captures.forEach((capture) => {
        switch (capture) {
          case 'pawn': playerTotal += 1; break
          case 'knight': playerTotal += 3; break
          case 'bishop': playerTotal += 3; break
          case 'rook': playerTotal += 5; break
          case 'queen': playerTotal += 9; break
        }
      })

      this.opponent.captures.forEach((capture) => {
        switch (capture) {
          case 'pawn': opponentTotal += 1; break
          case 'knight': opponentTotal += 3; break
          case 'bishop': opponentTotal += 3; break
          case 'rook': opponentTotal += 5; break
          case 'queen': opponentTotal += 9; break
        }
      })

      return (this.playerColor === 'w')
        ? playerTotal - opponentTotal
        : opponentTotal - playerTotal
    },
    getMaterialDifference (color) {
      return (color === 'w')
        ? this.materialCount > 0
          ? Math.abs(this.materialCount)
          : 0
        : this.materialCount < 0
          ? Math.abs(this.materialCount)
          : 0
    },

    // ----------------------------------------
    // -- markers -----------------------------
    // ----------------------------------------
    keydownHandler (event) {
      switch (event.keyCode) {
        case 17: this.isControlKeyDown = true; break
        case 18: this.isAltKeyDown = true; break
      }
    },
    keyupHandler (event) {
      switch (event.keyCode) {
        case 17: this.isControlKeyDown = false; break
        case 18: this.isAltKeyDown = false; break
      }
    },
    drawPossibleMoves (square) {
      const moves = this.game.moves({ square, verbose: true })
      moves.forEach((move) => {
        (move.captured)
          ? this.board.addMarker(move.to, { class: 'legal-capture', slice: 'markerCircle' })
          : this.board.addMarker(move.to, { class: 'legal-move', slice: 'markerSmallCircle' })
      })
    },
    removeAllSquareMarkers (square) {
      this.board.removeMarkers(square, this.rcMarker)
      this.board.removeMarkers(square, this.ctrlRcMarker)
      this.board.removeMarkers(square, this.altRcMarker)
    },
    drawLastMove (move) {
      this.board.removeMarkers(undefined, this.lastMoveMarker)
      this.board.addMarker(move.from, this.lastMoveMarker)
      this.board.addMarker(move.to, this.lastMoveMarker)
    },

    // ----------------------------------------
    // -- generic methods ---------------------
    // ----------------------------------------
    changeTurn () {
      this.board.disableMoveInput()
      this.board.enableMoveInput(this.inputHandler, this.game.turn())
    },
    checkForGameOver () {
      const turn = this.game.turn()

      if (this.game.game_over()) {
        this.$sounds.gameEnd.play()
        let title, subtitle, type

        if (this.game.in_checkmate()) {
          type = (turn === this.playerColor) ? 'defeat' : 'victory'
          title = (turn === this.playerColor) ? 'You lost!' : 'You won!'
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

/* custom "right click" marker */
.cm-chessboard .markers .marker.emphasize {
  fill: #F87171;
  opacity: 0.8;
}

/* custom "alt right click" marker */
.cm-chessboard .markers .marker.emphasize2 {
  fill: #60A5FA;
  opacity: 0.8;
}

/* custom "ctrl right click" marker */
.cm-chessboard .markers .marker.emphasize3 {
  fill: #FBBF24;
  opacity: 0.8;
}

/* custom "last move" marker */
.cm-chessboard .markers .marker.emphasize4 {
  fill: #FDE68A;
  opacity: 0.4;
}
</style>
