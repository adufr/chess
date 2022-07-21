<template>
  <chessboard-computer
    :disabled="disabled"
    :computer="selectedComputerId"
    :player-color="color"
    :player-name="'Player (you)'"
    :player-image="'white-pawn.svg'"
    :opponent-name="selectedComputer.displayName"
    :opponent-image="'computer.svg'"
  >
    <template #right>
      <div class="h-full bg-nord-snow-3 dark:bg-nord-night-1 rounded-md">
        <div v-show="disabled" class="h-full flex flex-col justify-between">
          <!-- top -->
          <div class="p-5 flex flex-col items-center justify-center space-y-4 xl:space-y-8">
            <p class="text-nord-night-4 dark:text-white text-2xl xl:text-4xl font-extrabold">
              Play against..
            </p>

            <div class="flex flex-col items-center space-y-4">
              <div class="h-20 w-20 xl:h-28 xl:w-28 flex items-center justify-center bg-white p-2 rounded-md">
                <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
                <p class="absolute text-center font-black text-gray-500">
                  {{ selectedComputer.id }}
                </p>
              </div>

              <div class="text-center">
                <p class="text-lg font-bold text-nord-night-4 dark:text-white">
                  {{ selectedComputer.name }}
                </p>
              </div>

              <div class="text-center">
                <p
                  class="text-sm xl:text-base text-gray-400"
                  v-html="selectedComputer.description"
                />
              </div>
            </div>

            <div class="w-full flex justify-center space-x-4">
              <div
                v-for="(computer, index) in computers"
                :key="index"
                class="flex items-center justify-center p-1 rounded-md border-4"
                :class="(selectedComputerId === computer.id)
                  ? 'border-nord-frost-3'
                  : 'border-nord-snow-3 dark:border-nord-night-1'"
                @click="selectedComputerId = computer.id"
              >
                <div class="h-14 w-14 xl:h-20 xl:w-20 flex items-center justify-center bg-white p-2 rounded-md">
                  <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
                  <p class="absolute text-center font-black text-gray-500">
                    {{ computer.id }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center space-y-3">
              <p class="text-xs text-gray-400 font-semibold">
                JE JOUE LES
              </p>

              <div class="w-full flex justify-center space-x-3">
                <div
                  class="h-12 w-12 flex items-center justify-center rounded-md border-2 cursor-pointer"
                  :class="selectedColor === 'w'
                    ? 'border-nord-frost-3'
                    : 'border-nord-snow-1 dark:border-nord-night-3'"
                  @click="selectedColor = 'w'"
                >
                  <font-awesome-icon icon="chess-pawn" class="text-2xl text-white" />
                </div>

                <div
                  class="h-12 w-12 flex items-center justify-center rounded-md border-2 cursor-pointer"
                  :class="selectedColor === 'r'
                    ? 'border-nord-frost-3'
                    : 'border-nord-snow-1 dark:border-nord-night-3'"
                  @click="selectedColor = 'r'"
                >
                  <p class="text-lg text-gray-400">
                    ?
                  </p>
                </div>

                <div
                  class="h-12 w-12 flex items-center justify-center rounded-md border-2 cursor-pointer"
                  :class="selectedColor === 'b'
                    ? 'border-nord-frost-3'
                    : 'border-nord-snow-1 dark:border-nord-night-2'"
                  @click="selectedColor = 'b'"
                >
                  <font-awesome-icon icon="chess-pawn" class="text-2xl text-black" />
                </div>
              </div>
            </div>
          </div>

          <!-- bottom -->
          <div class="w-full bg-nord-snow-2 dark:bg-nord-night-0 p-5 rounded-b-md">
            <button class="w-full bg-nord-frost-3 py-3 rounded-lg" @click="start()">
              <span class="text-white text-lg xl:text-xl font-bold">
                Select
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </chessboard-computer>
</template>

<script>
export default {
  data () {
    return {
      disabled: true,
      selectedComputerId: 1,
      selectedColor: 'w',
      color: null,
      computers: [
        {
          id: 1,
          name: 'Computer #1',
          displayName: 'Computer #1 (random moves)',
          description: 'This computer plays using random moves.<br>It\'s the weakest you can play against.'
        },
        {
          id: 2,
          name: 'Computer #2',
          displayName: 'Computer #1 (minimax, depth=3)',
          description: 'This computer plays using a minimax algorithm (depth 3).'
        }
      ]
    }
  },
  computed: {
    selectedComputer () {
      return this.computers[this.selectedComputerId - 1]
    }
  },
  methods: {
    start () {
      if (!this.selectedComputerId || !this.selectedColor) { return }

      (this.selectedColor === 'r')
        ? this.color = Math.round(Math.random()) === 1 ? 'w' : 'b'
        : this.color = this.selectedColor

      this.disabled = false
    }
  }
}
</script>
