<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  </head>
  <div id="app">
    <router-view/>
  </div>
</template>
<script setup lang="ts">
window.onload = function () {
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, {passive: false});
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault();
  });
};

</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: #f5f5f5;
  overflow-y: scroll;
}

#app {
  height: 100%;
}
</style>