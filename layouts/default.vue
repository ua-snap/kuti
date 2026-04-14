<template>
  <div data-theme="light">
    <Header />
    <div class="development-notice">
      <div class="development-notice-content">
        <strong>⚠️ Notice:</strong> This website is currently in development.
        Features, functionality, content, and design are subject to change as
        development continues. Information presented may be incomplete,
        inaccurate, or modified prior to the official production release.
      </div>
    </div>
    <NuxtRouteAnnouncer />
    <slot />
  </div>
  <Footer />
</template>

<style scoped>
.development-notice {
  background-color: #fef3c7;
  border-top: 1px solid #f59e0b;
  border-bottom: 3px solid #f59e0b;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.development-notice-content {
  max-width: 1200px;
  margin: 0 auto;
  color: #000000;
  font-size: 0.95rem;
  line-height: 1.5;
}

.development-notice-content strong {
  color: #000000;
  font-weight: 700;
}
</style>
