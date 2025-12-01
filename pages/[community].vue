<template>
  <div>
    <div>
      <div>
        <h1>{{ community }}, Alaska</h1>
      </div>
      <div>
        <NuxtLink to="/">Switch Location</NuxtLink>
      </div>
    </div>

    <RiskLevel />
    <Map />
    <Resources />
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from "~/stores/map";
import { VALID_COMMUNITIES, isValidCommunity } from "~/utils/luts";

const route = useRoute();
const mapStore = useMapStore();

const community = route.params.community as string;

if (!isValidCommunity(community)) {
  throw createError({
    statusCode: 404,
    statusMessage: `Community not found. Valid communities are ${VALID_COMMUNITIES.join(
      " and ",
    )}.`,
  });
}

onMounted(() => {
  mapStore.setLocation(community);
});
</script>
