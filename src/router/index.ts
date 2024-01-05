import {createRouter, createWebHashHistory, RouteRecordRaw, RouterOptions} from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "index",
        redirect: '/dashboard',
        meta: {
            // 是否缓存数据
            keepAlive: true
        }
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/Index.vue"),
        children:
            [
                {
                    path: '/dashboard',
                    redirect: 'dashboard/home',
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: '/home',
                    name: 'home',
                    component: () => import("@/views/home/Index.vue"),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import("@/views/user/Index.vue"),
                    meta: {
                        keepAlive: true
                    },
                },
                {
                    path: '/author',
                    name: 'author',
                    component: () => import("@/views/user/components/author/Index.vue"),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: '/mall',
                    name: 'mall',
                    component: () => import("@/views/mall/Index.vue"),
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: '/goods/:goodsId',
                    name: 'goods',
                    component: () => import("@/views/mall/goods/detail/Index.vue")
                },
                {
                    path: '/user/myorders',
                    name: 'myorders',
                    component: () => import("@/views/user/myorders/Index.vue"),
                    meta: {
                        keepAlive: true
                    },
                },
                {
                    path: '/user/address',
                    name: 'address',
                    component: () => import("@/views/user/address/Index.vue"),
                    children:
                        [
                            {
                                path: 'add',
                                name: 'addAddress',
                                component: () => import("@/views/user/address/Add.vue"),
                                meta: {
                                    keepAlive: true
                                }
                            },
                            {
                                path: 'edit',
                                name: 'editAddress',
                                component: () => import("@/views/user/address/Edit.vue"),
                                meta: {
                                    keepAlive: true
                                }
                            },
                        ]
                },
            ]
    }


];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    scrollBehavior: () => ({y: 0}),
} as RouterOptions);

export default router;


