import { gql } from "apollo-server";

export default gql`
  type CheckPasswordResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    checkPassword(username: String!, password: String!): CheckPasswordResult!
  }
`;
