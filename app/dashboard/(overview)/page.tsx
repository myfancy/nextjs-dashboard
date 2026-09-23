import CardWrapper, { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {fetchCardData} from '@/app/lib/data';//数据库获取
import { Suspense } from 'react';
import { RevenueChartSkeleton,LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';


export default async function Page() {
  // const revenue = await fetchRevenue(); // steaming a component
  // 如果某个组件每次调用都需要指定数据来源，也很麻烦，将数据获取逻辑抽象至组件内部。
  // const latestInvoices = await fetchLatestInvoices();
  // const {totalPaidInvoices,totalPendingInvoices,numberOfInvoices,numberOfCustomers} = await fetchCardData();
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        数据面板
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="已收取发票" value={totalPaidInvoices} type="collected" />
        <Card title="待收取发票" value={totalPendingInvoices} type="pending" />
        <Card title="发票总数" value={numberOfInvoices} type="invoices" />
        <Card title="客户总数" value={numberOfCustomers} type="customers" /> */}
        <Suspense fallback={<CardsSkeleton/>}>
          <CardWrapper/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* 思考 suspense 和 fallback 也可以移动到组件内部 */}
        <Suspense fallback={<RevenueChartSkeleton/>}>
          <RevenueChart/>
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton/>}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}