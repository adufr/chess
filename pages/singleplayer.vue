<template>
  <div class="flex flex-wrap justify-center">
    <div class="p-2 lg:p-5 rounded-md" :style="'width: calc(100vh - 72px)'">
      <player position="top" name="Computer (random moves)" />

      <chessboard-singleplayer />

      <player position="bot" name="Player (you)" />
    </div>

    <div class="flex-grow h-full w-80 p-2 pt-0 lg:p-5 lg:pl-0 ">
      <div class="h-full w-full bg-nord-snow-3 dark:bg-nord-night-1  rounded-md">
        <div class="p-5">
          <move-history />
        </div>
      </div>
    </div>
  </div>
</template>
