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

    // chess game
    window.chess = new Chess()

    // chess board
    window.board = new Chessboard(document.getElementById('chessboard-container'), {
      position: 'start',
      responsive: true,
      style: {
        cssClass: 'default',
        showCoordinates: true,
        borderType: BORDER_TYPE.frame
      },
      sprite: { url: 'https://raw.githubusercontent.com/shaack/cm-chessboard/master/assets/images/chessboard-sprite-staunty.svg' }
    })

    // ----------------------------------------------------
    // -- BIND INPUT HANDLER
    // ----------------------------------------------------

    window.board.enableMoveInput(this.inputHandler, COLOR.white)
  },
  methods: {
    checkForGameOver () {
      if (window.chess.game_over()) {
        this.$sounds.gameEnd.play()

        // TODO: passer props joueurs / color / type de game_over etc
        this.$game_over({
          title: 'You won!',
          subtitle: 'by checkmate'
        })
      }
    },

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
      this.checkForGameOver()

      // --------------------------------------------------------------
      // bot move
      // --------------------------------------------------------------

      // get all possibleMoves
      const possibleMoves = window.chess.moves({ verbose: true })
      if (possibleMoves.length === 0) { return true }

      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * possibleMoves.length)
        move = possibleMoves[randomIndex]
        moveResult = window.chess.move({ from: move.from, to: move.to, promotion: 'q' })

        this.playSound({ moveResult, self: false })

        window.board.enableMoveInput(this.inputHandler, COLOR.white)
        window.board.setPosition(window.chess.fen())
        this.checkForGameOver()
      }, 1000)

      return true
    }

  }
}
</script>
