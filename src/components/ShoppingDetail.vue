<template>
  <div>
    <div class="detail_title">
      <p>{{ mainItem ? mainItem.title : 'Item not found' }}</p>
    </div>
    <div class="detail_tasks">
      <input type="text" v-model="detailTodo" class="detail_task" placeholder="Add a new item" @keyup.enter="addDetail">
      <button @click="addDetail" class="detail_button">Add</button>
      <ul v-if="mainItem && mainItem.items">
        <li v-for="(item, index) in mainItem.items" :key="index">{{ item.name }}
          <button @click="deleteItem(index)" class="x_item_button">X</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShoppingDetail',
  data() {
    return {
      mainItem: null,
      detailTodo: '', 
    }
  },
  async mounted() {
    try {
      const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists');
      this.mainItem = shoppingLists.find(({ id }) => id == this.$route.params.id);
    } catch (error) {
      console.error('Error:', error);
      this.mainItem = { error };
    }
  },
  methods: {
    async addDetail() {
      if (this.detailTodo === '') return;

      try {
        const newItemData = {
          name: this.detailTodo,
          value: 0,
          unit: 'units',
          is_checked: false,
        };

        const response = await axios.post(`/api/v1/shopping-lists/${this.$route.params.id}/items`, newItemData);

        if (!this.mainItem.items) {
          this.mainItem.items = [];
        }

        this.mainItem.items.push(response.data.data);
        this.detailTodo = '';
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }, 
    async deleteItem(index) {
      const itemToDelete = this.mainItem.items[index]

      try {
        await axios.delete(`/api/v1/shopping-lists/${this.mainItem.id}/items/${itemToDelete.id}`)
        this.mainItem.items.splice(index, 1)
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }
}
</script>




<style>
.detail_title {
  color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
}

.detail_tasks {
  color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
</style>

  