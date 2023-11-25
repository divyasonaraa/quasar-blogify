<template>
  <MainContainer>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div
        v-if="showNotificationsBanner && pushNotificationsSupported"
        class="banner-container bg-primary"
      >
        <div class="constrain">
          <q-banner class="bg-grey-3 q-mb-md" inline-actions>
            <template v-slot:avatar>
              <q-icon name="notifications" color="primary" />
            </template>

            Would you like to enable notifications?

            <template v-slot:action>
              <q-btn
                @click="enableNotifications"
                label="Yes"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
              <q-btn
                @click="showNotificationsBanner = false"
                label="Later"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
              <q-btn
                @click="neverShowNotificationsBanner"
                label="Never"
                color="primary"
                class="q-px-sm"
                dense
                flat
              />
            </template>
          </q-banner>
        </div>
      </div>
    </transition>
    <BlogList />
  </MainContainer>
</template>

<script setup>
//imports
import { ref, onMounted, computed } from "vue";
import BlogList from "src/components/ListBlog.vue";
import MainContainer from "src/components/MainContainer.vue";
import { useQuasar } from "quasar";
import { createSubscription } from "../services/ApiService";
import qs from "qs";

//variables
const showNotificationsBanner = ref(false);
const $q = useQuasar();

//lifecycle hooks
onMounted(() => {
  initNotificationBanner();
});

//methods
const initNotificationBanner = () => {
  let neverShowNotificationsBanner = $q.localStorage.getItem(
    "neverShowNotificationsBanner"
  );

  if (!neverShowNotificationsBanner) {
    showNotificationsBanner.value = true;
  }
};
const enableNotifications = () => {
  console.log("Called enableNotifications");
  if (pushNotificationsSupported.value) {
    Notification.requestPermission((result) => {
      console.log("result", result);
      neverShowNotificationsBanner();
      if (result == "granted") {
        checkForExistingPushSubscription();
      }
    });
  }
};
const checkForExistingPushSubscription = () => {
  if (serviceWorkerSupported.value && pushNotificationsSupported.value) {
    let reg;
    navigator.serviceWorker.ready
      .then((swreg) => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then((sub) => {
        if (!sub) {
          createPushSubscription(reg);
        }
      });
  }
};
const createPushSubscription = (reg) => {
  let vapidPublicKey =
    "BD8DlhHwtd972rgpTjMPotAUlZ-AWi8wxA3R4UUen0wmsqDHsyep-fGzbXjnbgb7sS4PAmdjgvyLLCFPiKTlI5w";
  let vapidPublicKeyConverted = urlBase64ToUint8Array(vapidPublicKey);
  reg.pushManager
    .subscribe({
      applicationServerKey: vapidPublicKeyConverted,
      userVisibleOnly: true,
    })
    .then((newSub) => {
      console.log("newSub", newSub);
      let newSubData = newSub.toJSON(),
        newSubDataQS = qs.stringify(newSubData);
      return createSubscription(newSubDataQS);
    })
    .then((response) => {
      displayGrantedNotification();
    })
    .catch((err) => {
      console.log("err: ", err);
    });
};
const displayGrantedNotification = () => {
  if (serviceWorkerSupported.value && pushNotificationsSupported.value) {
    navigator.serviceWorker.ready.then((swreg) => {
      swreg.showNotification("You're subscribed to notifications!", {
        body: "Thanks for subscribing!",
        icon: "icons/icon-128x128.png",
        image: "icons/icon-128x128.png",
        badge: "icons/icon-128x128.png",
        dir: "ltr",
        lang: "en-US",
        vibrate: [100, 50, 200],
        tag: "confirm-notification",
        renotify: true,
      });
    });
  }
};
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
const neverShowNotificationsBanner = () => {
  showNotificationsBanner.value = false;
  $q.localStorage.set("neverShowNotificationsBanner", true);
};

//computed
const pushNotificationsSupported = computed(() => {
  return "PushManager" in window ? true : false;
});

const serviceWorkerSupported = computed(() => {
  return "serviceWorker" in navigator ? true : false;
});
</script>
<style>
.container {
  min-height: 400px;
  width: 80%;
  padding: 70px;
}
</style>
