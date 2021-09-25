import client from "../../client";
import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

// protectedResolver : 토큰이 없을 때, null 리턴
const resolvers: Resolvers = {
  Query: {
    me: protectedResolver((_, __, { loggedInUser }) =>
      client.user.findUnique({ where: { id: loggedInUser.id } })
    ),
  },
};

export default resolvers;
