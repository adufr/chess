import Vue from 'vue'
import WindowGameOver from '~/components/WindowGameOver.vue'
import { windowGameOverEvents } from '~/components/windowGameOverEvents.js'

export default (_, inject) => {
  Vue.component('WindowGameOver', WindowGameOver)

  const confirm = (params) => {
    windowGameOverEvents.$emit('open', params)
  }

  confirm.close = () => {
    windowGameOverEvents.$emit('close')
  }

  inject('game_over', params => confirm(params))
}
