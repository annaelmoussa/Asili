<script>
  export default {
    name: 'PanelLayout',
};
  import { Button } from '@/components/ui/button'
  </script>

<template>
  
    <div>
      <nav>
        <!-- Votre code de barre de navigation ici -->
        <ul>
          <li><router-link to="/panel/dashboard">Dashboard</router-link></li>
          <li><router-link to="/panel/users">Users</router-link></li>
          <li><router-link to="/panel/settings">Settings</router-link></li>
          <li><Button>Click me</Button></li>
        </ul>
      </nav>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </template>
<style scoped>
  /* Ajoutez vos styles de barre de navigation ici */
  nav {
    background-color: #333;
    color: white;
    padding: 1rem;
  }
  
  nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
  }
  
  nav a {
    color: white;
    text-decoration: none;
  }
  
  main {
    padding: 2rem;
  }
  </style>
  