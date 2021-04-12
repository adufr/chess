<template>
  <div class="fixed h-screen w-64 bg-nord-snow-3 dark:bg-nord-night-0">
    <div class="h-full flex flex-col items-center justify-between overflow-y-auto hide-scrollbar">
      <div class="w-full px-5">
        <!----------------------------->
        <!-- top ---------------------->
        <!----------------------------->

        <div class="h-16 flex justify-between lg:justify-center items-center border-b border-nord-snow-1 dark:border-nord-night-2">
          <div class="flex space-x-4 text-3xl font-extrabold text-nord-frost-2">
            <font-awesome-icon icon="chess" />
            <p>CHESS</p>
          </div>

          <div @click="toggleSidebar()">
            <font-awesome-icon icon="bars" class="block lg:hidden text-nord-night-0 dark:text-nord-snow-3" />
          </div>
        </div>

        <!-- home -->
        <div class="mt-5">
          <button
            class="w-full text-white font-medium py-2 rounded-lg focus:outline-none shadow-xs bg-nord-frost-2 hover:bg-nord-frost-1 transition duration-150 "
            @click="$router.push('/')"
          >
            About
          </button>
        </div>

        <!----------------------------->
        <!-- main menu -->
        <div class="mt-10">
          <sidebar-category
            title="PLAY"
          />

          <sidebar-item
            title="Singleplayer"
            icon="user"
            to="/singleplayer"
          />

          <sidebar-item
            title="Multiplayer"
            icon="users"
            to="/multiplayer"
          />

          <sidebar-item
            title="Problems"
            icon="puzzle-piece"
            to="/problems"
          />
        </div>

        <!----------------------------->
        <!-- others -->
        <div class="mt-10">
          <sidebar-category
            title="OTHERS"
          />

          <sidebar-item
            title="Freemove"
            icon="chess-queen"
            to="/freemove"
          />

          <sidebar-item
            title="FEN Editor"
            icon="chess-board"
            to="/fen-editor"
          />
        </div>
      </div>

      <!----------------------------->
      <!-- bottom ------------------->
      <!----------------------------->
      <div class="w-full">
        <theme-switch />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toggleSidebar () {
      this.$store.commit('layout/TOGGLE_SIDEBAR')
    }
  }
}
</script>
