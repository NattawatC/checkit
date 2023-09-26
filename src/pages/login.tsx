'use client'
import { Flex, MainLayout } from '@/components/layouts'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { loginFormSchema } from '@/types/user/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export function LoginForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-8 mt-12 mb-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[18px]">Email</FormLabel>
                <FormControl className="text-[18px]">
                  <Input placeholder="John@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[18px]">Password</FormLabel>
                <FormControl className="text-[18px]">
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <p className="text-right text-sm text-gray-600">
          <Link className="hover:underline" href="">
            Forgot password?{' '}
          </Link>
        </p>

        <Button className="py-3 px-4 w-full mt-6 text-[18px]" type="submit">
          Login
        </Button>

        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          {' '}
          or{' '}
        </div>

        <p className="text-center text-sm text-gray-600 my-14">
          Don&apos;t have an account?{' '}
          <Link className="text-blue-500 hover:underline" href="/register">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  )
}

const Login: NextPage = () => {
  return (
    <MainLayout>
      <Flex direction="col" className="items-center">
        <p className="font-semibold text-[32px]/[42px]">Welcome Back!</p>
        <p className="font-normal text-[16px]/[21px]">
          Please enter your details
        </p>
      </Flex>
      <LoginForm />
    </MainLayout>
  )
}

export default Login
