<script setup lang="ts">
import type { GithubCommit } from '@/types/interfaces'
defineProps<{ favourites: GithubCommit[] }>()
</script>

<template>
    <section class="favourites-section">
        <h2>Favourite Commits</h2>
        <ul>
        <li v-for="fav in favourites" :key="fav.sha">
            <strong>{{ fav.commit.message }}</strong> — {{ fav.commit.author.name }}
        </li>
        </ul>
    </section>
</template>
