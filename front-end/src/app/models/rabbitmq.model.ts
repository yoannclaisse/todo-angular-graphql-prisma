import { User } from "./graphql.model"

export enum ActionMessage {
    create = "create",
    update = "update",
    delete = "delete"
}

export type UserActionMessage = {
    action: ActionMessage,
    user: User
}