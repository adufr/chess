<template>
  <div class="flex flex-wrap justify-center">
    <div class="p-2 lg:p-5 rounded-md" :style="'width: calc(100vh - 96px)'">
      <player
        color="black"
        name="Computer (random moves)"
        img-path="computer.svg"
      />

      <chessboard-singleplayer />

      <player
        color="white"
        name="Player (you)"
        img-path="white-pawn.svg"
      />
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
