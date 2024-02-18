<script lang="ts" setup>
defineProps<{
    lang_inactive: string,
    lang_selected: string
}>()
</script>
<template>
    <div class="lang-switch">
        <div class="lang-switch__switcher">
            <span class="lang-switch__toggler">
                {{ lang_selected }}
            </span>
            <span class="lang-switch__lang">
                {{ lang_inactive }}
            </span>
        </div>
    </div>
</template>