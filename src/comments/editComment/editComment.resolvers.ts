import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    editComment: protectedResolver( 
      async (_, { id, payload }, { loggedInUser }) => {
        // comment 테이블에서 입력된 id와 일치하는 comment를 찾음
        const comment = await client.comment.findUnique({
          where: { id },
          select: { userId: true },
        });
        // 일치하는 comment가 없으면
        if (!comment) {
          return { ok: false, error: "Comment not found" };
          // comment의 작성자가 로그인 유저가 아니면
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "Not authorized",
          };
          // 정상적인 접근
        } else {
          // comment.id가 입력된 id와 일치하는 comment의 내용을 payload로 수정
          await client.comment.update({ where: { id }, data: { payload } });
          return { ok: true };
        }
      }
    ),
  },
};

export default resolvers;
