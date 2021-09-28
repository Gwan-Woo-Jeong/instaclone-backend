import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    // createComment : comment를 만드는 기능
    createComment: protectedResolver(
      async (_, { photoId, payload }, { loggedInUser }) => {
        // createComment의 인자로 받은 photoId와 일치하는 photo를 찾음
        const ok = await client.photo.findUnique({
          where: { id: photoId },
          // photo 전체가 아닌 id만 선택
          select: { id: true },
        });
        // 일치하는 photo가 없으면
        if (!ok) {
          // 에러 메시지 리턴
          return { ok: false, error: "Photo not found" };
        }
        // 일치하는 photo가 있으면, comment를 생성
        const newComment = await client.comment.create({
          data: {
            // comment의 내용
            payload,
            // photo의 id와 연결
            photo: { connect: { id: photoId } },
            // 로그인 유저의 id와 연결
            user: { connect: { id: loggedInUser.id } },
          },
        });
        // 요청 성공
        // + id를 리턴
        return { ok: true, id: newComment.id };
      }
    ),
  },
};

export default resolvers;
