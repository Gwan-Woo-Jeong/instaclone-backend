require("dotenv").config();
import express from "express";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import client from "./client";
import http from "http";

const PORT = process.env.PORT;

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  // 로그인 유저의 정보에 접근 가능
  context: async (ctx) => {
    // http 요청인 경우
    if (ctx.req) {
      return {
        loggedInUser: await getUser(ctx.req.headers.token),
        client,
      };
    // ss 요청인 경우
    } else {
      const {
        connection: { context },
      } = ctx;
      return { loggedInUser: context.loggedInUser };
    }
  },
  subscriptions: {
    // onConnect : 유저가 WebSocket으로 연결을 시도할 때, (1번)
    // connectionParams를 통해 기본적으로 HTTP headers를 사용 가능
    // 누가 listen을 하는지 알 수 있음
    onConnect: async ({ token }: any) => {
      if (!token) {
        throw new Error("You can't listen");
      }
      const loggedInUser = await getUser(token);
      // onConnect의 return 값 -> context
      return { loggedInUser };
    },
  },
});

const app = express();
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});
