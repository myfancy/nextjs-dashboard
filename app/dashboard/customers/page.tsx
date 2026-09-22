// async function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
export default function Page() {
  // await sleep(2000); // 等待2s，制造pending状态
  return <p>customers Page</p>;
}

// 模拟异步组件，查看根目录loading.tsx作用范围。
// 取消模拟，如果没有loading.tsx，异步组件，会在条件达成施加载。