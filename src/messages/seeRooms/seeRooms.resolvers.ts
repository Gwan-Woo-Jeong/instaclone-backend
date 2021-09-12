import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolver(async (_, __, { loggedInUser }) =>
      // room 테이블에서 users 레코드에 로그인 유저 id가 있는 room들을 찾음
      client.room.findMany({
        where: { users: { some: { id: loggedInUser.id } } },
      })
    ),
  },
};

export default resolvers;
