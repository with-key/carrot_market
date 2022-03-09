import { PrismaClient } from "@prisma/client";

// next가 hot reload를 할 때마다 prisma client가 새로 생성되는 것을 막기 위해
// 아래 로직을 구현한다.

// 최초 client가 없을 때는 생성하고, 만약 이미 생성된 client가 있으면
// 생성하지 않고 생성되어 있는 client를 사용한다.

declare global {
  var client: PrismaClient | undefined;
}

const client = global.client || new PrismaClient();
// 추론 :  global.client 가 false 이면 new PrismaClient(), global.client가 ture이면 global.client

if (process.env.NODE_ENV === "development") global.client = client;
export default client;
