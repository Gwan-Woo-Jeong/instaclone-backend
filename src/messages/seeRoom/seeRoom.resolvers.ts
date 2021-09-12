import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolver((_, { id }, { loggedInUser }) =>
      // room 테이블에서 로그인 유저의 id를 가지고 있는 레코드들 중 첫 번째를 리턴
      client.room.findFirst({
        where: { id, users: { some: { id: loggedInUser.id } } },
      })
    ),
  },
};

export default resolvers;