import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { TodoCreateNestedManyWithoutUserInput } from "../inputs/TodoCreateNestedManyWithoutUserInput";

@TypeGraphQL.InputType("UserCreateInput", {})
export class UserCreateInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  username!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  email?: string | undefined;

  @TypeGraphQL.Field(_type => TodoCreateNestedManyWithoutUserInput, {
    nullable: true
  })
  todos?: TodoCreateNestedManyWithoutUserInput | undefined;
}
