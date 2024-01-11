import { Component } from '@angular/core';
import { GraphqlService  } from '../graphql.service';
import { Todo, TodoQueryResponse, TodosQueryResponse, User, UserQueryResponse } from '../models/graphql.model';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, MutationResult } from 'apollo-angular';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [GraphqlService, Apollo],
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  resultStatus: String = ""
  // todos: Array<Todo> = []
  user: User = {id: 0, username: "",  email: "", todos: []}

  constructor(private GraphqlService: GraphqlService) {

  }
  createUser(userValue: String) {
    // si le champs est vide rien ne se passe
    this.resultStatus = ""
    if(!userValue) {
      this.resultStatus = "please enter a name"
      return
    }
    this.GraphqlService
      .createUser(userValue).subscribe((result: MutationResult<UserQueryResponse>) => {
        // ne fonctionne pas correctement:
        // même si champs vide en db l'id user s'incrémente quand même
        // Quand on reclick sur add et que le user est créé ça ne me reseigne pas "user already exist"
        console.log("Result :", result)
        const user = result?.data?.createOneUser
        console.log("User :", user)
        if(!user) {
          this.resultStatus = "unable to create user"
          return
        }
        this.resultStatus = `${user.username} : created` 
        // this.todos = user.todos
        this.user = user
      },(error: any) => {
        console.log(error)
        if(String (error).includes("Unique constraint failed on the fields: (`username`)")) {
          this.resultStatus = "user already exists"
        }
      })
  }

  createTodo(title: String, description: String) {
    if(!title) {
      this.resultStatus = "no title define"
      return
    }
    if(this.user.id == 0) {
      this.resultStatus = "no user defined"
      return
    }
    this.GraphqlService
    .createTodo(title, description, this.user.id).subscribe((result: MutationResult<TodoQueryResponse>) => {
      console.log("Result :", result)
      let todo = result?.data?.createOneTodo
        if(!!todo) {
          // this.user.todos = [...this.user.todos, todo]
          // this.user.todos.push(todo)
          this.user = { ...this.user, todos: [...this.user.todos, todo] };
        } 
    })
  }

  removeTodo(id: Number) {
    this.GraphqlService
    .deleteTodo(id).subscribe((result: MutationResult<TodoQueryResponse>) => {
      console.log("Result :", result)
      // le filter est un foreach avec un if dedand et retourne un autre tableau filtrer par le if
      const todos = this.user.todos.filter(todo => todo.id != id)
      this.user = { ...this.user, todos: todos };
    })
  }

  // Function onclick button
  userTodos(userValue: String) {
    // si le champs est vide rien ne se passe
    this.resultStatus = ""
    if(!userValue) {
      this.resultStatus = "please enter a name"
      return
    }
    this.GraphqlService
      .getUserTodos(userValue).subscribe((result: ApolloQueryResult<UserQueryResponse>) => {
        console.log('Result : ', result)
        const user = result.data.user
        console.log("user :", user)
        if(!user) {
          this.resultStatus = "user not found"
          return
        }
        this.resultStatus = `welcome : ${user.username}` 
        // this.todos = user.todos
        this.user = user
      })
  }
}
