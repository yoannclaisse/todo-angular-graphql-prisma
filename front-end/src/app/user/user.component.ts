import { Component } from '@angular/core';
import { GraphqlService  } from '../graphql.service';
import { TodosQueryResponse, UserQueryResponse } from '../models/graphql.model';
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
  constructor(private GraphqlService: GraphqlService) {}
  // Function onclick button
  userTodos(userValue: String) {
    // si le champs est vide rien ne se passe
    if(!userValue) {
      return
    }
    this.GraphqlService
      .getUserTodos(userValue).subscribe((result: ApolloQueryResult<UserQueryResponse>) => {
        console.log('Result : ', result)
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
