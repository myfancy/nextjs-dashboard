'use server';

import {z} from 'zod';
import postgres from 'postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!,{ssl:'require'});

// 使用zod库进行类型校验，使用方法看zod官网reference
// z.xx()进行格式约定，里面可以传失败的配置对象。
const formDataSchema = z.object({
    id:z.string(),
    customerId:z.string({
        invalid_type_error:'请选择一个顾客'
    }),
    amount:z.coerce.number().gt(
        0,{
            message:'金额不能小于0'
        }
    ),
    status:z.enum(['pending', 'paid'],{
        invalid_type_error:'请选择一个发票状态'
    }),
    date:z.string()
})
const createInvoiceSchema = formDataSchema.omit({id:true,date:true});
const updateInvoiceSchema = formDataSchema.omit({id:true,date:true});

// 如果要用useActionState hook 需要actions函数有两个参数

// ts类型约定 定义的第一个参数的类型
export type State = {//导出是因为，这个useActionState钩子也要用它来约束初始状态的ts类型
    errors?:{
        customerId?:string[];
        amount?:string[];
        status?:string[];
    };
    message?:string|null;
    rawFormData:{
        customerId:string|null;
        amount:string|null;
        status:string|null;
    };
    submissionId?:number;
}

function getStringFormValue(formData:FormData,name:string):string|null {
    const value = formData.get(name);
    return typeof value === 'string' ? value : null;
}

export async function createInvoice(prevState:State,formData:FormData):Promise<State> {
    // 从 formdata中提取数据，要具体提取什么项，要看传了什么
    // 要知道传了什么，得去看表格里有那些项
    // 而且还要知道数据库里需要哪些字段
    // 你能提取到什么，取决于formData里有什么，也就是表单项：name字段。
    // 这里可以用 Object.fromEntries(formData.entries())一次性获取。
    // 具体想要知道这里有哪些字段，还是要看form。
    // 当然最终数据库里有那些字段，是要最开始设计的。
    const rawFormData:State['rawFormData'] = {
        customerId:getStringFormValue(formData,'customerId'),
        amount:getStringFormValue(formData,'amount'),
        status:getStringFormValue(formData,'status')
    }
    // // 测试这里打印在服务端控制台
    // console.log(rawFormData);
    // console.log(typeof rawFormData.amount);

    // const {customerId,amount,status} = createInvoiceSchema.parse(rawFormData);
    // 改为safeParse，之后就无法用解耦了，因为返回的对象变了。
    const validatedFields = createInvoiceSchema.safeParse(rawFormData);
    // {data,error,success}

    // 做错误处理
    if(!validatedFields.success){
        return {
            errors:validatedFields.error.flatten().fieldErrors,
            message:'不存在的字段，创建发票失败。',
            rawFormData,
            submissionId:(prevState.submissionId ?? 0) + 1
        }
    }

    const {customerId,amount,status} = validatedFields.data;

    const amountInCents = amount*100; //使用分来统计金额，规避浮点问题

    const date = new Date().toISOString().split('T')[0];
    try{
        await sql`
            INSERT INTO invoices (customer_id,amount,status,date)
            VALUES (${customerId},${amountInCents},${status},${date})
        `;
    }catch(error){
        return {
            message:'数据库错误：创建新发票失败',
            rawFormData,
            submissionId:(prevState.submissionId ?? 0) + 1
        }
    }
    
    revalidatePath('/dashboard/invoices');//这是重新校验缓存的意思
    // 为什么要？因为react搞了缓存
    redirect('/dashboard/invoices');//重定向至这个页面获取最新数据
    // 这里需要导入这两个方法

}

export async function updateInvoice(id:string,prevState:State,formData:FormData):Promise<State> {
    // console.log('updateInvoice action',id)
    const rawFormData:State['rawFormData'] = {
        customerId:getStringFormValue(formData,'customerId'),
        amount:getStringFormValue(formData,'amount'),
        status:getStringFormValue(formData,'status')
    }
    const validatedFields = updateInvoiceSchema.safeParse(rawFormData);

    // 做错误处理
    if(!validatedFields.success){
        return {
            errors:validatedFields.error.flatten().fieldErrors,
            message:'不存在的字段，创建发票失败。',
            rawFormData,
            submissionId:(prevState.submissionId ?? 0) + 1
        }
    }

    const {customerId,amount,status} = validatedFields.data;
    
    const amountInCents = amount*100; //使用分来统计金额，规避浮点问题
    // 整体跟创建发票很像，但要注意修改sql语句
    // 这里是更新发票，发票的id不变，但是其他信息都可以改。
    // 这里的修改有些抽象，顾客创建了发票，发票随机生成唯一id，结果这个id对应的顾客还能改。
    // 这里这是演示。
    // 实际上可以设计不需更改顾客，html中没有对应的下拉框，actions中没有对应的字段修改。
    try{
        await sql`
            UPDATE invoices
            SET customer_id=${customerId},amount=${amountInCents},status=${status}
            WHERE id=${id}
        `;
    }catch(e){
        console.log(e);
        // return {
        //     message:'数据库失败：更新发票失败'
        // }
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id:string):Promise<void|{message:string}> {
    // throw new Error('模拟失败')
    try{
        await sql`
            DELETE FROM invoices
            WHERE id=${id}
        `
    }catch(e){
        console.log(e);
        return {
            message:'数据库错误：删除发票失败'
        }
    }
    revalidatePath('/dashboard/invoices');
}
