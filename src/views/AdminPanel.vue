<template>
  <div>
      <h1>Admin panel</h1>
  </div>
</template>

<script>
export default {
    name: 'AdminPanel',
    mounted() {
        if(this.$store.state.user.role !== 'Admin') {
            this.$router.push("/").catch(()=>{});
        }
    }
}
</script>

<style>

</style>