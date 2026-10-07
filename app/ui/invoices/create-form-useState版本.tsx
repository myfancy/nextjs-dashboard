'use client'
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import  { createInvoice,State } from '@/app/lib/actions';
import { useActionState, useState, useTransition, type FormEvent } from 'react';

export default function Form({ customers }: { customers: CustomerField[] }) {
  const initialState:State = {
    message: null,
    errors: {},
    rawFormData: { customerId: null, amount: null, status: null },
  }
  const [state,formAction] = useActionState(createInvoice,initialState);
  const [isPending,startTransition] = useTransition();
  // 不一定非要依赖服务器端返回原始数据，因为原始数据本来就在本地呢
  // 但是这样比较麻烦一点。
  const [formValues, setFormValues] = useState({
    customerId: '',
    amount: '',
    status: '' as '' | 'pending' | 'paid',
  });

  // 手动提交以避开直接使用 <form action={formAction}> 时遇到的表单重置问题；
  // 这些控件由 formValues 控制，输入值保存在客户端 state 中。
  // 当前方案是，使用受控组件保存用户输入状态。

  // 如果选择非受控组件，自身保存用户状态，会出现问题。普通的输入型input正常，但是radio 和 select这些会被情况用户选择。
  // 出现问题（普通input控件可以保存状态，但是select input type=radio显示不正常。）
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedForm = new FormData(event.currentTarget);
    startTransition(() => {
      formAction(submittedForm);
    });
  }

  return (
    // 通过 onSubmit 手动构造 FormData 并调用 action，这样可以添加阻止默认事件的代码，防止清空用户输入。
    // 错误信息返回，此部分的jsx必然重新渲染的，但form不会重置。
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            {/* 加入aria-describedby="customer-error" */}
            <select
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={formValues.customerId}
              onChange={(event) =>
                setFormValues((currentValues) => ({
                  ...currentValues,
                  customerId: event.target.value,
                }))
              }
              aria-describedby="customer-error"
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {/* 添加错误提示html，这里没内容会自动不见（空标签） */}
          <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state.errors?.customerId &&
              state.errors.customerId.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
              {/* {JSON.stringify(state.errors)} */}
              {/* {"customerId":["请选择一个顾客"],"amount":["金额不能小于0"],"status":["请选择一个发票状态"]} */}
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formValues.amount}
                onChange={(event) =>
                  setFormValues((currentValues) => ({
                    ...currentValues,
                    amount: event.target.value,
                  }))
                }
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  checked={formValues.status === 'pending'}
                  onChange={() =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      status: 'pending',
                    }))
                  }
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  checked={formValues.status === 'paid'}
                  onChange={() =>
                    setFormValues((currentValues) => ({
                      ...currentValues,
                      status: 'paid',
                    }))
                  }
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
            <div id="status-error" aria-live="polite" aria-atomic="true">
              {state.errors?.status &&
                state.errors.status.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isPending}>Create Invoice</Button>
      </div>
    </form>
  );
}
