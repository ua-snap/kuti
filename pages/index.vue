<template>
  <div>
    <h1>Kuti - Home Page</h1>
    <div style="padding: 20px">
      <button
        @click="goToCraig"
        style="
          background: #3273dc;
          color: white;
          padding: 20px 40px;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          margin: 10px;
          cursor: pointer;
          min-width: 200px;
          min-height: 80px;
        "
      >
        I'm in Craig
      </button>
      <button
        @click="goToKassan"
        style="
          background: #23d160;
          color: white;
          padding: 20px 40px;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          margin: 10px;
          cursor: pointer;
          min-width: 200px;
          min-height: 80px;
        "
      >
        I'm in Kassan
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Home",
});

const goToCraig = () => {
  navigateTo("/craig");
};

const goToKassan = () => {
  navigateTo("/kassan");
};
</script>
