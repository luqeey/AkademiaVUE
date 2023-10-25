<template>
    <div>
      <h1>Detail</h1>
      <p>{{ mainItem ? mainItem.id : 'Item not found' }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    name: 'ShoppingDetail',
    data() {
      return {
        mainItem: null,
        taskDetails: null
      }
    },
    async mounted() {
      try {
        const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists');
        const idToFind = this.$route.params.id;
        this.mainItem = shoppingLists.find(item => item.id == idToFind);
        
        if (!this.mainItem) {
          console.error('Item not found for ID:', idToFind);
        }
      } catch (error) {
        console.error('Error fetching shopping lists:', error);
        this.mainItem = { error };
      }
    }
  }
  </script>
  