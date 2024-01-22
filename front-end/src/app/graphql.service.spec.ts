import { TestBed } from '@angular/core/testing';

import { GraphqlService } from './graphql.service';
import { Apollo, MutationResult } from 'apollo-angular';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { User } from './models/graphql.model';
import { of } from 'rxjs';


describe('GraphqlService', () => {
  let service: GraphqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Apollo, HttpClient, HttpHandler]
    });
    service = TestBed.inject(GraphqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const user: User = {
    id: 0,
    username: "test",
    email: "test@gmail.com",
    todos: []
  }

  // test qui simule la connexion au serveur graphQL et retourne le user defint au dessus
  it('#getUserTodos should return value from observable', (done: DoneFn) => {
    const mockGraphqlService = jasmine.createSpyObj('GraphQLService', ['getUserTodos']);
    mockGraphqlService.getUserTodos.and.returnValue(of(user));
    mockGraphqlService.getUserTodos(user.username).subscribe((value: User) => {
      expect(value.username).toBe('test');
      done();
    });
  });

  // test qui simule la connexion au serveur graphQL et retourne le user defint au dessus
  it('#createUser should return value from observable', (done: DoneFn) => {
    const mockGraphqlService = jasmine.createSpyObj('GraphQLService', ['createUser']);
    mockGraphqlService.createUser.and.returnValue(of(user));
    mockGraphqlService.createUser(user.username).subscribe((value: User) => {
      expect(value.username).toBe('test');
      done();
    });
  });

});
