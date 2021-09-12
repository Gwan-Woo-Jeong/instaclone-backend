import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  // computed fields
  Room: {
    // Room에 들어가, 대화방 속에 있는 사용자와 메시지 조회
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
    messages: ({ id }) => client.message.findMany({ where: { roomId: id } }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } else {
        return client.message.count({
          where: {
            // 내가 읽지 않음
            read: false,
            // 대화방에 속한 메시지
            roomId: id,
            // 내가 보낸 메시지는 포함하지 않음
            user: { id: { not: loggedInUser.id } },
          },
        });
      }
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};

export default resolvers;
