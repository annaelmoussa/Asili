<template>
  <section class="banner">
    <h1>{{ $t('app.banner.title') }}</h1>
    <p>{{ $t('app.banner.description') }}</p>
    <button>{{ $t('app.banner.button') }}</button>
  </section>
</template>

<style scoped>
.banner {
  background: url('https://cdn.midjourney.com/e061fa1a-9ae4-4ed8-8301-4323fd33a75f/0_1.png') no-repeat center center;
  background-size: cover;
  padding: 100px 20px;
  color: white;
  text-align: center;
  margin-bottom: 40px;
}

.banner h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
}

.banner p {
  font-size: 1.2em;
}

.banner button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.banner button:hover {
  background-color: #10b981;
}
</style>
