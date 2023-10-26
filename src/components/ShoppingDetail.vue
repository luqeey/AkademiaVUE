<template>
  <div>
    <div class="detail_title">
      <p>{{ mainItem ? mainItem.title : 'Item not found' }}</p>
    </div>
    <div class="detail_tasks">
      <input type="text" v-model="detailTodo" class="detail_task" placeholder="Add a new item" @keyup.enter="addDetail">
        <ul v-if="mainItem && mainItem.items">
          <li v-for="(item, index) in mainItem.items" :key="index">{{ item.name }}</li>
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
      detailTodo: [],
    }
  },
  async mounted() {
    try {
      const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists')
      this.mainItem = shoppingLists.find(({ id }) => id == this.$route.params.id)
    } catch (error) {
      console.error('Error:', error)
      this.mainItem = { error }
    }
  },
  methods: {
    async addDetail() {
      if (this.detailTodo === '') return;

      try {
        const itemId = this.mainItem.id;
        console.log(itemId)
        const newItem = await axios.post(`/api/v1/shopping-lists/${this.$route.params.id}/items/${ itemId }`, {
          name: this.detailTodo,
        });

        if (!this.mainItem.items) {
          this.mainItem.items = [];
        }

        this.mainItem.items.push(newItem.data.data);
        this.detailTodo = '';
      } catch (error) {
        console.error('Error adding item:', error);
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

  