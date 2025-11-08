<script setup lang="ts">
defineProps<{ details: any }>()
defineEmits(['close'])
</script>


<template>
    <div class="commit-details-modal">
        <h3>Commit Details ({{ details.sha }})</h3>
        <p><strong>Message:</strong> {{ details.commit.message }}</p>

        <h4>Files Changed:</h4>
        <ul>
        <li v-for="file in details.files" :key="file.filename">
            <p><strong>{{ file.filename }}</strong> — {{ file.changes }} changes</p>
        </li>
        </ul>
        <button @click="$emit('close')">Close</button>
    </div>
</template>