<template>
  <MainContainer>
    <ViewBlog :blogID="route.params.id" />
  </MainContainer>
</template>

<script setup>
import ViewBlog from "src/components/ViewBlog.vue";
import MainContainer from "src/components/MainContainer.vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style>
.container {
  min-height: 400px;
  width: 80%;
  padding: 70px;
}
</style>
