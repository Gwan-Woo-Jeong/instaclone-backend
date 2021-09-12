import { gql } from "apollo-server";

// roomId (optional) :
// 대화방에 메시지를 보낼 수도 있고 (이미 대화방이 있는 경우)
// 사용자한테 메시지를 보낼 수도 있기 때문에 (대화방이 없는 경우 => 대화방 생성)
export default gql`
  type Mutation {
    sendMessage(payload: String!, roomId: Int, userId: Int): MutationResponse!
  }
`;
