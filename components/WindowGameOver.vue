<template>
  <transition name="fade">
    <div
      v-if="show"
      id="windowGameOver"
      ref="windowGameOverRef"
      class="absolute bg-white rounded-md shadow-2xl"
    >
      <div
        class="p-5 text-center  rounded-t-md"
        :class="{
          'bg-nord-green': options.type === 'victory',
          'bg-nord-red': options.type === 'defeat',
          'bg-gray-400': options.type === 'draw',
        }"
      >
        <font-awesome-icon
          icon="times"
          class="absolute right-0 mr-5 text-white cursor-pointer"
          @click="show = false"
        />
        <p class="text-3xl font-extrabold text-white">
          {{ options.title }}
        </p>
        <small class="text-medium text-white">
          {{ options.subtitle }}
        </small>
      </div>

      <div class="p-5 flex flex-row items-center space-x-2">
        <div class="w-20 flex flex-col items-center text-center">
          <div
            class="h-16 w-16 border-4 rounded-md p-1"
            :class="{
              'border-nord-green': options.type === 'victory',
              'border-nord-snow-1': options.type === 'draw',
            }"
          >
            <img src="@/assets/images/svg/white-pawn.svg" alt="Player icon">
          </div>
          <span class="w-20 text-sm truncate text-gray-400">{{ options.whiteName }}</span>
        </div>

        <div class="-mt-4 font-medium text-gray-500">
          {{
            options.type === 'victory'
              ? '1 - 0'
              : options.type === 'draw'
                ? '0.5 - 0.5'
                : '0 - 1'
          }}
        </div>

        <div class="w-20 flex flex-col items-center text-center">
          <div
            class="h-16 w-16 border-4 rounded-md p-2"
            :class="{
              'border-nord-green': options.type === 'defeat',
              'border-nord-snow-1': options.type === 'victory',
            }"
          >
            <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
          </div>
          <span class="w-20 text-sm truncate text-gray-400">{{ options.blackName }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { windowGameOverEvents } from './windowGameOverEvents'

export default {
  data () {
    return {
      show: false,
      options: {
        type: '',
        title: '',
        subtitle: '',
        whiteName: '',
        blackName: ''
      }
    }
  },
  mounted () {
    if (!document) { return }
    windowGameOverEvents.$on('open', this.open)
    windowGameOverEvents.$on('close', () => {
      this.handleClickOverlay({ target: { id: 'windowGameOver' } })
    })
  },
  methods: {
    resetState () {
      this.options = {
        type: '',
        title: '',
        subtitle: '',
        whiteName: '',
        blackName: ''
      }
    },
    handleClickButton ({ target }, confirm) {
      if (target.id === 'windowGameOver') { return }
      this.show = false

      if (this.params.callback) {
        this.params.callback(confirm)
      }
    },
    handleClickOverlay ({ target }) {
      if (target.id === 'windowGameOver') {
        this.show = false

        if (this.params.callback) {
          this.params.callback(false)
        }
      }
    },
    open (params) {
      this.resetState()
      this.params = params
      this.show = true

      // set params to options state
      Object.entries(params).forEach((param) => {
        if (typeof param[1] === typeof this.options[param[0]]) {
          this.options[param[0]] = param[1]
        }
      })
    }
  }
}
</script>
