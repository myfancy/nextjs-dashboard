'use server';

import {z} from 'zod';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!,{ssl:'require'});

const formDataSchema = z.object({
    id:z.string(),
    customerId:z.string(),
    amount:z.coerce.number(),
    status:z.enum(['pending', 'paid']),
    date:z.string()
})
const createInvoiceSchema = formDataSchema.omit({id:true,date:true});
const updateInvoiceSchema = formDataSchema.omit({id:true,date:true});

export async function createInvoice(formData:FormData) {
    // 从 formdata中提取数据，要具体提取什么项，要看传了什么
    // 要知道传了什么，得去看表格里有那些项
    // 而且还要知道数据库里需要哪些字段
    // 你能提取到什么，取决于formData里有什么，也就是表单项：name字段。
    // 这里可以用 Object.fromEntries(formData.entries())一次性获取。
    // 具体想要知道这里有哪些字段，还是要看form。
    // 当然最终数据库里有那些字段，是要最开始设计的。
    const rawFormData = {
        customerId:formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status')
    }
    // // 测试这里打印在服务端控制台
    // console.log(rawFormData);
    // console.log(typeof rawFormData.amount);

    const {customerId,amount,status} = createInvoiceSchema.parse(rawFormData);

    const amountInCents = amount*100; //使用分来统计金额，规避浮点问题

    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id,amount,status,date)
        VALUES (${customerId},${amountInCents},${status},${date})
    `;
    revalidatePath('/dashboard/invoices');//这是重新校验缓存的意思
    // 为什么要？因为react搞了缓存
    redirect('/dashboard/invoices');//重定向至这个页面获取最新数据
    // 这里需要导入这两个方法

}

export async function updateInvoice(id:string,formData:FormData) {
    // console.log('updateInvoice action',id)
    const rawFormData = {
        customerId:formData.get('customerId'),//理解为从jsx form中取 name="custmoerId"的input的value
        amount:formData.get('amount'),
        status:formData.get('status')
    }
    const {customerId,amount,status} = updateInvoiceSchema.parse(rawFormData);
    const amountInCents = amount*100; //使用分来统计金额，规避浮点问题
    // 整体跟创建发票很像，但要注意修改sql语句
    // 这里是更新发票，发票的id不变，但是其他信息都可以改。
    // 这里的修改有些抽象，顾客创建了发票，发票随机生成唯一id，结果这个id对应的顾客还能改。
    // 这里这是演示。
    // 实际上可以设计不需更改顾客，html中没有对应的下拉框，actions中没有对应的字段修改。
    await sql`
        UPDATE invoices
        SET customer_id=${customerId},amount=${amountInCents},status=${status}
        WHERE id=${id}
    `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id:string) {
    await sql`
        DELETE FROM invoices
        WHERE id=${id}
    `
    revalidatePath('/dashboard/invoices');
}

