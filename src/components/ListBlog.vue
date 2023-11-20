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
            flat
            bordered
            v-for="blog in blogList"
            :key="blog.key"
          >
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-overline">{{ blog.created_at }}</div>
                <div class="text-h5 q-mt-sm q-mb-xs text-title">
                  {{ blog.title }}
                </div>
                <div class="text-caption text-grey">
                  {{ blog.content }}
                </div>
              </q-card-section>

              <q-card-section class="col-5 flex flex-center">
                <q-img
                  class="rounded-borders"
                  src="https://cdn.quasar.dev/img/parallax2.jpg"
                ></q-img>
              </q-card-section>
            </q-card-section>

            <q-separator></q-separator>

            <div class="row">
              <q-card-actions class="action">
                <q-btn flat round icon="thumb_up" color="grey-7"></q-btn>
                <q-btn flat round icon="favorite" color="grey-7"> </q-btn>
              </q-card-actions>
              <q-card-actions class="action">
                <router-link :to="'/edit/' + blog.id"
                  ><q-btn flat round icon="edit" color="grey-7"></q-btn
                ></router-link>
                <q-btn
                  flat
                  round
                  icon="delete"
                  @click="deleteBlogByID(blog.id)"
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
import { getBlogs, deleteBlog } from "src/services/ApiService";
const tab = ref("For you");
const blogList = ref([]);
const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  blogList.value = await getBlogs();
  isLoading.value = false;
});

const deleteBlogByID = async (id) => {
  await deleteBlog(id);
  blogList.value = await getBlogs();
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
