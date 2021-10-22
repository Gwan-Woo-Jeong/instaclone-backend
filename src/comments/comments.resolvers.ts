import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Comment: {
    // comment의 userId를 받아 로그인 유저의 id와 비교
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    photo: ({ photoId }) => client.photo.findUnique({ where: { id: photoId } }),
  },
};

export default resolvers;
