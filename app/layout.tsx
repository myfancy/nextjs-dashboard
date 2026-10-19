import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata:Metadata = {
  title:{
    template:'%s | ferron独创数据面板',
    default:'ferron独创数据面板'
  },
  description:'这是我个人联系项目，使用nextjs实现常见后台管理中心页面',
  // metadataBase:new URL('https://next-learn-dashboard.vercel.sh')//此处需要修改为项目正式地址
  // 作用，**给所有「相对路径的元数据链接」提供基准域名**，自动补全成完整绝对 URL。
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        </body>
    </html>
  );
}
