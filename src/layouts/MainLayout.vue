<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8">
      <q-toolbar
        class="GPL__toolbar"
        :style="{ height: isMobile ? '56px' : '64px' }"
      >
        <q-icon name="join_left" size="xl"></q-icon>
        <span class="text-grand-hotel">Blogify</span>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-icon
            name="add_circle"
            size="lg"
            color="green"
            @click="redirectToNewRoute"
          ></q-icon>
          <q-btn round dense flat color="grey-8" icon="notifications">
            <q-badge color="red" text-color="white" floating>2</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
            <q-tooltip>Account</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer elevated reveal class="bg-grey-8" bordered>
      <div class="constrain">
        <q-banner inline-actions dense class="bg-grey-8 text-white">
          <b>Install Blogify? </b>
          <template v-slot:avatar>
            <q-avatar
              color="grey-9"
              text-color="white"
              icon="join_left"
              font-size="22px"
            ></q-avatar>
          </template>
          <template v-slot:action>
            <q-btn flat label="Yes" dense class="q-px-sm" @click="installApp" />
            <q-btn
              flat
              label="Later"
              dense
              class="q-px-sm"
              @click="showInsatllbanner = false"
            />
            <q-btn
              flat
              label="Never"
              dense
              class="q-px-sm"
              @click="neverShowInstallAppBanner"
            />
          </template>
        </q-banner>
      </div>
    </q-footer>

    <q-page-container class="GPL__page-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
const router = useRouter();
const showInsatllbanner = ref(false);
const $q = useQuasar();
let deferredPrompt;

onMounted(() => {
  let neverShowInstallBanner = $q.localStorage.getItem(
    "neverShowInstallBanner"
  );
  if (!neverShowInstallBanner) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInsatllbanner.value = true;
      setTimeout(() => {
        showInsatllbanner.value = true;
      }, 3000);
    });
  }
});

const installApp = () => {
  // Hide the app provided install promotion
  showInsatllbanner.value = false;

  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      neverShowAppInstallBanner();
    } else {
      console.log("User dismissed the install prompt");
    }
  });
};

const neverShowInstallAppBanner = () => {
  showInsatllbanner.value = false;
  $q.localStorage.set("neverShowInstallBanner", true);
};
const redirectToNewRoute = () => {
  router.push("/new");
};
</script>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px
    padding: 30px 300px

  &__toolbar-input
    width: 35%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368

    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px

  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500

  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>
