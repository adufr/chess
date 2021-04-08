import Vue from 'vue'
import BaseSuccessModal from '~/components/theme/modals/success/BaseSuccessModal.vue'
import { baseSuccessModalEvents } from '~/components/theme/modals/success/baseSuccessModalEvents'

export default (_, inject) => {
  Vue.component('BaseSuccessModal', BaseSuccessModal)

  const confirm = (params) => {
    baseSuccessModalEvents.$emit('open', params)
  }

  confirm.close = () => {
    baseSuccessModalEvents.$emit('close')
  }

  inject('success', params => confirm(params))
}
