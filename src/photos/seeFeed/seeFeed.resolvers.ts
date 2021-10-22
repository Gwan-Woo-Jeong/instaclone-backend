import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    // seeFeed : 로그인 유저의 피드(photos)를 보게 하는 기능
    // 로그인 유저가 누군지 알아야 하기 때문에, protectedResolver 필요
    seeFeed: protectedResolver((_, { offset }, { loggedInUser }) =>
      // photo를 찾을 때, 팔로워 목록에 내 이름이 있는 유저들의 photo를 찾음
      client.photo.findMany({
        take: 2, // 찾을 photo의 개수
        skip: offset, // 나머지 하나는 offset으로 표시 안함
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
