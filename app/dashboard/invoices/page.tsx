// // async function sleep(ms: number) {
// //   return new Promise(resolve => setTimeout(resolve, ms));
// // }
// export default function Page() {
//   // await sleep(2000); // 等待2s，制造pending状态
//   return <p>invoices Page</p>;
// }

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data'
 
export default async function Page(props:{
  searchParams?:Promise<{
    query?:string,
    page?:string
  }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  // 页码由分页组件维护，该组件需要传递要给总页码数，来维护总页码ui，
  // 当前页面由url searchParams作为权威数据源
  // 默认是1，Table组件需要读取页码呈现数据，而Pagination组件点击要修改url中page部分
  const totalPages = await fetchInvoicesPages(query);//查询关键字匹配的总页数
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}