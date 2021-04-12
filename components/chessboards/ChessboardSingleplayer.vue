<script>
import { COLOR } from 'cm-chessboard/src/cm-chessboard/Chessboard'
import BaseChessboard from './BaseChessboard'

export default {
  extends: BaseChessboard,
  methods: {
    afterMove () {
      if (this.game.turn() === 'b') {
        this.board.disableMoveInput()
        const possibleMoves = this.game.moves({ verbose: true })
        if (possibleMoves.length === 0 || this.game.game_over()) { return true }

        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * possibleMoves.length)
          const move = possibleMoves[randomIndex]

          this.playMove({ from: move.from, to: move.to, promotion: 'q' })
          this.board.enableMoveInput(this.inputHandler, COLOR.white)
        }, 1000)
      } else {
        this.changeTurn()
      }
    }
  }
}
</script>
