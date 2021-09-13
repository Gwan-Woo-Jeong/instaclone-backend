import { PubSub } from "graphql-subscriptions";

/*
pubsub (public - subscribe) :
subscription은 오랫동안 지속되는 GraphQL의 read Operation
서버에 있는 것이 무엇이든 항상 listen 할 수 있음.
서버에서 어떤 일이 일어나고, 내가 만든 조건이 충족되면, 서버가 무언가를 
실시간으로 push하게 만들 수 있음. (WebSocket 기반)
*/

const pubsub = new PubSub();

export default pubsub;
