import { gql } from "apollo-server";

export default gql`
  type Query {
    seeFeedNative(offset: Int!): [Photo]
  }
`;
