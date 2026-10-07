import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">创建发票</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  // const handleSubmit = async ():Promise<void>=>{
  //   await deleteInvoiceWithId()
  // }
  // <form action = {handleSubmit}>
  // 这样包可以消除ts错误，但是程序不能正常运行
  // 错误原因分析，action期望的函数返回值是Promise<void>，可是你的函数实际返回Promise<{message:string}>
  // chapter12 先不解决此问题，也能正常运行，13章再说。

  // 解释：上面的错误在于，不知道action只能接受服务器函数，局部的函数，必须手动标明use server
  const handleSubmit = async ()=>{
    'use server';
    await deleteInvoiceWithId();//手动放弃服务器段返回的错误，以后考虑接收使用
  }
  return (
    <form action={handleSubmit}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
