// Ce service va servir à faire toutes les requêtes graphql
import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloQueryResult, gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { TodosQueryResponse, UserQueryResponse, TodoQueryResponse, Todo, User } from './models/graphql.model';

// variavle pour faire la requete graphql
const GET_TODOS_BY_USERNAME_QUERY = gql`
  query getTodosByUsername($where: TodoWhereInput){todos(where: $where){id title description user{username}}}
`

const GET_USER_BY_NAME_WITH_TODOS = gql`query getUserByNameWithTodos($input: UserWhereUniqueInput!){user(where: $input){id username todos{description id title completed}}}`

const CREATE_USER = gql`mutation($input: UserCreateInput!){createOneUser(data: $input){id username}}`

const CREATE_TODO = gql`mutation CreateTodo($input: TodoCreateInput!) {
    createOneTodo(data: $input) {
      id
      title
      description
      userId
    }
  }`

const DELETE_TODO = gql`mutation($input: TodoWhereUniqueInput!) {deleteOneTodo(where: $input){id}}`

const UPDATE_TODO = gql`mutation($input: TodoUpdateInput! $where: TodoWhereUniqueInput!)
{
  updateOneTodo(data: $input where: $where)
  {
    title
    description
    completed
  }
}`
@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  // Observable
  observableUser: any

  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    // c'est ici que ça connecte le front avec le back
    this.apollo.create({
      cache: new InMemoryCache(),
      link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
    })

    // new observable
    this.observableUser = new Observable<User>((subscriber) => {
      subscriber.next({ username: "JP", id: 0, email: "test@gmail.com", todos: [] });
      subscriber.next({ username: "JD", id: 0, email: "test@gmail.com", todos: [] });
      // subscriber.error("this is an error")
      subscriber.complete()
    })
    this.observableUser.subscribe(
      { next(user: User) { console.log(user) } },
      { error(error: any) { console.log(error) } },
      { complete() { console.log("subscription is closed") } }
    )
  }

  // fonction du service
  getUserTodos(username: String): Observable<User> {
    return new Observable<User>((subscriber) => {
      const observableResult = this.apollo.watchQuery<UserQueryResponse>({
        query: GET_USER_BY_NAME_WITH_TODOS,
        variables: { "input": { "username": username } }
      }).valueChanges;

      observableResult.subscribe((result: ApolloQueryResult<UserQueryResponse>) => {
        console.log('Result : ', result)
        const user = result.data.user
        console.log("user :", user)
        if (!!user) {
          subscriber.next(user)
        } else {
          subscriber.error("user not found")
        }
      })
    })
  }

  createUser(username: String): Observable<MutationResult<UserQueryResponse>> {
    return this.apollo.mutate<UserQueryResponse>({
      mutation: CREATE_USER,
      variables: { "input": { "username": username } }
    })
  }

  createTodo(title: String, description: String, userId: Number): Observable<MutationResult<TodoQueryResponse>> {
    return this.apollo.mutate<TodoQueryResponse>({
      mutation: CREATE_TODO,
      variables: { "input": { "title": title, "description": description, "user": { "connect": { "id": userId } } } }
    })
  }

  deleteTodo(todoId: Number): Observable<MutationResult<TodoQueryResponse>> {
    return this.apollo.mutate<TodoQueryResponse>({
      mutation: DELETE_TODO,
      variables: { "input": { "id": todoId } }
    })
  }

  updateTodo(todo: Todo): Observable<MutationResult<TodoQueryResponse>> {
    return this.apollo.mutate<TodoQueryResponse>({
      mutation: UPDATE_TODO,
      variables: {
        "input": { "title": { "set": todo.title }, "description": { "set": todo.description }, "completed": { "set": todo.completed } },
        "where": { "id": todo.id }
      }
    })
  }
}
