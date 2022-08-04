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

  return {
    isOpen,
    openOrClose,
  }
}