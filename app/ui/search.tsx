'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { usePathname, useSearchParams,useRouter } from 'next/navigation';//获取url的查询参数
import { useDebouncedCallback } from 'use-debounce'

// 通用的搜索组件，只做一件事：
// 输入文字时，将文字内容加到url上： /path?query=xxx（router.replace不引发浏览器跳转）
// 边界处理：新的搜索词给page设为1 /path?query=xxx&page=1
// 边界处理：没有搜索文字时，删除query
// 后果：它自己不执行查询，修改表格内容之类的事，而是修改了url以后，其他组件“监控”url的改变。

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
