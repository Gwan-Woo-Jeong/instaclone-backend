import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          // readMessage의 args로 받은 id와 일치하는 message의 id
          id,
          // 메시지를 만든 user가 로그인 유저가 아님
          userId: { not: loggedInUser.id },
          // 메시지가 속한 방 = 로그인 유저가 들어간 방
          room: { users: { some: { id: loggedInUser.id } } },
        },
        // message id만 선택
        select: { id: true },
      });
      if (!message) {
        return { ok: false, error: "Message not found" };
      }
      await client.message.update({ where: { id }, data: { read: true } });
      return { ok: true };
    }),
  },
};

export default resolvers;
