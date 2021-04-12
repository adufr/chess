<template>
  <chessboard-singleplayer
    black-name="Computer (random moves)"
    white-name="Player (you)"
  >
    <template #right>
      <div class="h-full w-full bg-nord-snow-3 dark:bg-nord-night-1  rounded-md">
        <div class="h-full flex flex-col justify-between">
          <div class="text-center p-5">
            <p class="text-nord-night-4 dark:text-white text-4xl font-extrabold">
              Play against..
            </p>
          </div>

          <div class="w-full flex justify-center space-x-4 p-5">
            <div class="h-20 w-20 flex items-center justify-center bg-white p-2 rounded-md">
              <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
              <p class="absolute text-center font-black text-gray-500">
                1
              </p>
            </div>

            <div class="h-20 w-20 flex items-center justify-center bg-white p-2 rounded-md">
              <img src="@/assets/images/svg/computer.svg" alt="Computer icon">
              <p class="absolute text-center font-black text-gray-500">
                2
              </p>
            </div>
          </div>

          <div class="w-full bg-nord-snow-2 dark:bg-nord-night-0 p-5">
            <button class="w-full bg-nord-frost-3 py-3 rounded-lg" @click="select()">
              <span class="text-white text-xl font-bold">
                Select
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </chessboard-singleplayer>
</template>
