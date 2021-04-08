<template>
  <base-modal
    id="baseSuccessModal"
    ref="baseSuccessModalRef"
    :showing="show"
    class="mx-auto max-w-sm"
    @close="show = false"
  >
    <div class="bg-white p-5">
      <div class="flex flex-col justify-center items-center">
        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 bg-green-200 rounded-full sm:mx-0 sm:h-10 sm:w-10">
          <font-awesome-icon icon="check" class="text-green-700" />
        </div>

        <div class="mt-5 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ dialog.title }}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500" v-html="dialog.message" />
          </div>
        </div>

        <div class="mt-5 w-full">
          <button
            v-if="dialog.buttons.confirm"
            type="button"
            class="bg-indigo-600 w-full rounded-md shadow-sm px-4 py-2 text-white text-sm font-medium focus:outline-none hover:bg-indigo-500 transition duration-150"
            @click.stop="e => handleClickButton(e, true)"
          >
            {{ dialog.buttons.confirm }}
          </button>

          <button
            v-if="dialog.buttons.cancel"
            type="button"
            class="bg-indigo-600 w-full rounded-md shadow-sm px-4 py-2 text-white text-sm font-medium focus:outline-none hover:bg-indigo-500 transition duration-150"
            @click.stop="e => handleClickButton(e, false)"
          >
            {{ dialog.buttons.cancel }}
          </button>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<script>
import { baseSuccessModalEvents } from './baseSuccessModalEvents'

export default {
  data () {
    return {
      show: false,
      dialog: {
        title: '',
        message: '',
        buttons: {}
      },
      params: {}
    }
  },
  mounted () {
    if (!document) { return }
    baseSuccessModalEvents.$on('open', this.open)
    baseSuccessModalEvents.$on('close', () => {
      this.handleClickOverlay({ target: { id: 'baseSuccessModal' } })
    })
  },
  methods: {
    resetState () {
      this.dialog = {
        title: '',
        message: '',
        buttons: {},
        callback: () => {}
      }
    },
    handleClickButton ({ target }, confirm) {
      if (target.id === 'baseSuccessModal') { return }
      this.show = false

      if (this.params.callback) {
        this.params.callback(confirm)
      }
    },
    handleClickOverlay ({ target }) {
      if (target.id === 'baseSuccessModal') {
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

      // set params to dialog state
      Object.entries(params).forEach((param) => {
        if (typeof param[1] === typeof this.dialog[param[0]]) {
          this.dialog[param[0]] = param[1]
        }
      })
    }
  }
}
</script>
