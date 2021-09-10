import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    // comment의 userId를 받아 로그인 유저의 id와 비교
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
  },
};

export default resolvers;
