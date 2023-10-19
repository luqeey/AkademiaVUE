<template>
  <div class="hello">
    <div class="heading">
      <h1>Nakupny zoznam</h1>
    </div>

    <input autofocus id="task" v-model="newTodo" class="input_task" placeholder="Add a new todo" @keyup.enter="addTodo">
    <button @click="addTodo" class="add_button">Add</button>
    <ul>
      <!-- <li v-for="(todo, index) in todos" :key="todo">
        <p>{{ todo.description }}</p>
        <button @click="deleteTask(index, id)" class="x_button">X</button>
      </li> -->
      <li v-for="(todo, index) in todos" :key="todo.id">
        {{ todo.description }}
        <button @click="deleteTask(index, todo.id)" class="x_button">X</button>
      </li>
    </ul>
    <div class="deleted_tasks">
      <div class="heading">
        <h1>Deleted Tasks</h1>
      </div>
      <ul>
        <li v-for="(todo, index) in deletedTasks" :key="index">
          {{ todo.description }}
          <button @click="deleteDeletedTask(index, id)" class="delete_deleted_button">X</button>
        </li>
      </ul>
    </div>
    <div>
      <!-- <li v-for="todo in todos" :key="todo.id">
        <p>{{ todo.description }}</p>
      </li> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      newTodo: null,
      todos: [],
      deletedTasks: [],
      api_url: 'http://localhost:5038/'
    };
  },
  // created() {
  //   const savedTodos = localStorage.getItem('todos');
  //   if (savedTodos) {
  //     this.todos = JSON.parse(savedTodos);
  //   }

  //   const savedDeletedTasks = localStorage.getItem('deletedTasks');
  //   if (savedDeletedTasks) {
  //     this.deletedTasks = JSON.parse(savedDeletedTasks);
  //   }
  // },
  methods: {
    generateRandomId() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomId = '';
      const idLength = 8; // You can adjust the length as needed

      for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
      }

      return randomId;
    }, 
    async addTodo() {
      if (this.newTodo !== '') {
              this.todos.push({ description: this.newTodo, id: this.generateRandomId() })

              try {
                await axios.post(`http://localhost:5038/api/shoppingapp/add`,{ description: this.newTodo, id: this.generateRandomId() }).then(
                (response) => {
                  console.log("Response:", response)
                  this.refreshData()
                }
              ) 
              } catch(error) {
                console.error('error:', error)
              }
              this.newTodo = ''
            }

      
    },
    async deleteTask(index, id) {
      const deletedTask = this.todos.splice(index, 1)[0];
      console.log(deletedTask);
      this.deletedTasks.push(deletedTask, {description: this.todo, id});

      try {
        await axios.delete(this.api_url + 'api/shoppingapp/delete/', { params: { id } });
        this.refreshData();
      } catch (error) {
        console.error('error:', error);
      }

      if (this.newTodo !== '') {
        this.todos.push({ description: this.newTodo, id });
        this.newTodo = '';
      }
    },

    deleteDeletedTask(index) {
      this.deletedTasks.splice(index, 1)
      // this.saveTasks();
    },
    // saveTasks() {
    //   localStorage.setItem('todos', JSON.stringify(this.todos));
    //   localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
    // },
    async refreshData() {
      axios.get(this.api_url + 'api/shoppinglist/GetNote').then((response) => {
        this.todos = response.data
      });
    }
  },
  mounted() {
    this.refreshData();
  }
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
</style>