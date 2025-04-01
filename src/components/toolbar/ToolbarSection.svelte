<script lang="ts">
	export let title: string = "";
</script>

<div class="flex flex-col gap-3">
	<span>{title}</span>
	<slot />
</div>
