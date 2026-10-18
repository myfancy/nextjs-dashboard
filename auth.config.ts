// 普通的配置文件
import type { NextAuthConfig } from 'next-auth';

// 这是nuxtauth插件所需的配置文件(并不是该插件自动读取，而是在proxy.ts中导入的)
// 这个配置实在干吗？
// 配置需要拦截的route，设置拦截时运行的回调函数。
// 而对于登录功能，这个库规定了你写在providers里面。
// 然后可以写在这个配置对象里，为了兼容，最好在另外的auth.ts中单独传入。
// 如果自定义实现登录注销功能，需要你操作cookie session，纯手搓，代码位置一般放在actions里面。
export const authConfig = {
  pages: {
    signIn: '/login',//自定义登录页地址 如果没登录 会跳转 默认 api/auth/signin
  },
  callbacks:{
    // 该回调在请求进入页面之前执行。检测请求url
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;//放行 不拦截此次请求 
        return false; // 将未登录用户重定向至登录页面 地址在上面定义
      } else if (isLoggedIn) {//请求的不是/dashboard，但是用户已登录
        return Response.redirect(new URL('/dashboard', nextUrl));//已登录 跳转至 面板页
      }
      return true;//放行 不拦截此次请求 
    },
  },
  providers:[]
} satisfies NextAuthConfig; //satisfies 满足  区别与: 就是为了后续ts类型推导
// 比如：
/*
type Config = {
  port: number;
  timeout: number;
};
const config1: Config = {
  port: 3000,
  timeout: 5000,
};
const config2 = {
  port: 3000,
  timeout: 5000,
} satisfies Config;
在填充这个对象时，ts的类型提示没有区别。
但是，当需要类型推导时：
const a = [config1.port,4000] //推导结果number[]
const b = [config2.port,4000] //推导结果(3000|4000)[]
当你使用a b 时，比如作为参数使用fn(a,b)，而函数的参数已经有了类型的要求是(3000|4000)[]，此时a会报错。
*/