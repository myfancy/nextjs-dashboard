import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById,fetchCustomers} from '@/app/lib/data';
 
export default async function Page(props:{params:Promise<{id:string}>}) {
    const params = await props.params;
    const {id} = params;
  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),//拿到id，找到对应的那个发票
    fetchCustomers(),//获取所有用户
  ]);
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      {/* 注意这个Form名字一样，但是导入的是eidt-form组件 */}
      <Form invoice={invoice} customers={customers} />
      {/* react原则，也是组件化的原则，就是干不一样的事，比如新增和编辑，哪怕内容再像，最好也弄成两个，不要加以对if else来判断是新增还是编辑，会很麻烦。 */}
      {/* 这里传递的是invoice，可能会纠结为什么不传递id？这里是打开当前编辑页，直接查询id对应的发票，直接将那一条发票的信息传递给子组件。 */}
    </main>
  );
}