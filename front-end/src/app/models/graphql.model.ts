// Ici on va se baser sur les modeles du back end générés par prisma


export type User = {
    id: number;
    username: string;
    email: string;
    todos: Todo[];
    //   _count: UserCount | null
}

export type Todo = {
    id: Number;
    title: String;
    description: String | null;
    completed: Boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: Number;
    user: User
}

export interface TodosQueryResponse {
    todos: Todo[] | null;
    errors: any
}

export interface UserQueryResponse {
    createOneUser: User | null
    user: User | null;
    errors: any
}