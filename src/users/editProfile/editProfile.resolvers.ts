import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { createWriteStream } from "fs";
import { Resolvers } from "../../types";
import { uploadToS3 } from "../../shared/shared.utils";

const resolvers: Resolvers = {
  Mutation: {
    editProfile: protectedResolver(
      async (
        _,
        {
          firstName,
          lastName,
          username,
          email,
          password: newPassword,
          bio,
          avatar,
        },
        { loggedInUser }
      ) => {
        if (firstName.length < 1) {
          return {
            ok: false,
            error: "Enter your first name.",
          };
        } else if (username.length < 5) {
          return {
            ok: false,
            error: "User name must be longer than 4 characters.",
          };
        } else if (email.length < 1) {
          return {
            ok: false,
            error: "Enter your E-mail.",
          };
        } else if (newPassword.length < 5) {
          return {
            ok: false,
            error: "Password must be longer than 4 characters.",
          };
        }
        let avatarUrl = null;
        let setDefaultAvatar = false;
        if (avatar === "default") {
          setDefaultAvatar = true;
        } else if (avatar && avatar !== "existing") {
          // uploadToS3에서 S3에 사진을 업로드 한 후, 파일 경로를 리턴
          avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
          /* const { filename, createReadStream } = await avatar;
          const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
          const readStream = createReadStream();
          const writeStream = createWriteStream(
            process.cwd() + "/uploads/" + newFilename
          );
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:4000/static/${newFilename}`; */
        }
        let uglyPassword = null;
        if (newPassword) {
          uglyPassword = await bcrypt.hash(newPassword, 10);
        }
        const updatedUser = await client.user.update({
          where: { id: loggedInUser.id },
          data: {
            firstName,
            lastName,
            username,
            email,
            bio,
            ...(uglyPassword && { password: uglyPassword }),
            ...(avatarUrl && { avatar: avatarUrl }),
            ...(setDefaultAvatar && { avatar: null }),
          },
        });
        if (updatedUser.id) {
          return {
            ok: true,
          };
        } else {
          return {
            ok: false,
            error: "could not update profile.",
          };
        }
      }
    ),
  },
};

export default resolvers;
