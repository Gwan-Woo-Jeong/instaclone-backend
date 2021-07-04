import client from '../../client';
import bcrypt from "bcrypt";
import { protectedResolver } from '../users.utils';

export default {
    Mutation: {
        editProfile: protectedResolver(
            async (
                _, {
                    firstName,
                    lastName,
                    username,
                    email,
                    password: newPassword,
                    bio,
                    avatar
                }, { loggedInUser, protectResolver }
            ) => {
                console.log(avatar);
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
                        ...(uglyPassword && { password: uglyPassword })
                    }
                });
                if (updatedUser.id) {
                    return {
                        ok: true
                    }
                } else {
                    return {
                        ok: false,
                        error: "could not update profile."
                    }
                }
            }
        )
    },
};
