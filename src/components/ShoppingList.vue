<template>
  <div>
    <div class="left_content">
      <div class="heading">
        <h1>Shopping List</h1>
        <input autofocus id="task" v-model="newTodo" class="input_task" placeholder="Add a new list"
          @keyup.enter="addTodo">
        <button @click="addTodo" class="add_button pointer">Add</button>
        <ul>
          <li v-for="(mainItem, mainIndex) in shoppingLists" :key="mainItem.id" class="choose_task">
            <a :href="`/shopping-lists/${mainItem.id}`" @click.prevent="navigate(mainItem)" class="pointer">
              {{ mainItem.title }}
            </a>
            <button @click="deleteMainItem(mainIndex)" class="x_button_left pointer">X</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="right_content">
      <div v-if="!shoppingLists">
        <p>Nacitavam data</p>
      </div>

      <div v-else-if="shoppingLists.error">
        <p>Pri načítaní dát nastala chyba: {{ shoppingLists.error }}</p>
      </div>

      <div v-else>
        <div class="heading_right">
          <h1>
            All Lists
          </h1>
        </div>
        <ul>
          <li v-for="(mainItem, mainIndex) in shoppingLists" :key="mainItem.id">
            <div class="item_container">
              <div class="navigate_item">
                <a :href="'/shopping-lists/' + mainItem.id" @click.prevent="navigate(mainItem)">
                  <p class="item_title">
                    {{ mainItem.title }}
                  </p>
                </a>
                <button @click="deleteMainItem(mainIndex)" class="x_button_right pointer">X</button>
              </div>
              <ul class="item_interior">
                <li v-for="(subItem, subIndex) in mainItem.items" :key="subIndex" class="item_names">
                  <span :class="{'line_through' : subItem.is_checked}">
                    {{ subItem.name }} - {{ mainItem.items[subIndex].value }} {{ mainItem.items[subIndex].unit }}
                  </span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ShoppingList',
  props: {
    msg: String,
  },
  data() {
    return {
      newTodo: null,
      shoppingLists: null,
    };
  },
  async mounted() {
    try {
      const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists');
      this.shoppingLists = shoppingLists;
      console.log(this.shoppingLists)
    } catch (error) {
      console.error('Error:', error);
      this.shoppingLists = { error };
    }
  },
  computed: {
    reversedShoppingLists() {
      if (this.shoppingLists && this.shoppingLists.length > 0) {
        console.log("reversed:", this.shoppingLists.slice().reverse())
        return this.shoppingLists.slice().reverse();
      }
      return [];
    },
  },
  methods: {
    async addTodo() {
      if (this.newTodo == '') return;

      try {
        const newMainTask = await axios.post('/api/v1/shopping-lists', {
          title: this.newTodo,
        });

        const newTask = newMainTask.data.data;

        this.shoppingLists.unshift(newTask);
        this.reversedShoppingLists.unshift(newTask);

        this.newTodo = '';
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async deleteMainItem(mainIndex) {
      const taskToDelete = this.shoppingLists[mainIndex];

      try {
        await axios.delete(`/api/v1/shopping-lists/${taskToDelete.id}`);
        this.shoppingLists.splice(mainIndex, 1);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    navigate(mainItem) {
      console.log(mainItem.id);
      this.$router.push({ name: 'Detail', params: { id: mainItem.id } });
    }
  },
};
</script>



<style>

h3 {
  margin: 40px 0 0;
}

ul {
  list-style: none;
  text-align: center;
  justify-content: center;
  padding: 0;
}

li {

  display: flex;
  align-items: center;
  padding: 5px;
  color: antiquewhite;

}

a {
  color: white;
  text-decoration: none;
}

.heading {
  color: white;
  text-align: left;
}

.input_task {
  padding: 10px;
  border-radius: 8px;
  border: none;
}

.add_button {
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  margin: 15px;
}

.x_button_left {
  padding: 2px 5px;
  border: none;
  border-radius: 2px;
  margin-left: 60px;
}

.x_button_right {
  padding: 2px 5px;
  border: none;
  border-radius: 2px;
  margin-left: 50px;
}

.item_title {
  font-size: 25px;
  color: #111111;
  justify-content: center;
  flex: 1;
  margin-left: 15px;
}

.item_names {
  margin: 0px 0px 10px 10px;
  color: #111111;
}

.item_container {
  margin-bottom: 10px;
  text-align: center;
  margin-left: 55px;
  border-style: solid;
  border-width: 6px;
  border-radius: 15px;
  background-color: white;
  border-color: #111111;
  color: #111111;
  width: 40rem;
}

.left_content {
  float: left;
  width: 30%;
  padding-left: 38px;
  box-sizing: border-box;
  padding-bottom: 100vh;
  border-style: solid;
  border-width: 10px;
  border-radius: 15px;
  border-color: #111111;
  background-color: #111111;
}

.right_content {
  float: right;
  width: 70%;
  box-sizing: border-box;
}

.choose_task {
  margin-top: 10px;
}

.heading_right {
  margin-left: 55px;
  color: white;
}

.navigate_item {
  display: flex;
  align-items: center;
}

.pointer {
  cursor: pointer;
}

.line_through {
  text-decoration: line-through;
}

</style>