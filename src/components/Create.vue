<template>
  <form class="q-pa-lg">
    <q-input v-model="blogTitle" class="q-ma-lg" filled label="Title" />
    <q-card flat bordered class="q-ma-lg">
      <q-editor
        min-height="5rem"
        :placeholder="storyPlaceholder"
        v-model="blogContent"
      />
    </q-card>
    <div class="fit row wrap justify-center items-start content-start">
      <q-btn
        rounded
        color="green"
        size="md"
        label="Publish"
        class="flex-end"
        :disable="!isEnabled"
        @click="newBlog()"
      />
    </div>
  </form>
</template>
<script>
export default {
  name: "CreateBlog",
};
</script>
<script setup>
import { ref, computed } from "vue";
import { createBlog } from "../services/ApiService";
import { useRouter } from "vue-router";

const storyPlaceholder = "Write your story";
const blogTitle = ref("");
const blogContent = ref("");

const router = useRouter();

const isEnabled = computed(() => {
  return blogTitle.value && blogContent.value;
});

const newBlog = async () => {
  const blog = {
    title: blogTitle.value,
    content: blogContent.value,
    created_at: new Date(),
  };
  await createBlog(blog);
  router.push("/");
};
</script>

<style scoped>
.q-card--bordered {
  border: 1px solid rgb(255, 255, 255);
}
</style>
