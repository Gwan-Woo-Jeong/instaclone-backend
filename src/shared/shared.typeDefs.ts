import { gql } from "apollo-server";

// id를 리턴하기 위해 type 변경
export default gql`
  type MutationResponse {
    ok: Boolean!
    error: String
    id: Int
  }
`;
