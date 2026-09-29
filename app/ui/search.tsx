'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams,useRouter } from 'next/navigation';//获取url的查询参数
import { useDebouncedCallback } from 'use-debounce'

// 当前组件只干一件事，input value改变就修改url的查询字符串部分。
export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();//这玩意只读的
  const pathname = usePathname();
  const {replace} = useRouter();
  const handleSearch = useDebouncedCallback((term:string)=>{
    const params = new URLSearchParams(searchParams);//创建对象
    params.set('page', '1');//添加新的搜索词时，将页码改成1
    if(term){
      params.set('query',term)
    }else{
      params.delete('query')
    }
    // URLSearchParams webapi 固定用法，set即添加 ? 后面的query=${term} 部分，不存在则删除这个query。

    replace(`${pathname}?${params.toString()}`)//需要手动拼接？，为什么后面的需要toString，webapi固定用法。
  },300);
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input type='search'
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e)=>{
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
