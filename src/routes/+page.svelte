<script>
  import TopBar from '../components/TopBar.svelte';
  import IconList from '../components/IconList.svelte';
  import IconCustomizer from '../components/IconCustomizer.svelte';
  import Footer from '../components/Footer.svelte';
</script>

<main>
  <TopBar />
  <div class="container">
    <IconList />
    <IconCustomizer />
  </div>
  <Footer />
</main>

<style>
  .container {
    display: flex;
    padding: 20px;
    background-color: #222;
  }
</style>