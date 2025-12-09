<template>
  <aside class="legend-card" aria-label="Map legend">
    <h2 class="legend-title"><em>Legend</em></h2>

    <section class="legend-group">
      <h3 class="legend-subtitle"><u>Modeled Landslides</u></h3>
      <ul class="legend-list">
        <li class="legend-item">
          <span class="swatch box red"></span>
          <span class="label">Initiation</span>
        </li>
        <li class="legend-item">
          <span class="swatch box yellow"></span>
          <span class="label">Runout</span>
        </li>
      </ul>
    </section>

    <section class="legend-group">
      <ul class="legend-list">
        <li class="legend-item">
          <span class="swatch inventory"></span>
          <span class="label"
            >Landslide Inventory<br /><small
              >(Tongass Nat’l Forest)</small
            ></span
          >
        </li>
      </ul>
    </section>

    <section class="legend-group">
      <ul class="legend-list">
        <li class="legend-item">
          <span class="line main-road"></span>
          <span class="label">Main Road</span>
        </li>
        <li class="legend-item">
          <span class="line secondary-road"></span>
          <span class="label">Secondary Road</span>
        </li>
        <li class="legend-item">
          <span class="line trail"></span>
          <span class="label">Trail</span>
        </li>
      </ul>
    </section>

    <section class="legend-group">
      <ul class="legend-list">
        <li class="legend-item">
          <span class="line fish-stream"></span>
          <span class="label">Fish-Bearing Stream</span>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script setup lang="ts">
// No props needed, purely presentational.
// If you prefer, you could expose colors/thickness via props later.
</script>

<style scoped>
.legend-card {
  width: 280px;
  background: #fff;
  border: 2px solid #cfd8dc;
  border-radius: 8px;
  padding: 16px 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
  color: #212121;
}

.legend-title {
  font-size: 28px;
  font-weight: 800; /* bold like the screenshot */
  margin: 0 0 8px 0;
}

.legend-subtitle {
  font-size: 18px;
  font-style: italic;
  font-weight: 600;
  margin: 6px 0 8px 0;
}

.legend-group + .legend-group {
  margin-top: 10px;
}

.legend-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.1;
  margin: 10px 0;
}

.label {
  font-size: 16px;
}

.small {
  font-size: 12px;
  color: #555;
}

/* Color boxes (modeled landslides) */
.swatch.box {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.red {
  background: #e53935;
} /* strong red for Initiation */
.yellow {
  background: #e6b24a;
} /* warm sun/yellow for Runout */

/* Inventory: hollow square */
.inventory {
  width: 22px;
  height: 22px;
  border: 3px solid #000;
  border-radius: 3px;
  background: transparent;
  display: inline-block;
}

/* Lines */
.line {
  width: 54px;
  height: 0;
  display: inline-block;
  position: relative;
}

.main-road {
  border-top: 4px solid #b98933; /* gold-ish */
}
.secondary-road {
  border-top: 3px solid #bdbdbd; /* light gray */
}
.trail {
  border-top: 3px dashed #000; /* dashed trail */
}
.fish-stream {
  border-top: 4px solid #1e88e5; /* blue stream */
}

/* Layout on small screens */
@media (max-width: 380px) {
  .legend-card {
    width: 100%;
  }
}
</style>
