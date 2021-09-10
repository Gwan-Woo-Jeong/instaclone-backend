import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      // photo.id가 인자로 받은 id와 일치하는 레코드를 찾음
      const photo = await client.photo.findUnique({
        where: { id },
        // photo 전체가 아닌 userId만 선택
        select: { userId: true },
      });
      // 일치하는 photo가 없으면
      if (!photo) {
        return { ok: false, error: "Photo not found" };
        // 삭제하려는 사람이 photo를 올린 사람이 아니라면
      } else if (photo.userId !== loggedInUser.id) {
        return { ok: false, error: "Not authorized" };
        // 정상적으로 삭제 가능
      } else {
        await client.photo.delete({ where: { id } });
        return { ok: true };
      }
    }),
  },
};

export default resolvers;
