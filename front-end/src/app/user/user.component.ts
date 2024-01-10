import { Component } from '@angular/core';
import { GraphqlService  } from '../graphql.service';
import { Todo, TodosQueryResponse, UserQueryResponse } from '../models/graphql.model';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
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
  todos: Array<Todo> = []
  constructor(private GraphqlService: GraphqlService) {}
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
        if(!user) {
          this.resultStatus = "user not found"
          return
        }
        this.resultStatus = `welcome : ${user.username}` 
        this.todos = user.todos
      })
  }

  createUser(userValue: String) {
    // si le champs est vide rien ne se passe
    if(!userValue) {
      return
    }
    console.log(userValue)
  }
}
