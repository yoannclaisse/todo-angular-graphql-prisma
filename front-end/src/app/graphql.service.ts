// Ce service va servir à faire toutes les requêtes graphql
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloQueryResult, gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { TodosQueryResponse, UserQueryResponse } from './models/graphql.model';

// variavle pour faire la requete graphql
const GET_TODOS_BY_USERNAME_QUERY = gql`
  query getTodosByUsername($where: TodoWhereInput){todos(where: $where){id title description user{username}}}
`

const GET_USER_BY_NAME_WITH_TODOS = gql `query getUserByNameWithTodos($input: UserWhereUniqueInput!){user(where: $input){username todos{description id title}}}`

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    // c'est ici que ça connecte le front avec le back
    this.apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
    });
  }

  // fonction du service
  getUserTodos(username: String): Observable<ApolloQueryResult<UserQueryResponse>> {
    return this.apollo.watchQuery<UserQueryResponse>({
      query: GET_USER_BY_NAME_WITH_TODOS,
      variables: { "input": {"username": username} }
    }).valueChanges;
  }
}
