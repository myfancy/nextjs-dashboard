// async function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
export default function Page() {
  // await sleep(2000); // 等待2s，制造pending状态
  return <p>invoices Page</p>;
}