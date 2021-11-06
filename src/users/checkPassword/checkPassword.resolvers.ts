import bcrypt from "bcrypt";
import client from "../../client";
import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Mutation: {
    checkPassword: async (_, { username, password }) => {
      const user = await client.user.findFirst({ where: { username } });
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Incorrect password.",
        };
      }
      return {
        ok: true,
      };
    },
  },
};

export default resolvers;
