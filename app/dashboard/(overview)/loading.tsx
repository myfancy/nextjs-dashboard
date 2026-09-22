// export default function Loading() {
//   return <div>Loading...</div>;
// }
import DashboardSkeleton from '@/app/ui/skeletons';
 
export default function Loading() {
  return <DashboardSkeleton />;
}

// loading.tsx 原理
// 当 page.tsx 和 其子路径 page.tsx中有异步逻辑时（异步组件）
// 会自动启用这个loading.tsx内部的内容，无论是简单的html，还是骨架屏，骨架屏只是特殊的html+css动画逻辑。

// 修复loading.tsx错误
// 首先复现错误：将 /dashboard/customer/page.tsx /dashboard/invoices/page.tsx
// 修改为异步组件，可以简单的模拟： 
/*
async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default async function Page() {
  await sleep(2000); // 等待2s，制造pending状态
  return <p>customers Page</p>;
}
*/
// （当想要停留在骨架屏，来修改或者研究html布局逻辑时，也可以用此招。）

// 解决方案：
// 目的：想要loading.tsx 只作用与同级目录的page.tsx
// 使用括号包裹overview
// (overview) 这叫路由组，这样的文件夹包裹 loading.ts page.tsx
// 就会实现目的。