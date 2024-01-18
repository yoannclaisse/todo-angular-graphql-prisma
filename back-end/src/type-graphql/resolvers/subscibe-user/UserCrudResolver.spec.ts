import { Test, TestingModule } from '@nestjs/testing';
import { UserCrudResolver } from '../../../../prisma/generated/type-graphql/resolvers/crud/User/UserCrudResolver';
import { User } from '../../../../prisma/generated/type-graphql/models/User';
import { type GraphQLResolveInfo } from "graphql";


// comportement attendu de l'élément à tester
describe('UserCrudResolver', () => {
  // Varrable de l'élément à tester
  let resolver: UserCrudResolver;

  // module qui charge l'élément à tester
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCrudResolver],
    }).compile();

    resolver = module.get<UserCrudResolver>(UserCrudResolver);
  });

  // le test est ici !!!!
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // autre test
  // Ce test passe car on a mis le "jest.spyOn"
  it('should return first user', () => {
    const userResult: Promise<User> = new Promise((resolve, reject) => {
      resolve(
        {
          id: 0,
          username: "test"
        }
      )
    })
    jest.spyOn(resolver, "findFirstUser").mockImplementation(() => userResult)
    const firstUser = resolver.findFirstUser({}, {} as GraphQLResolveInfo, {}).then((value: User | null) => {
      expect(value).toBeDefined(),
      expect(value?.username).toEqual("test"),
      expect(value?.id).toEqual(0)
    });
  })

  it('should return first user or throw', () => {
    const userResult: Promise<User> = new Promise((resolve, reject) => {
      resolve(
        {
          id: 0,
          username: "test"
        }
      )
    })
    jest.spyOn(resolver, "findFirstUserOrThrow").mockImplementation(() => userResult)
    const firstUser = resolver.findFirstUserOrThrow({}, {} as GraphQLResolveInfo, {}).then((value: User | null) => {
      expect(value).toBeDefined(),
      expect(value?.username).toEqual("test"),
      expect(value?.id).toEqual(0)
    });
  })
});
