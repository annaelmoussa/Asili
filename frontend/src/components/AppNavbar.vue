<template>
  <nav class="navbar">
    <a href="#proteins">{{ $t('app.navbar.proteins') }}</a>
    <a href="#snacks">{{ $t('app.navbar.snacks') }}</a>
    <a href="#clothing">{{ $t('app.navbar.clothing') }}</a>
    <a href="#creatines">{{ $t('app.navbar.creatines') }}</a>
    <a href="#vitamins">{{ $t('app.navbar.vitamins') }}</a>
    <a href="#vegan">{{ $t('app.navbar.vegan') }}</a>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.navbar a {
  margin: 0 10px;
  color: #333;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.navbar a:hover {
  background-color: #10b981;
  color: white;
}
</style>
