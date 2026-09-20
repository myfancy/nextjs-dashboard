import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function listInvoices() {
	const data = await sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;
  // SELECT FROM WHERE 都理解
  // JOIN ON ???
  
  // 查询：发票金额、客户姓名
  // 来源：发票表
  // 和客户表关联，关联条件：发票.customer_id = 客户.id
  // 筛选：发票金额等于 666

  // 两个表 invoices (里面至少有 amount customer_id 这个是customer表的外键)
  // customer表（里面有id name）
  // 现在需要的结果是 {amount:xxx,name:xxx}

	return data;
}

export async function GET() {
  // 注释此行，取消注释其他行
  // return Response.json({
  //   message:
  //     'Uncomment this file and remove this line. You can delete this file when you are finished.',
  // });
  try {
  	return Response.json(await listInvoices());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}
