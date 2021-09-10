import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    // seePhotoLikes : 사진의 좋아요를 누른 유저를 조회
    // id : photo의 id
    seePhotoLikes: async (_, { id }) => {
      // like 테이블에서 photoId (photo.id를 참조)가 인자로 받은 id와 일치하는 사진들을 조회
      const likes = await client.like.findMany({
        where: { photoId: id },
        // 그런데, photo의 모든 레코드가 아닌 photo 테이블의 user 레코드만을 선택
        select: { user: true },
      });
      // User 배열을 리턴해야 하기 때문에, map 사용
      return likes.map((like) => like.user);
    },
  },
};

/*
    findMany에서 select와 include의 차이
    select : 테이블에서 레코드를 선택 
    include : 테이블에서 레코드를 추가 (기존 테이블의 모든 값 + include한 값)
    select와 include는 여러 번 사용 가능하지만, 두 개를 동시에 사용할 순 없음!
*/
export default resolvers;
