import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/Home.vue'
import RepoView from '@/views/RepoView.vue'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: HomeView,
	},
	{
		path: '/repos/:username', // Dynamic route
		name: 'Repo',
		component: RepoView,
		props: true, // Pass username
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})

export default router
