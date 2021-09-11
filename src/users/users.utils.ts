import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver } from "../types";

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    // find user with id inside token
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({
        where: { id: verifiedToken["id"] },
      });
      if (user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

/*
  protectedResolver이 {ok, error}를 리턴하기 때문에, mutation에서는 문제가 없었지만 (typeDefs에서 예상)
  query에선 이 결과를 기대하지 않기 때문에, 에러가 났음. 따라서, info라는 속성을 이용하여 분기를 해주어 다른 값을 리턴
*/

export const protectedResolver =
  (ourResolver: Resolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      const query = info.operation.operation === "query";
      // 요청이 query일 경우
      if (query) {
        return null;
      // mutation일 경우
      } else {
        return {
          ok: false,
          error: "Please log in to perform this action.",
        };
      }
    }
    return ourResolver(root, args, context, info);
  };
