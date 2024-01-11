import { Component } from '@angular/core';
import { GraphqlService  } from '../graphql.service';
import { Todo, TodosQueryResponse, User, UserQueryResponse } from '../models/graphql.model';
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
      return
    }
    this.GraphqlService
      .createUser(userValue).subscribe((result: MutationResult<UserQueryResponse>) => {
        console.log(result)
        const user = result?.data?.createOneUser
        console.log("User :", user)
        if(!user) {
          this.resultStatus = "user already exist"
          return
        }
        this.resultStatus = `${user.username} : created` 
        // this.todos = user.todos
        this.user = user
      })
  }

  // Function onclick button
  // userTodos(userValue: String) {
  //   // si le champs est vide rien ne se passe
  //   this.resultStatus = ""
  //   if(!userValue) {
  //     this.resultStatus = "please enter a name"
  //     return
  //   }
  //   this.GraphqlService
  //     .getUserTodos(userValue).subscribe((result: ApolloQueryResult<UserQueryResponse>) => {
  //       console.log('Result : ', result)
  //       const user = result.data.user
  //       console.log("user :", user)
  //       if(!user) {
  //         this.resultStatus = "user not found"
  //         return
  //       }
  //       this.resultStatus = `welcome : ${user.username}` 
  //       // this.todos = user.todos
  //       this.user = user
  //     })
  // }
}
