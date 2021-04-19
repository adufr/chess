<template>
  <base-slideover
    :showing="showSettingsSlideover"
    title="SETTINGS"
    @close="close()"
  >
    <div class="h-full">
      <p class="mb-3 text-xs font-semibold text-gray-600 dark:text-white">
        THEME
      </p>

      <div class="flex space-x-4">
        <theme-switch class="mt-px" />

        <div>
          <p class="text-sm text-gray-600 dark:text-white font-semibold">
            Dark mode
          </p>
          <p class="text-sm text-gray-400">
            Choose between light and dark mode according to your preferences.
          </p>
        </div>
      </div>
    </div>
  </base-slideover>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('layout', [
      'showSettingsSlideover'
    ])
  },
  methods: {
    close () {
      this.$store.commit('layout/TOGGLE_SETTINGS_SLIDEOVER', false)
    }
  }
}
</script>
