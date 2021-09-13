import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null;
        // 메시지를 보낼 유저가 argument에 존재하면
        if (userId) {
          // 해당 유저를 User 테이블에서 찾음
          const user = await client.user.findUnique({
            where: { id: userId },
            // user.id만 선택
            select: { id: true },
          });
          // 해당 유저가 DB에 존재하지 않으면
          if (!user) {
            return { ok: false, error: "This user does not exist" };
            // 대화방이 이미 존재하면
          }
          // 새로운 방을 생성
          room = await client.room.create({
            data: {
              // 로그인 유저와 메시지 보낼 상대와 연결
              users: { connect: [{ id: userId }, { id: loggedInUser.id }] },
            },
          });
          // 대화방이 존재하면 (roomId가 argument에 존재)
        } else if (roomId) {
          // roomId로 대화방을 찾음
          room = await client.room.findUnique({
            where: { id: roomId },
            // room.id만 선택
            select: { id: true },
          });
          // 대화방을 찾을 수 없으면
          if (!room) {
            return { ok: false, error: "Room not found" };
          }
        }
        // ** 위에서 user와 room을 찾음
        // 새로운 메시지 생성
        const message = await client.message.create({
          data: {
            // 메시지 내용
            payload,
            // 메시지를 보낸 대화방
            room: { connect: { id: room.id } },
            // 메시지를 보낸 유저
            user: { connect: { id: loggedInUser.id } },
          },
        });
        //! publish되는 이벤트의 payload는 Subscription의 이름 + 리턴 타입이어야 함
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        return { ok: true };
      }
    ),
  },
};

export default resolvers;
