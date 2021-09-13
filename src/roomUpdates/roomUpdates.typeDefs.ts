import { gql } from "apollo-server";

// id : 메시지를 볼 room.id

export default gql`
  type Subscription {
    roomUpdates(id: Int!): Message
  }
`;
