<template>
    <div class="hello">
      <div class="heading">
        <h1>Nakupny zoznam</h1>
      </div>

    <input v-model="newTodo" class="inputTask" placeholder="Add a new todo">
    <button @click="addTodo" class="addButton">Add</button>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        {{ todo.text }}
        <button @click="deleteTask(index)" class="xButton">X</button>
      </li>
    </ul>
    <div class="deletedTasks">
      <div class="heading2">
        <h1>Deleted Tasks</h1>
      </div>
      <ul>
        <li v-for="(task, index) in deletedTasks" :key="index">
          {{ task.text }}
          <button @click="deleteDeletedTask(index)" class="deleteDeletedButton">X</button>
        </li>
      </ul>
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
      deletedTasks: []
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

.inputTask {
  padding: 10px;  
  border-radius: 8px;
  border: none;
} 

.addButton {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 8px;
  border: none;
  margin: 15px  
}

.xButton {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  border: none;
  border-radius: 2px;
  margin-left: 15px;
}

.deletedTasks {
  margin-top: 200px;
}

.deleteDeletedButton {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
  border: none;
  border-radius: 2px;
  margin-left: 15px;
}
</style>
