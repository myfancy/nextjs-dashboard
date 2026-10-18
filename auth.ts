import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import postgres from 'postgres';
import type {User} from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!,{ssl:'require'});

// 查询数据库函数 查询用户表
async function getUser(email:string):Promise<User|undefined> {
    try{
        const user = await sql<User[]>`
            SELECT * FROM users
            WHERE LOWER(email) = LOWER(${email.trim()})
            LIMIT 1
        `;
        return user[0];
    }catch(error){
        console.error('Failed to fetch user:',error);
        throw new Error('Failed to fetch user.');
    }
}

// NextAuth这个库的使用方式，传入配置对象，解构出几个方法
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,//传入基础配置对象
    providers: [
        // 全权证书 这是个邮箱登录函数 校验格式后 查询数据库 比对密码一致性
        Credentials({
            async authorize(credentials) {
                // 使用zod库建立schema并校验参数：credentials，得到校验后的结果 返回用户
                const parsedCredentials = z
                .object({ email: z.string().trim().email(), password: z.string().min(6) })
                .safeParse(credentials);

                // 如果校验成功
                if(parsedCredentials.success){
                    // 得到 用户邮箱和密码
                    const {email,password} = parsedCredentials.data;
                    // 据此查询用
                    const user = await getUser(email);
                    // 没有得到用户就返回null 前置判断
                    if(!user) return null;

                    // 加密用户输入的密码 与 数据库查出来的密码比对
                    const passwordMatch = await bcrypt.compare(password,user.password);

                    if(passwordMatch) return user;

                }
                // 否则 返回 null
                console.log('Invalid credentials')
                return null;
            },
        })
    ],
});

