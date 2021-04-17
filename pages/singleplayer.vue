<template>
  <chessboard-singleplayer
    :disabled="disabled"
    :computer="selected"
    :black-name="selectedComputer.displayName"
    :white-name="'Player (you)'"
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
                :class="(selected === computer.id) ? 'border-nord-frost-3' : 'border-nord-snow-3 dark:border-nord-night-1'"
                @click="selected = computer.id"
              >
                <div class="h-14 w-14 xl:h-20 xl:w-20 flex items-center justify-center bg-white p-2 rounded-md">
                  <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
                  <p class="absolute text-center font-black text-gray-500">
                    {{ computer.id }}
                  </p>
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
  </chessboard-singleplayer>
</template>

<script>
export default {
  data () {
    return {
      disabled: true,
      selected: 1,
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
          displayName: 'Computer #1 (minimax, depth=2)',
          description: 'This computer plays using a minimax algorithm (depth 2).'
        }
      ]
    }
  },
  computed: {
    selectedComputer () {
      return this.computers[this.selected - 1]
    }
  },
  methods: {
    start () {
      if (!this.selected) { return }

      this.disabled = false
    }
  }
}
</script>
