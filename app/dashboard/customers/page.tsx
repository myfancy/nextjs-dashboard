import CustomersTable from '@/app/ui/customers/table';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default async function page(props:{
  searchParams?:Promise<{
    query?:string,
    page?:string
  }>
}) {

  // CustomersTable 组件中有search组件，它会修改url
  // 这里从url（server page props）中拿到query词，传递给这个组件
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  return (
    <>
      <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
      <CustomersTable query={query} currentPage={currentPage}/>
      </Suspense>
    </>
  )
}