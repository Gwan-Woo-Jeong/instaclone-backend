import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    commentNumber: ({ id }) => client.comment.count({ where: { photoId: id } }),
    // photoId가 일치하는 comment와 함께 user 정보까지 추가
    comments: ({ id }) =>
      client.comment.findMany({
        where: { photoId: id },
        include: { user: true },
      }),
    isMine: ({ userId }, _, { loggedInUser }) => userId === loggedInUser?.id,
    // photo의 id와 로그인 유저의 id를 가져옴
    isLiked: async ({ id }, _, { loggedInUser }) => {
      // 비로그인이면
      if (!loggedInUser) {
        // 로그인이 되지 않았으므로 좋아요 X
        return false;
      }
      // photoId = id 이고 userId = 로그인 유저 id인 like를 찾음
      const ok = await client.like.findUnique({
        where: { photoId_userId: { photoId: id, userId: loggedInUser.id } },
        // 존재만 찾기 때문에 id만 뽑아옴
        select: { id: true },
      });
      // 있으면
      if (ok) {
        // 좋아요 했음
        return true;
      }
      // 없으면, 좋아요 안했음
      return false;
    },
  },
  Hashtag: {
    photos: ({ id }, { page }, { loggedInUser }) => {
      return client.hashtag.findUnique({ where: { id } }).photos();
    },
    totalPhotos: ({ id }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
