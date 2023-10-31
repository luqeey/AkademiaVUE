<template>
  <div>
    <div class="left-content">
      <div class="heading">
        <h1>Shopping List</h1>
        <input autofocus id="task" v-model="newTodo" class="input_task" placeholder="Add a new todo" @keyup.enter="addTodo">
        <button @click="addTodo" class="add_button">Add</button>
        <ul>
          <li v-for="(mainItem, mainIndex) in shoppingLists" :key="mainItem.id" class="choose_task">
            <a href="'/shopping-lists/' + mainItem.id" @click.prevent="navigate(mainItem)">
              {{ mainItem.title }}
            </a>
            <button @click="deleteMainItem(mainIndex)" class="x_button">X</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="right-content">
      <template v-if="!shoppingLists">
        <p>Nacitavam data</p>
      </template>

      <template v-else-if="shoppingLists.error">
        <p>Pri načítaní dát nastala chyba: {{ shoppingLists.error }}</p>
      </template>

      <template v-else>
        <div class="heading_right">
          <h1>
            All Tasks
          </h1>
        </div>
        <ul>
          <li v-for="(mainItem, mainIndex) in shoppingLists" :key="mainItem.id">
            <div class="item-container">
              <p class="item_title">
                <a href="'/shopping-lists/' + mainItem.id" @click.prevent="navigate(mainItem)">
                  {{ mainItem.title }}
                </a>
                <button @click="deleteMainItem(mainIndex)" class="x_button">X</button>
              </p>
              <ul>
                <li v-for="(subItem, subIndex) in mainItem.items" :key="subIndex" class="item_names">
                  {{ subItem.name }}
                </li>
              </ul>
            </div>  
          </li>
        </ul>
      </template>
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
  methods: {
    async addTodo() {
      if (this.newTodo == '') return
      
      try {
        const newMainTask = await axios.post('/api/v1/shopping-lists', {
          title: this.newTodo,
        });
        
        const newTask = newMainTask.data.data;
        this.shoppingLists.push(newTask);

        console.log(this.shoppingLists)
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
  color: antiquewhite;
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

.x_button {
  padding: 2px 5px;
  border: none;
  border-radius: 2px;
  margin-left: 15px;
}

.deleted_tasks {
  margin-top: 200px;
}

.delete_deleted_button {
  padding: 2px 5px;
  border: none;
  border-radius: 2px;
  margin-left: 15px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.item_title {
  font-size: 25px;
  color: white;
  justify-content: center;
}

.item_names {
  margin: 0;
}

.item-container {
  margin-bottom: 10px;
  text-align: center; 
  max-width: 600px;
  margin-left: 50px;
  border-style: solid;
  border-width: 10px;
  border-color: black;
  padding-right: 500px;
}

.left-content {
  float: left;
  width: 30%;
  padding-left: 38px;
  box-sizing: border-box;
  padding-bottom: 100vh;
  border-style: solid;
  border-width: 10px;
  border-radius: 15px;
  border-color: black;
}

.right-content {
  float: right;
  width: 70%;
  box-sizing: border-box;
}

.choose_task {
  margin-top: 10px;
}

.heading_right {
  margin-left: 55px;
  border-style: solid;
  border-width: 10px;
  border-color: black;
}
</style>