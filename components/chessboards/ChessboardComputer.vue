<script>
import { COLOR } from 'cm-chessboard/src/cm-chessboard/Chessboard'
import MinimaxMixin from '@/mixins/minimax'
import BaseChessboard from './BaseChessboard'

export default {
  extends: BaseChessboard,
  mixins: [MinimaxMixin],
  props: {
    computer: {
      type: Number,
      default: 1
    }
  },
  methods: {
    afterMove () {
      // if it's bot's turn to play
      const computerColor = this.playerColor === 'w' ? 'b' : 'w'
      if (this.game.turn() === computerColor) {
        this.board.disableMoveInput()

        // ------------------------------------
        // play using random moves
        // ------------------------------------
        if (this.computer === 1) {
          const possibleMoves = this.game.moves({ verbose: true })
          if (possibleMoves.length === 0 || this.game.game_over()) { return true }

          setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * possibleMoves.length)
            const move = possibleMoves[randomIndex]

            this.playMove({ from: move.from, to: move.to, promotion: 'q' })
            this.board.enableMoveInput(this.inputHandler, COLOR.white)
          }, 1000)

        // ------------------------------------
        // play using minimax
        // ------------------------------------
        } else {
          const move = this.minimax(this.game, 2, true, 0, 'b')[0]

          setTimeout(() => {
            this.playMove(move)
            this.board.enableMoveInput(this.inputHandler, COLOR.white)
          }, 200)
        }
      } else {
        this.changeTurn()
      }
    }
  }
}
</script>
