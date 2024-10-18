<script lang="ts">
    export let title: string = '';
</script>

<div class="flex flex-col gap-3">
    <h7 class="h7">{title}</h7>
    <slot />
</div>