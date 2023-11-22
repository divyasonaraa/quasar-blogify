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
        @click="editMode ? updateBlog() : createBlog(blogTitle, blogContent)"
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
import { uid } from "quasar";
import {
  createBlog as createBlogApi,
  getBlog,
  updateBlog as updateBlogApi,
} from "../services/ApiService";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const storyPlaceholder = "Write your story";
const blogTitle = ref("");
const blogContent = ref("");
const editMode = ref(false); // Add edit mode state
const blogId = ref(null); // Add blog ID for editing
const router = useRouter();
const $q = useQuasar();

const isEnabled = computed(() => {
  return blogTitle.value && blogContent.value;
});

const createBlog = async (blogTitle, blogContent) => {
  try {
    const formData = new FormData();
    formData.append("id", uid());
    formData.append("title", blogTitle);
    formData.append("content", blogContent);
    formData.append("liked", false);
    formData.append("thumps_up", false);
    formData.append("created_at", Date.now());
    formData.append("updated_at", Date.now());

    // Show loading indicator
    $q.loading.show();

    // Make API call to create a blog
    const response = await createBlogApi(formData);

    // Hide loading indicator
    $q.loading.hide();

    // Notify user about successful blog creation
    $q.notify({
      message: "Blog Created Successfully!",
      type: "positive",
      timeout: 2000,
    });

    // Redirect to home page
    router.push("/");
  } catch (error) {
    console.error("Error creating blog:", error);

    // Check if the error is a network error
    if (!navigator.onLine && isBackgroundSyncSupported.value) {
      // Notify user about successful blog creation
      $q.notify({
        message: "Offline Blog Created Successfully!",
        type: "positive",
        timeout: 2000,
      });
      // Redirect to the home page
      router.push("/");
    } else {
      // Notify user about the error
      $q.notify({
        message: "Error creating blog. Please try again.",
        type: "negative",
        timeout: 2000,
      });
    }
  }
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

//computed

const isBackgroundSyncSupported = computed(() => {
  return "serviceWorker" in navigator && "SyncManager" in window ? true : false;
});
</script>

<style scoped>
.q-card--bordered {
  border: 1px solid rgb(255, 255, 255);
}
</style>
