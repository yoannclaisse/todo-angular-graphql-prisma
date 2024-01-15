import { Component } from '@angular/core';
import { GraphqlService } from '../graphql.service';
import { Todo, User } from '../models/graphql.model';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [GraphqlService, Apollo],
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  resultStatus: String = ""
  // todos: Array<Todo> = []
  user: User = { id: 0, username: "", email: "", todos: [] }

  newTitle: String = ""
  newDescription: String = ""

  constructor(private GraphqlService: GraphqlService) { }

  createUser(userValue: String) {
    // si le champs est vide rien ne se passe
    this.resultStatus = ""
    if (!userValue) {
      this.resultStatus = "please enter a name"
      return
    }

    this.GraphqlService
      .createUser(userValue).subscribe((result: User) => {
        this.resultStatus = `${result.username} : created`
        this.user = result
      }, (error: any) => {
        console.log("ERROR :", error)
        if (String(error).includes("Unique constraint failed on the fields: (`username`)")) {
          this.resultStatus = "user already exists"
        }
      })
  }

  addTodo(/*title: String, description: String*/) {
    if (!this.newTitle) {
      this.resultStatus = "no title define"
      return
    }
    if (!this.newDescription) {
      this.resultStatus = "no description define"
      return
    }
    if (this.user.id == 0) {
      this.resultStatus = "no user defined"
      return
    }
    this.GraphqlService
      .createTodo(this.newTitle, this.newDescription, this.user.id).subscribe((todo: Todo) => {
        this.user.todos = [...this.user.todos, todo]
        this.user.todos.push(todo)
        if (!!this.user.todos) {
          this.user = { ...this.user, todos: [...this.user.todos, todo] };
        } else {
          this.user = { ...this.user, todos: [todo] };
        }
        // Clear the input field value
        this.newTitle = '';
        this.newDescription = '';
      })
  }

  removeTodo(id: Number) {
    this.GraphqlService
      .deleteTodo(id).subscribe((result: Todo) => {
        console.log("Result :", result)
        // le filter est un foreach avec un if dedand et retourne un autre tableau filtrer par le if
        const todos = this.user.todos.filter(todo => todo.id != id)
        this.user = { ...this.user, todos: todos };
      })
  }

  changeTodo(id: Number, updatedComplete: Boolean, updatedTitle: String, updatedDescription: String) {
    let updatedTodo = this.user.todos.find(todo => todo.id == id)
    console.log("variable :", updatedTodo)
    if (!!updatedTodo) {
      // updatedTodo.title = updatedTitle
      updatedTodo = { ...updatedTodo, title: updatedTitle, description: updatedDescription, completed: updatedComplete };
      this.GraphqlService
        .updateTodo(updatedTodo).subscribe((result: Todo) => {
          console.log("Result :", result)
          // TODO: update this.user
        })
    }
  }

  // Function onclick button
  userTodos(userValue: String) {
    // si le champs est vide rien ne se passe
    this.resultStatus = ""
    if (!userValue) {
      this.resultStatus = "please enter a name"
      return
    }
    this.GraphqlService
      .getUserTodos(userValue).subscribe((result: User) => {
        this.user = result
      }, (error: any) => { console.log("ERROR :", error) })
  }
}
