<template>
  <header class="header">
    <div class="banner">
      <img src="~/assets/images/landslide.png" alt="Landslide banner" />
    </div>
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
  .banner {
    width: 100%;
    overflow: hidden;
    max-height: 200px;

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      margin-top: -130px;
    }
  }

  .navbar {
    background-color: #5a4f72;
    border-bottom: 0.3rem solid #5a0072;
    margin-bottom: 2rem;

    .navbar-burger {
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    .navbar-menu {
      background-color: #5a4f72;
    }

    .navbar-item {
      color: #ffffff;
      font-weight: 500;
      padding: 1rem 1.5rem;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }
    }
  }
}

@media screen and (max-width: 1023px) {
  .navbar-menu {
    &.is-active {
      display: block;
    }
  }
}
</style>
