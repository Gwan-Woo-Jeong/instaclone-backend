import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    // 좋아요는 한번 누를 때 +1, 다시 누르면 -1이기 때문에 토글링 기능이 필요
    // protectedResolver로 감싸면 로그인 유저만 사용할 수 있는 기능
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      // id : 좋아요 누른 photo의 id (toggleLike의 인자)
      // photo 테이블에서 id와 일치하는 사진을 찾음
      const photo = await client.photo.findUnique({ where: { id } });
      // 사진이 없다면
      if (!photo) {
        // 에러 리턴
        return {
          ok: false,
          error: "Photo not found",
        };
      }
      // likeWhere : like의 조건이 중복되므로 변수로 선언
      // userId가 로그인 유저의 id이면서 photoId가 toggleLike의 인자와 일치하는 사진
      // (= 내가 좋아요를 누른 사진)
      const likeWhere = {
        photoId_userId: {
          userId: loggedInUser.id,
          photoId: id,
        },
      };
      const like = await client.like.findUnique({
        where: likeWhere,
      });
      // 좋아요를 이미 눌렀으면
      if (like) {
        // like를 삭제
        await client.like.delete({
          where: likeWhere,
        });
      } else {
        // 좋아요가 없으면 like 생성
        await client.like.create({
          data: {
            user: { connect: { id: loggedInUser.id } },
            photo: {
              connect: { id: photo.id },
            },
          },
        });
      }
      // 요청 성공
      return {
        ok: true,
      };
    }),
  },
};

export default resolvers;
