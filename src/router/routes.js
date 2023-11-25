const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/new", component: () => import("pages/CreateBlog.vue") },
      { path: "/edit/:id", component: () => import("pages/CreateBlog.vue") },
      { path: "/view/:id", component: () => import("pages/ViewBlog.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
