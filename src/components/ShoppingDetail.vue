<template>
  <div>
    <div>
      <a href="/">
        <svg width="80" height="70" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M224 480H864C872.487 480 880.626 483.371 886.627 489.373C892.629 495.374 896 503.513 896 512C896 520.487 892.629 528.626 886.627 534.627C880.626 540.629 872.487 544 864 544H224C215.513 544 207.374 540.629 201.373 534.627C195.371 528.626 192 520.487 192 512C192 503.513 195.371 495.374 201.373 489.373C207.374 483.371 215.513 480 224 480Z" fill="white"/>
          <path d="M237.248 512L502.656 777.344C508.665 783.353 512.04 791.502 512.04 800C512.04 808.498 508.665 816.647 502.656 822.656C496.647 828.665 488.498 832.04 480 832.04C471.502 832.04 463.353 828.665 457.344 822.656L169.344 534.656C166.364 531.683 164 528.152 162.386 524.265C160.773 520.377 159.943 516.209 159.943 512C159.943 507.791 160.773 503.623 162.386 499.735C164 495.848 166.364 492.317 169.344 489.344L457.344 201.344C463.353 195.335 471.502 191.96 480 191.96C488.498 191.96 496.647 195.335 502.656 201.344C508.665 207.353 512.04 215.502 512.04 224C512.04 232.498 508.665 240.647 502.656 246.656L237.248 512Z" fill="white"/>
        </svg>
      </a>
    </div>
    <div class="detail_title">
      <p>{{ mainItem ? mainItem.title : 'Item not found' }}</p>
    </div>
    <div class="detail_tasks">
      <div>
        <input type="text" v-model="detailTodo" class="detail_input" placeholder="Add a new item" @keyup.enter="addDetail">
        <button @click="addDetail" class="detail_button">Add</button>
      </div>
      <div class="item_list" v-if="mainItem && mainItem.items && mainItem.items.length > 0">
        <ul v-if="mainItem && mainItem.items" class="item">
          <li v-for="(item, index) in mainItem.items" :key="index" class="items_description">
            <input type="checkbox" v-model="item.is_checked" @change="updateItemStatus(item)">
            {{ item.name }} - 
            <span v-if="!item.editing"> {{ item.value }} {{ item.unit === 'custom' ? item.customUnit : item.unit }} </span>
            <span v-else>
              <div class="specify_amount">
                <input type="text" v-model="item.value" placeholder="Value" class="value_input">
                <div>
                  <select v-model="item.unit" class="detail_select">
                    <option value="package">Package</option>
                    <option value="piece">Piece</option>
                    <option value="grams">Grams</option>
                    <option value="kilograms">Kilograms</option>
                    <option value="custom">Custom</option>
                  </select>
                  <input v-if="item.unit === 'custom'" v-model="item.customUnit" placeholder="Custom Unit" class="custom_input">
                </div>
                <button @click="saveItemEdits(item)" class="save_button">Save</button>
              </div>
            </span>
            <button @click="deleteItem(index)" class="x_item_button">X</button>
            <button @click="editItem(item)" class="edit_button" >Edit</button>
          </li>
        </ul>
      </div>
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
      unitOptions: [
        { value: 'package', label: 'Package' },
        { value: 'piece', label: 'Piece' },
        { value: 'grams', label: 'Grams' },
        { value: 'kilograms', label: 'Kilograms' },
      ], 
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
          value: 1,
          unit: 'piece',
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
    },
    async updateItemStatus(item) {
      try {
        const response = await axios.put(`/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`, {
          is_checked: item.is_checked
        });
        console.log(response)
      } catch (error) {
        console.error('Error updating item status:', error);
      }
    },
    editItem(item) {
      item.editing = true;
    },
    async saveItemEdits(item) {
      try {
        const response = await axios.put(`/api/v1/shopping-lists/${this.$route.params.id}/items/${item.id}`, {
          value: item.value,
          unit: item.unit === 'custom' ? item.customUnit : item.unit
        })  

        console.log(response)
        item.editing = false
      } catch (error) {
        console.error('Error saving item edits:', error)
      }
    },
  }
}
</script>




<style>

.detail_title {
  color: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.detail_tasks {
  color: antiquewhite;
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.detail_input {
  border-radius: 8px;
  padding: 10px;
  border: none;
}

.detail_button {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  margin: 15px;
  background-color: #111111;
  color: white;
}

.item_list {
  text-align: center; 
  border-style: solid;
  border-width: 6px;
  border-radius: 15px;
  background-color: white;
  border-color: #111111;
  color: #111111;
  width: 80%;
  padding: 1rem;
}


.x_item_button {
  padding: 2px 5px;
  border: none;
  border-radius: 2px;
  margin-left: auto;
}

.edit_button {
  padding: 10px 15px;
  border-style: none;
  border-radius: 8px; 
  background-color: #111111;
  color: white;
  margin-left: auto;
}

.items_description {
  color: #111111;
  list-style-type: none;
  justify-content: end;
  align-items: center;
  display: flex;
  padding: 8px;
  border: 1px solid gray;
  border-radius: 10px;
  margin-bottom: 1rem;
}

ul {
  padding: 0 !important;
  margin: 0;
}

.save_button {
  padding: 10px 15px;
  border-style: none;
  border-radius: 8px; 
  background-color: #111111;
  color: white;
  margin-left: 10px;
}

.detail_select {
  padding: 8px;
  border-radius: 8px;
  margin-left: 10px;
}

.custom_input {
  padding: 8px;
  border-radius: 8px;
  margin-left: 10px;
}

.value_input {
  padding: 8px;
  border-radius: 8px;
  margin-left: 10px;
}

.specify_amount {
  display: flex;
  align-items: center;
}

</style>

  