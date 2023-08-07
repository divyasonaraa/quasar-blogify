<template>
  <MainContainer>
    <CreateBlog />
  </MainContainer>
</template>

<script>
import CreateBlog from "src/components/Create.vue";
import MainContainer from "src/components/MainContainer.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    CreateBlog,
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
