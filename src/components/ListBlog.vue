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
              <div class="text-h5 q-mt-sm q-mb-xs">{{ blog.title }}</div>
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
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getBlogs, deleteBlog } from "src/services/ApiService";
const tab = ref("For you");
const blogList = ref();

onMounted(async () => {
  blogList.value = await getBlogs();
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
