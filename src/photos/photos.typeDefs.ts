import { gql } from "apollo-server";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    likes: Int!
    comments: Int!
    hashtags: [Hashtag]
    createAt: String!
    updatedAt: String!
    isMine: Boolean!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
    createAt: String!
    updatedAt: String!
  }
  type Like {
    id: Int!
    photo: Photo!
    createAt: String!
    updatedAt: String!
  }
`;
