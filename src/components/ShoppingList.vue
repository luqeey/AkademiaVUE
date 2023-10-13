<template>
    <div class="hello">
      <div class="heading">
        <h1>Nakupny zoznam</h1>
      </div>

    <input v-model="newTodo" class="input_task" placeholder="Add a new todo" @keyup.enter="addTodo">
    <button @click="addTodo" class="add_button">Add</button>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        {{ todo.text }}
        <button @click="deleteTask(index)" class="x_button">X</button>
      </li>
    </ul>
    <div class="deleted_tasks">
      <div class="heading2">
        <h1>Deleted Tasks</h1>
      </div>
      <ul>
        <li v-for="(task, index) in deletedTasks" :key="index">
          {{ task.text }}
          <button @click="deleteDeletedTask(index)" class="delete_deleted_button">X</button>
        </li>
      </ul>
    </div>
    <button @click="getLists">Get Lists</button>
    <div v-for="p in list" :key="p.id">
      <li>
        <h1>{{ p.task }}</h1>
      </li>

    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      newTodo: '',
      todos: [],
      deletedTasks: [],
      list: []
    };
  },
  created() {
  
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }

    const savedDeletedTasks = localStorage.getItem('deletedTasks');
    if (savedDeletedTasks) {
      this.deletedTasks = JSON.parse(savedDeletedTasks);
    }
  },
  methods: {
    getLists() {
      fetch('http://localhost:3000/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(json => json.json())
    .then(data => this.list = data)

    },
    addTodo() {
      if (this.newTodo.trim() !== '') {
        this.todos.push({ text: this.newTodo });
        this.newTodo = ''; 
        this.saveTasks();
      }
    },
    deleteTask(index) {
      const deletedTask = this.todos.splice(index, 1)[0];
      this.deletedTasks.push(deletedTask);
      this.saveTasks();
    },
    deleteDeletedTask(index) {
      this.deletedTasks.splice(index, 1);
      this.saveTasks();
    },
    saveTasks() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
      localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
    }
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

.heading2 {
  color: antiquewhite ;
}

.input_task {
  padding: 10px;  
  border-radius: 8px;
  border: none;
} 

.add_button {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
  border: none;
  margin: 15px  
}

.x_button {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  border: none;
  border-radius: 2px;
  margin-left: 15px;
}

.deleted_tasks {
  margin-top: 200px;
}

.delete_deleted_button {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
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
