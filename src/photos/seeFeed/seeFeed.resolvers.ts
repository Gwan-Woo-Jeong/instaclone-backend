import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    // seeFeed : 로그인 유저의 피드(photos)를 보게 하는 기능
    // 로그인 유저가 누군지 알아야 하기 때문에, protectedResolver 필요
    seeFeed: protectedResolver((_, __, { loggedInUser }) =>
      // photo를 찾을 때, 팔로워 목록에 내 이름이 있는 유저들의 photo를 찾음
      client.photo.findMany({
        where: {
          // 내 사진도 피드에서 봐야하기 때문에 OR 조건으로 추가
          OR: [
            { user: { followers: { some: { id: loggedInUser.id } } } },
            { userId: loggedInUser.id },
          ],
        },
        // 최신순 (내림차순)으로 받음
        orderBy: {
          createdAt: "desc",
        },
      })
    ),
  },
};

export default resolvers;
