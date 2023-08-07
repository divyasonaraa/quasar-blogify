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
        :label="editMode ? 'Update' : 'Publish'"
        class="flex-end"
        :disable="!isEnabled"
        @click="editMode ? updateBlog() : createBlog()"
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
import { ref, computed, onMounted } from "vue";
import {
  createBlog as createBlogApi,
  getBlog,
  updateBlog as updateBlogApi,
} from "../services/ApiService";
import { useRouter } from "vue-router";

const storyPlaceholder = "Write your story";
const blogTitle = ref("");
const blogContent = ref("");
const editMode = ref(false); // Add edit mode state
const blogId = ref(null); // Add blog ID for editing
const router = useRouter();

const isEnabled = computed(() => {
  return blogTitle.value && blogContent.value;
});

const createBlog = async () => {
  const blog = {
    title: blogTitle.value,
    content: blogContent.value,
    created_at: new Date(),
  };
  await createBlogApi(blog);
  router.push("/");
};

const updateBlog = async () => {
  const updatedBlog = {
    id: blogId.value,
    title: blogTitle.value,
    content: blogContent.value,
  };
  await updateBlogApi(updatedBlog);
  router.push("/");
};

onMounted(async () => {
  // Fetch blog data if in edit mode
  if (router.currentRoute.value.params.id) {
    editMode.value = true;
    blogId.value = router.currentRoute.value.params.id;
  }
  if (editMode.value) {
    const blogData = await getBlog(blogId.value);
    blogTitle.value = blogData.title;
    blogContent.value = blogData.content;
  }
});
</script>

<style scoped>
.q-card--bordered {
  border: 1px solid rgb(255, 255, 255);
}
</style>
