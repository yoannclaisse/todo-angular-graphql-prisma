import { Component, VERSION } from '@angular/core';
import { GraphqlService } from '../graphql.service';
import { Todo, User } from '../models/graphql.model';
import { Apollo } from 'apollo-angular';
import { FormsModule } from '@angular/forms';
import { RxStompService, rxStompServiceFactory, rxStompTopicName } from '../rxstomp.service';
import { IMessage } from '@stomp/rx-stomp';
@Component({
  selector: 'app-user',
  standalone: true,
  providers: [GraphqlService, Apollo, {
    provide: RxStompService,
    useFactory: rxStompServiceFactory,
  },],
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  // Ce sont des propriétées de la class UserComponent, appelé dans la class avec un this,
  // à cause des paramètres TS on est obligé de leur mettre des valeurs par défaut
  // comme on a pas précisé private, elles sont par défaut public
  resultStatus: String = ""

  user: User = { id: 0, username: "", email: "", todos: [] }

  newTitle: String = ""

  newDescription: String = ""

  testSub: any

  // Le constructor a une nouvelle propriété de class qui elle est privé
  // On est obligé de faire ça car on ne peut pas mettre de valeur par défaut à GraphqlService
  // NOTE : le service sera instancié la 1er fois que le composant sera instancié, si on fait appele à une aure instance du compsant, l'instance du service sera la même
  /**
   * 
   * @param graphqlService 
   */
  constructor(private graphqlService: GraphqlService, private rxStompService: RxStompService) {
    // connexion à rabbitmq via un topic (salon)
    this.testSub = rxStompService.watch(rxStompTopicName)
    this.testSub.subscribe((message: IMessage) => {
      console.log("RABBITMQ LOGS:", message.body)
      const userAction = JSON.parse(message.body)
      console.log("USERACTION", userAction)
      if (userAction.user.id == this.user.id) {
        if (userAction.action = "update") {
          this.user = userAction.user
        }
      }
    })
    // const message = `Message generated at ${new Date()}`;
    // this.rxStompService.publish({ destination: rxStompTopicName, body: message });
  }

  // c'est une méthode appelé par l'evt onclick / on change dans le html
  // Le paramètre userValue est envoyé par une variable de référence d'angular #userValue
  // https://angular.dev/guide/templates/reference-variables#
  /**
   * 
   * @param userValue 
   * @returns 
   */
  createUser(userValue: String) {
    this.resultStatus = ""
    // si la variable (paramètre) est vide/undefined/null rien ne se passe
    // c'est ce que fait le "!", à l'inverse si on ajoute un 2e "!", ça verifie que la variable n'est pas vide/undefined/null
    if (!userValue) {
      this.resultStatus = "please enter a name"
      return
    }

    // appele de la fonction createUser du service GraphqlService
    this.graphqlService.createUser(userValue)
      // Le retour de la fonction est un Obresable, donc on doit souscrire à l'Observable
      .subscribe(
        // le premier evt d'un Observalble sera toujours next, CAD qu'on retourne une valeur si tout s'est bien passé
        (result: User) => {
          this.resultStatus = `${result.username} : created`
          this.user = result
          // message rabbitmq
          const userAction = {
            "action": "create",
            "user": this.user
          }
          this.rxStompService.publish({ destination: rxStompTopicName, body: JSON.stringify(userAction) });
        },
        //  Le 2e evt d'un Observable sera toujour error
        (error: any) => {
          console.log("ERROR :", error)
          if (String(error).includes("Unique constraint failed on the fields: (`username`)")) {
            this.resultStatus = "user already exists"
          }
        }
      )
  }

  // c'est une méthode appelé par l'evt onclick dans le html
  // Ici on utilise pas de paramètres mais à la place on exploite les props de la Class newTitle et newDescription qui ont été liés dans le html,
  // avec les propriétés [(ngModel)]="nom-de-la-props"
  // https://angular.dev/guide/templates/class-binding#
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
    // 
    this.graphqlService.createTodo(this.newTitle, this.newDescription, this.user.id)
      .subscribe(
        (todo: Todo) => {
          // Cette méthode "push" ne fonctionne pas pck les props de this.user sont en lecture seule
          // this.user.todos.push(todo)
          // A la place, on remplace la props this.user.todos par elle même avec le todo fraîchement crée
          // this.user.todos = [...this.user.todos, todo]
          //  Ajoute un controle si this.user.todos est vide
          // On utilise le "!!" pour verif this.user.todos n'est pas vide/null/undifined
          if (!!this.user.todos) {
            this.user = { ...this.user, todos: [...this.user.todos, todo] };
          } else {
            this.user = { ...this.user, todos: [todo] };
          }
          // nettoie les champs
          this.newTitle = '';
          this.newDescription = '';
          // message rabbitmq
          const userAction = {
            "action": "update",
            "user": this.user
          }
          this.rxStompService.publish({ destination: rxStompTopicName, body: JSON.stringify(userAction) });
        }
      )
  }

  removeTodo(id: Number) {
    this.graphqlService
      .deleteTodo(id).subscribe((result: Todo) => {
        console.log("Result :", result)
        // le filter est un foreach avec un if dedand et retourne un autre tableau filtrer par le if
        const todos = this.user.todos.filter(todo => todo.id != id)
        this.user = { ...this.user, todos: todos };
        // message rabbitmq
        const userAction = {
          "action": "update",
          "user": this.user
        }
        this.rxStompService.publish({ destination: rxStompTopicName, body: JSON.stringify(userAction) });
      })
  }

  changeTodo(id: Number, updatedComplete: Boolean, updatedTitle: String, updatedDescription: String) {
    let updatedTodo = this.user.todos.find(todo => todo.id == id)
    console.log("variable :", updatedTodo)
    if (!!updatedTodo) {
      // updatedTodo.title = updatedTitle
      updatedTodo = { ...updatedTodo, title: updatedTitle, description: updatedDescription, completed: updatedComplete };
      console.log(updatedTodo)
      this.graphqlService
        .updateTodo(updatedTodo).subscribe((todo: Todo) => {
          console.log("Result :", todo)
          // TODO: update this.user
          // on supprime l'ancien todo non mis à jour
          let todos = this.user.todos.filter(todo => todo.id != id)
          // On verif que la liste restante n'est pas vide
          if (!!todos) {
            // On ajoute le todo mis à jour
            todos = [...todos, todo]
          } else {
            // On crée un tableau avec celui existant
            todos = [todo]
          }
          // On affect le nouveau tableau dans this.user
          this.user = { ...this.user, todos: todos };
          // message rabbitmq
          const userAction = {
            "action": "update",
            "user": this.user
          }
          this.rxStompService.publish({ destination: rxStompTopicName, body: JSON.stringify(userAction) });
        }, (error: any) => {
          console.log("ERROR :", error)
          this.resultStatus = error
        })
    }
  }

  // Function onclick button
  userTodos(userValue: String) {
    console.log(userValue)
    this.resultStatus = ""
    // si le champs est vide rien ne se passe
    if (!userValue) {
      this.resultStatus = "please enter a name"
      return
    }
    this.graphqlService
      .getUserTodos(userValue).subscribe((result: User) => {
        this.user = result
      }, (error: any) => {
        console.log("ERROR :", error)
        this.resultStatus = error
      })
  }
}
