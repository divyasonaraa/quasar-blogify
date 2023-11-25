<template>
  <q-page class="q-pa-md">
    <q-btn
      class="q-mb-md"
      color="grey-7"
      push
      href="/"
      icon="arrow_back"
      label="Back"
    />

    <q-row justify="center">
      <q-col class="my-card">
        <q-card>
          <img :src="blog.image_url" />

          <q-card-section>
            <div class="text-h6">{{ blog.title }}</div>
            <div class="text-subtitle2">{{ blog.created_at }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            {{ blog.content }}
          </q-card-section>
        </q-card>
      </q-col>
    </q-row>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getBlog } from "../services/ApiService";

const blog = ref({});
const props = defineProps(["blogID"]);

onMounted(async () => {
  blog.value = await getBlog(props.blogID);
});
</script>
