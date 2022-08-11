import { ref } from "vue";

export default (el = document) => {
  const isOpen = ref(false);
  const openOrClose = () => {
    try {
      if (el.fullscreenElement) {
        el.exitFullscreen();
      } else {
        el.documentElement.requestFullscreen();
      }
      isOpen.value = !isOpen.value;
    } catch (error) {
      console.error(error);
    }
  }

  window.onresize = () => {
    isOpen.value = el.fullscreenElement ? true : false;
  }

  window.onkeydown = (e) => {
    if (e.code === 'F11') {
      console.log(e.code);
      openOrClose();
      return false;
    }
  }

  return {
    isOpen,
    openOrClose,
  }
}