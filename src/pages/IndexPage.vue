<template>
  <MainContainer>
    <BlogList />
  </MainContainer>
</template>

<script>
import BlogList from "src/components/ListBlog.vue";
import MainContainer from "src/components/MainContainer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    BlogList,
    MainContainer,
  },
});
</script>
<style>
.container {
  min-height: 400px;
  width: 80%;
  padding: 70px;
}
</style>
