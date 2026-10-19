import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';

export const metadata:Metadata = {
  title:{
    template:'%s | 管理中心 | ferron独创数据面板',
    default:'首页'
  }
}
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}