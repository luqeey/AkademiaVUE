<template>
  <div class="hello">
    <div class="heading">
      <h1>Nakupny zoznam</h1>
    </div>

    <template v-if="!shoppingLists">
      <p>Nacitavam data</p>
    </template>

    <template v-else-if="shoppingLists.error">
      <p>Pri načítaní dát nastala chyba: {{ shoppingLists.error }}</p>
    </template>

    <template v-else>
      <input autofocus id="task" v-model="newTodo" class="input_task" placeholder="Add a new todo" @keyup.enter="addTodo">
      <button @click="addTodo" class="add_button">Add</button>
      <ul>
        <li v-for="(mainItem, mainIndex) in shoppingLists" :key="mainIndex">
          <div class="item-container">
            <p class="item_title">{{ mainItem.title }}</p>
            <button @click="deleteMainItem(mainIndex)" class="x_button">X</button>
            <ul>
              <li v-for="(subItem, subIndex) in mainItem.items" :key="subIndex">
                <div class="item_names">{{ subItem.name }}</div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      newTodo: null,
      todos: [],
      deletedTasks: [],
      shoppingLists: null,
    };
  },
  methods: {
    // generateRandomId() {
    //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //   let randomId = '';
    //   const idLength = 8;

    //   for (let i = 0; i < idLength; i++) {
    //     const randomIndex = Math.floor(Math.random() * characters.length);
    //     randomId += characters.charAt(randomIndex);
    //   }

    //   return randomId;
    // },
    addTodo() {
      if (this.newTodo !== '') {
        // const randomId = this.generateRandomId();
        const newMainItem = {
          title: this.newTodo,
          items: [],
        };
        this.shoppingLists.push(newMainItem);
        this.newTodo = '';
      }
    },
    deleteMainItem(mainIndex) {
      this.shoppingLists.splice(mainIndex, 1);
    },
  },
  async mounted() {
    try {
      const { data: { data: shoppingLists } } = await axios.get('/api/v1/shopping-lists');
      this.shoppingLists = shoppingLists;
      console.log(shoppingLists);
    } catch (error) {
      console.error('Error:', error);
      this.shoppingLists = { error };
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
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  color: antiquewhite;
}
a {
  color: #42b983;
}

.heading {
  color: antiquewhite;
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
  margin: 15px  
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
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.item_title {
  font-size: 25px;
  color: white;
}

.item_names {
  margin: 0px;
}

.item-container {
  margin-bottom: 10px;
}
</style>