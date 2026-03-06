<template>
  <table aria-label="Map legend">
    <thead>
      <tr>
        <th colspan="2">Legend</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="swatch-initiation"></span></td>
        <td>Modeled Landslides - Initiation</td>
      </tr>
      <tr>
        <td><span class="swatch-runout"></span></td>
        <td>Modeled Landslides - Runout</td>
      </tr>

      <tr>
        <td><span class="swatch-inventory"></span></td>
        <td>Landslide Inventory - Tongass National Forest</td>
      </tr>

      <tr>
        <td><span class="line-main-road"></span></td>
        <td>Main Road</td>
      </tr>

      <tr>
        <td><span class="line-fish-stream"></span></td>
        <td>Fish-Bearing Stream</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
table {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

th {
  height: 2.5rem;
}
td {
  height: 2.5rem;
}

%swatch-base {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 1px solid #000;
  margin-right: 0.5rem;
}

%line-base {
  display: inline-block;
  width: 30px;
  height: 4px;
  border-radius: 2px;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.swatch {
  &-initiation {
    @extend %swatch-base;
    background-color: red;
  }
  &-runout {
    @extend %swatch-base;
    background-color: yellow;
  }
  &-inventory {
    @extend %swatch-base;
    background-color: #cccccc;
  }
}

.line {
  &-main-road {
    @extend %line-base;
    background-color: #333;
  }
  &-fish-stream {
    @extend %line-base;
    background-color: #3399ff;
  }
}
</style>
