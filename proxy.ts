// 此文件是 next.js 文件约定 框架会自动加载这个文件 来创建拦截器
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// 导入基础配置，配置对象里是对未登录的拦截，跳转至登录页。
// nextjs不建议在proxy.ts中写太复杂的逻辑。
export default NextAuth(authConfig).auth;
// console.log(NextAuth(authConfig).auth.toString()) 打印可以看函数体
// 原生这里的写法时，对于未登录的拦截，以及cookie session的操作
// 这个库作用，拦截函数还是要你自己写，但你只需要 return true/false 等即可

export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],//使用正则排除这些路径
};

// 这里 和 auth.ts 会有写重复的感觉
// 是因为 这里需要 调用 NextAuth 来创建一个proxy.js所需要的实例，我们不自己写

// 而 auth.ts 是我们自定义的文件，这个文件在配置的基础上，增加了关于登录的部分。
// 我们需要在页面里调用的。