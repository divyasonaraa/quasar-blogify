<template>
  <div class="q-gutter-y-md" style="max-width: 600px">
    <q-tabs
      dense
      class="text-grey"
      active-color="black"
      indicator-color="black"
      align="left"
      narrow-indicator
      v-model="tab"
    >
      <q-tab name="For you" label="For you"></q-tab>
    </q-tabs>

    <q-separator size="xl"></q-separator>
  </div>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md row q-gutter-md">
      <div class="col-12">
        <template v-if="!isLoading && blogList.length">
          <q-card
            class="my-card q-ma-lg"
            :class="{ 'bg-red-1': blog.offline }"
            flat
            bordered
            v-for="blog in blogList"
            :key="blog.key"
            @click="redirectToBlog(blog.id)"
          >
            <q-card-section horizontal>
              <q-badge
                v-if="blog.offline"
                class="absolute-top-right"
                color="red"
                >Stored offline</q-badge
              >
              <q-card-section class="q-pt-xs">
                <div class="text-overline">
                  {{ niceDate(blog.created_at) }}
                </div>
                <div class="text-h5 q-mt-sm q-mb-xs text-title">
                  {{ blog.title }}
                </div>
                <div
                  v-html="blog.content"
                  class="text-caption text-grey ellipsis-3-lines"
                ></div>
              </q-card-section>

              <q-card-section class="col-5 flex flex-center">
                <q-img class="rounded-borders" :src="blog.image_url"></q-img>
              </q-card-section>
            </q-card-section>
            <q-separator></q-separator>

            <div class="row">
              <q-card-actions class="action">
                <q-btn
                  flat
                  round
                  icon="thumb_up"
                  :color="blog.liked ? 'grey-7' : 'green'"
                  @click.stop="toggleLike(blog.id)"
                ></q-btn>
                <q-btn
                  flat
                  round
                  icon="favorite"
                  :color="blog.favorite ? 'grey-7' : 'red'"
                  @click.stop="toggleFavorite(blog.id)"
                ></q-btn>
              </q-card-actions>
              <q-card-actions class="action">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="grey-7"
                  @click.stop="editBlog(blog.id)"
                ></q-btn>
                <q-btn
                  flat
                  round
                  icon="delete"
                  @click.stop="deleteBlogByID(blog.id)"
                  color="grey-7"
                >
                </q-btn>
              </q-card-actions>
            </div>
          </q-card>
        </template>
        <template v-else-if="!isLoading && !blogList.length">
          <div class="text-center text-grey">No Blogs Yet.</div>
        </template>
        <template v-else>
          <q-card>
            <q-item>
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square />

            <q-card-actions align="right" class="q-gutter-md">
              <q-skeleton type="QBtn" />
              <q-skeleton type="QBtn" />
            </q-card-actions>
          </q-card>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import {
  getBlogs,
  deleteBlog,
  addToFavoriteBlog,
  likeBlog,
} from "src/services/ApiService";
import { openDB } from "idb";
import { useQuasar, date } from "quasar";
import { useRouter } from "vue-router";

const tab = ref("For you");
const blogList = ref([]);
const isLoading = ref(false);
const $q = useQuasar();
const router = useRouter();

onMounted(async () => {
  getBlogList();
  listenForOfflinePostUploaded();
});

const getBlogList = async () => {
  isLoading.value = true;

  try {
    blogList.value = await getBlogs();
    isLoading.value = false;

    if (!navigator.onLine) {
      getOfflineBlogs();
    }
  } catch (error) {
    $q.notify({
      message: "Could not download blogs." + error,
      type: "negative",
      timeout: 2000,
    });
    isLoading.value = false;
  }
};
const deleteBlogByID = async (id) => {
  await deleteBlog(id);
  blogList.value = await getBlogs();
};

const getOfflineBlogs = async () => {
  let db = await openDB("workbox-background-sync");
  try {
    const failedRequests = await db.getAll("requests");
    for (const failedRequest of failedRequests) {
      if (failedRequest.queueName == "createBlogQueue") {
        let request = new Request(
          failedRequest.requestData.url,
          failedRequest.requestData
        );
        request.formData().then((formData) => {
          const offlineBlog = {
            id: formData.get("id"),
            title: formData.get("title"),
            content: formData.get("content"),
            liked: formData.get("liked"),
            favorite: formData.get("favorite"),
            created_at: formData.get("created_at"),
            updated_at: formData.get("updated_at"),
            offline: true,
          };
          blogList.value.unshift(offlineBlog);
        });
      }
    }
  } catch (error) {
    $q.notify({
      message: "Error fetching offline blogs" + error,
      type: "negative",
      timeout: 2000,
    });
  }
};

const listenForOfflinePostUploaded = () => {
  if ("serviceWorker" in navigator) {
    const channel = new BroadcastChannel("sw-messages");
    channel.addEventListener("message", (event) => {
      if (event.data.msg === "offline-post-uploaded") {
        const offlineBlogs = blogList.value.filter((blog) => blog.offline);
        if (offlineBlogs.length > 0) {
          const lastOfflineBlog = offlineBlogs[offlineBlogs.length - 1];
          lastOfflineBlog.offline = false;
        }
      }
    });
  }
};

const toggleLike = async (blogId) => {
  try {
    await likeBlog(blogId);
    const blogIndex = blogList.value.findIndex((blog) => blog.id === blogId);
    blogList.value[blogIndex].liked = !blogList.value[blogIndex].liked;
  } catch (error) {
    $q.notify({
      message: "Error toggling like status:" + error,
      type: "negative",
      timeout: 2000,
    });
  }
};

const toggleFavorite = async (blogId) => {
  try {
    await addToFavoriteBlog(blogId);
    const blogIndex = blogList.value.findIndex((blog) => blog.id === blogId);
    blogList.value[blogIndex].favorite = !blogList.value[blogIndex].favorite;
  } catch (error) {
    $q.notify({
      message: "Error toggling favorite status:" + error,
      type: "negative",
      timeout: 2000,
    });
  }
};

const redirectToBlog = (id) => {
  router.push(`/view/${id}`);
};
const editBlog = (id) => {
  router.push(`/edit/${id}`);
};

const niceDate = (value) => {
  return date.formatDate(value, "MMMM D h:mmA");
};
</script>
<style scoped>
.row {
  display: flex;
  justify-content: space-between;
}
.action {
  display: flex;
  justify-content: flex-end;
}
</style>
