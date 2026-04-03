<template>
  <header class="header">
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger"
          :class="{ 'is-active': isMenuActive }"
          aria-label="menu"
          :aria-expanded="isMenuActive"
          @click="toggleMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
        <div class="navbar-start">
          <a href="/" class="navbar-item">Home</a>
          <a href="/AK91" class="navbar-item">Craig</a>
          <a href="/AK182" class="navbar-item">Kasaan</a>
          <a href="/map" class="navbar-item">Map</a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isMenuActive: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive;
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  .navbar {
    background-color: #ffffff;
    border-bottom: 1px solid #dbdbdb;
    margin-bottom: 2rem;

    .navbar-burger {
      color: #000000;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    .navbar-menu {
      background-color: #ffffff;
    }

    .navbar-item {
      color: #000000;
      font-weight: 500;
      padding: 1rem 1.5rem;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: #000000;
      }
    }
  }
}

@media screen and (max-width: 1023px) {
  .header {
    display: none;
  }
}
</style>
