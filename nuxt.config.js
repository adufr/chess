export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Chess | arthurdufour.com',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/global.css',
    '~/assets/css/transitions.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/window-game-over.js' },
    { src: '~/plugins/plausible.js' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [{
    path: '~/components',
    pathPrefix: false
  }],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    // https://color-mode.nuxtjs.org/
    '@nuxtjs/color-mode',
    // https://github.com/nuxt-community/fontawesome-module
    '@nuxtjs/fontawesome',
    // Doc: https://github.com/teamnovu/nuxt-breaky
    '@teamnovu/nuxt-breaky',
    // Doc: https://github.com/Tahul/nuxt-use-sound
    'nuxt-use-sound'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'vue-plausible'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  // https://go.nuxtjs.dev/tailwindcss
  tailwindcss: {
    jit: true,
    exposeConfig: true
  },

  // @nuxtjs/color-mode + tailwindcss
  colorMode: {
    preference: 'light',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    storageKey: 'nuxt-color-mode'
  },

  // Fontawesome icons configuration
  fontawesome: {
    icons: {
      solid: ['faBars', 'faMoon', 'faHome', 'faUser', 'faUsers', 'faCog', 'faTimes',
        'faRobot', 'faPuzzlePiece', 'faCheck', 'faChess', 'faChessBoard', 'faChessKing',
        'faChessQueen', 'faChessRook', 'faChessBishop', 'faChessKnight', 'faChessPawn'],
      brands: ['faGithub']
    }
  },

  sound: {
    moveCheck: { src: '/sounds/move-check.webm' },
    moveSelf: { src: '/sounds/move-self.webm' },
    moveOpponent: { src: '/sounds/move-opponent.webm' },
    castle: { src: '/sounds/castle.webm' },
    promote: { src: '/sounds/promote.webm' },
    illegal: { src: '/sounds/illegal.webm' },
    capture: { src: '/sounds/capture.webm' },
    gameEnd: { src: '/sounds/game-end.webm' }
  },

  // https://github.com/moritzsternemann/vue-plausible
  plausible: {
    apiHost: 'https://analytics.arthurdufour.com',
    domain: 'chess.arthurdufour.com',
    hashMode: false,
    trackLocalhost: false
  }
}
