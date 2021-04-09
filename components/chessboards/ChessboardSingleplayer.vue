<template>
  <div id="chessboard-container" class="flex items-center justify-center">
    <window-game-over />
  </div>
</template>

<script>
import Chess from 'chess.js'
import {
  Chessboard,
  COLOR,
  BORDER_TYPE,
  INPUT_EVENT_TYPE
} from 'cm-chessboard/src/cm-chessboard/Chessboard'
import 'cm-chessboard/styles/cm-chessboard.css'

export default {
  mounted () {
    // ----------------------------------------------------
    // -- INITIALIZE CHESS GAME AND CHESS BOARD
    // ----------------------------------------------------

    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    // chess game
    window.chess = new Chess(fen)

    // chess board
    window.board = new Chessboard(document.getElementById('chessboard-container'), {
      position: fen,
      responsive: true,
      style: {
        cssClass: 'default',
        showCoordinates: true,
        borderType: BORDER_TYPE.frame
      },
      sprite: {
        url: require('@/assets/images/svg/chessboard-sprite-staunty.svg'),
        cache: true // cache the sprite inline, in the HTML
      }
    })

    // ----------------------------------------------------
    // -- BIND INPUT HANDLER
    // ----------------------------------------------------

    window.board.enableMoveInput(this.inputHandler, COLOR.white)
  },
  methods: {
    /**
     * Handle all movement logic
     */
    inputHandler (event) {
      // only deal with move-done
      if (event.type !== INPUT_EVENT_TYPE.moveDone) { return true }
      let moveResult, move

      // --------------------------------------------------------------
      // create my move
      // --------------------------------------------------------------

      move = { from: event.squareFrom, to: event.squareTo, promotion: 'q' }
      moveResult = window.chess.move(move)

      // invalid move
      if (!moveResult) { return this.$sounds.illegal.play() }

      this.playSound({ moveResult, self: true })

      window.board.disableMoveInput()
      window.board.setPosition(window.chess.fen())
      this.checkForGameOver(true)

      // --------------------------------------------------------------
      // bot move
      // --------------------------------------------------------------

      // get all possibleMoves
      const possibleMoves = window.chess.moves({ verbose: true })
      if (possibleMoves.length === 0 || window.chess.game_over()) { return true }

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * possibleMoves.length)
        move = possibleMoves[randomIndex]
        moveResult = window.chess.move({ from: move.from, to: move.to, promotion: 'q' })

        this.playSound({ moveResult, self: false })

        window.board.enableMoveInput(this.inputHandler, COLOR.white)
        window.board.setPosition(window.chess.fen())
        this.checkForGameOver(false)
      }, 1000)

      return true
    }

  }
}
</script>
