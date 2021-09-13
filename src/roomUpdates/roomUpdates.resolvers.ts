import { withFilter } from "apollo-server-express";
import client from "../client";
import { NEW_MESSAGE } from "../constants";
import pubsub from "../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      // subscribe func을 리턴해주어야 함
      // asyncIterator : trigger들을 listen하는 메서드
      // NEW_MESSAGE가 발생할 때마다 roomUpdates를 실행
      // withFilter : 발생하는 이벤트를 필터링. filterFn이 true일 때 발생.
      // payload : roomUpdates: { ...message } / variables : id (room의 id)
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            // roomUpdate의 arg로 받은 room의 id
            id: args.id,
            // 로그인 유저가 있는 방
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        // ?유저가 업데이트를 보기 전
        if (!room) {
          throw new Error("You shall not see this");
        }
        // withFilter 자체가 함수 (protectedResolver와 비슷)
        // 함수가 또 다른 함수를 리턴
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            // ?유저가 업데이트를 본 후
            // sendMessage(publish)와 roomUpdate(subscription)의 roomId가 같은지 확인
            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  // roomUpdate의 arg로 받은 room의 id
                  id,
                  // 로그인 유저가 있는 방
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};
