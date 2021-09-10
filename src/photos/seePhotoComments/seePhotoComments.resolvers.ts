import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  // seePhotoComments : photo의 comments를 가져오는 기능
  Query: {
    // photo의 id를 받아서 photo와 연결된 Comment 테이블에서 찾음
    seePhotoComments: (_, { id }) =>
      client.comment.findMany({
        where: { photoId: id },
        orderBy: { createdAt: "asc" },
      }),
  },
};

export default resolvers;
