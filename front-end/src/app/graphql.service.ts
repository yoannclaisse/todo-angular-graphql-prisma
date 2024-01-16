// Ce service va servir à faire toutes les requêtes graphql
import { Injectable } from '@angular/core';
import { Apollo, MutationResult } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloQueryResult, gql } from '@apollo/client/core';
import { Observable, of } from 'rxjs';
import { TodosQueryResponse, UserQueryResponse, TodoQueryResponse, Todo, User } from './models/graphql.model';
import { environment } from './../environments/environment';


// variavle pour faire la requete graphql
const GET_TODOS_BY_USERNAME_QUERY = gql`
  query getTodosByUsername($where: TodoWhereInput){todos(where: $where){id title description user{username}}}
`

const GET_USER = gql`query getUserByNameWithTodos($input: UserWhereUniqueInput!){user(where: $input){id username todos{description id title completed}}}`

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

  /**
   * 
   * @param apollo 
   * @param httpLink 
   */
  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    // c'est ici que ça connecte le front avec le back
    this.apollo.create({
      cache: new InMemoryCache(),
      // ENVIRONMENT
      // Fetches from http://my-prod-url in production, http://my-dev-url in development.
      link: httpLink.create({ uri: environment.apiUrl }),
    })

    // new observable for example
    this.observableUser = new Observable<User>((subscriber) => {
      subscriber.next({ username: "JP", id: 0, email: "test@gmail.com", todos: [] });
      subscriber.next({ username: "JD", id: 0, email: "test@gmail.com", todos: [] });
      // subscriber.error("this is an error")
      subscriber.complete()
    })
    this.observableUser.subscribe(
      // prochaine valeur à recevoir
      { next(user: User) { console.log(user) } },
      { error(error: any) { console.log(error) } },
      { complete() { console.log("subscription is closed") } }
    )
  }

  // fonction du service
  /**
   * 
   * @param username 
   * @returns {Observable<User>}
   */
  // Méthode de classe qui est une focntion qui récupère le user et les todos qui lui sont affectés
  getUserTodos(username: String): Observable<User> {
    // On stock l'observable valueChanges dans graphqlRequest
    const graphqlRequest =
      this.apollo.watchQuery<UserQueryResponse>({
        query: GET_USER,
        variables: { "input": { "username": username } },
        fetchPolicy: "no-cache"
      }).valueChanges

    // On crée et retourne un Observable de User et on definit le comportement de l'observable
    // Le subscriber définit le comportement lorsqu'on va faire un appel .subscribe
    return new Observable<User>(
      (subscriber) => {
        // on subscribe a graphqlRequest pour recup' le resultat de la requêt graphQL
        graphqlRequest.subscribe(
          // le "next" est ici et se déclenche quand la requête graphQL se passe bien
          (result: ApolloQueryResult<UserQueryResponse>) => {
            // le traitement sépare la requête graphQL de la donnée qui nous intéresse c'est à dire le user
            console.log('Result : ', result)
            const user = result.data.user
            console.log("user :", user)
            // ON verifie qu'il n'est pas null/vide/undefined
            if (!!user) {
              // on déclenche l'evt "next"
              subscriber.next(user)
            } else {
              // sinon l'evt "error"
              subscriber.error("user not found")
            }
          },
          // le bloc error de graphQL
          (error: any) => {
            // On déclenche l'evt error, on transfère l'error graphQL
            subscriber.error(error)
          }
        )
      })
  }

  /**
   * 
   * @param username 
   * @returns 
   */
  // Méthode de classe qui est une focntion qui crée le user
  createUser(username: String): Observable<User> {
    // On crée et retourne un Observable de User et on definit le comportement de l'observable
    // Le subscriber définit le comportement lorsqu'on va faire un appel .subscribe 
    return new Observable<User>((subscriber) => {
      // requête apollo pour créer un user
      this.apollo.mutate<UserQueryResponse>({
        mutation: CREATE_USER,
        variables: { "input": { "username": username } }
      })
        // on subscribe a la requête graphQL pour recup' le resultat de la requêt graphQL
        .subscribe((result: MutationResult<UserQueryResponse>) => {
          console.log("Result :", result)
          const user = result?.data?.createOneUser
          console.log("User :", user)
          if (!user) {
            // On déclenche l'evt error
            subscriber.error("unable to create user")
          } else {
            // On déclenche l'evt next
            subscriber.next(user)
          }

        },
        // On entre dans l'evt error de la requête graphQL
          (error: any) => {
            // On transfère le message d'erreur
            subscriber.error(error)
          })
    })
  }

  /**
   * 
   * @param title 
   * @param description 
   * @param userId 
   * @returns 
   */
  createTodo(title: String, description: String, userId: Number): Observable<Todo> {
    return new Observable<Todo>((subscriber) => {
      this.apollo.mutate<TodoQueryResponse>({
        mutation: CREATE_TODO,
        variables: { "input": { "title": title, "description": description, "user": { "connect": { "id": userId } } } }
      }).subscribe((result: MutationResult<TodoQueryResponse>) => {
        console.log("Result :", result)
        let todo = result?.data?.createOneTodo
        if (!!todo) {
          subscriber.next(todo)
        } else {
          subscriber.error("unable to create Todo")
        }
      }, (error: any) => {
        subscriber.error(error)
      })
    })
  }

  /**
   * 
   * @param todoId 
   * @returns 
   */
  deleteTodo(todoId: Number): Observable<Todo> {
    return new Observable<Todo>((subscriberEvent) => {
      this.apollo.mutate<TodoQueryResponse>({
        mutation: DELETE_TODO,
        variables: { "input": { "id": todoId } }
      }).subscribe((result: MutationResult<TodoQueryResponse>) => {
        console.log("Result :", result)
        let todo = result?.data?.deleteOneTodo
        if (!!todo) {
          subscriberEvent.next(todo)
        } else {
          subscriberEvent.error("unable to delete Todo")
        }
      }, (error: any) => {
        subscriberEvent.error(error)
      })
    })
  }

  /**
   * 
   * @param todo 
   * @returns 
   */
  updateTodo(todo: Todo): Observable<Todo> {
    return new Observable<Todo>((subscriberEvent) => {
      this.apollo.mutate<TodoQueryResponse>({
        mutation: UPDATE_TODO,
        variables: {
          "input": { "title": { "set": todo.title }, "description": { "set": todo.description }, "completed": { "set": todo.completed } },
          "where": { "id": todo.id }
        }
      }).subscribe((result: MutationResult<TodoQueryResponse>) => {
        console.log("Result :", result)
        let todo = result?.data?.updateOneTodo
        if (!!todo) {
          subscriberEvent.next(todo)
        } else {
          subscriberEvent.error("unable to update Todo")
        }
      }, (error: any) => {
        subscriberEvent.error(error)
      })
    })
  }

  // updateTodo2(todo: Todo): Todo | null {
  //     this.apollo.mutate<TodoQueryResponse>({
  //       mutation: UPDATE_TODO,
  //       variables: {
  //         "input": { "title": { "set": todo.title }, "description": { "set": todo.description }, "completed": { "set": todo.completed } },
  //         "where": { "id": todo.id }
  //       }
  //     }).subscribe((result: MutationResult<TodoQueryResponse>) => {
  //       console.log("Result :", result)
  //       let todo = result?.data?.deleteOneTodo
  //       if (!!todo) {
  //         return todo
  //         // subscriberEvent.next(todo)
  //       } else {
  //         // subscriberEvent.error("unable to update Todo")
  //         throw new Error("unable to update Todo")
  //         return null
  //       }
  //     }, (error: any) => {
  //       // subscriberEvent.error(error)
  //       throw new Error(error)
  //       return null
  //     }) 
  // }
}
