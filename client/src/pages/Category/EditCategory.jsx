import React, { useEffect } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {Form, FormControl,FormItem,FormLabel, FormField, FormMessage } from '@/components/ui/form'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import { useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/useFetch'


const EditCategory = () => {
    const {category_id} = useParams()

    const {data: categoryData, loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/show/${category_id}`,{
      method:'get',
      Credentials:'include'
    },[category_id])



    const formSchema = z.object({
        name: z.string().min(3,"Password must be atleast 3 character long"),
        slug: z.string().min(3,"Password must be atleast 3 character long"),
    })
    
        const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        name:"",
        slug: "",
        },
    })
    
    const categoryName = form.watch('name')
    useEffect(()=> {
        
        if (categoryName) {
            const slug = slugify(categoryName, {lower:true})
            form.setValue('slug', slug)
        }
    },[categoryName])
  

    useEffect(()=>{

      if (categoryData) {
        console.log(categoryData)
        form.setValue('name', categoryData.category.name)
        form.setValue('slug',categoryData.category.slug)
      }

    },[categoryData])
    
    async function onSubmit(values) {
        try{
        const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/category/update/${category_id}`,{
            method: 'put',
            headers: { 'Content-type':'application/json'},
            body:JSON.stringify(values)
        })
        const data = await response.json()
        if(!response.ok){
            return showToast('error',data.message)
            
        }

        showToast("success",data.message)
        }catch(error){
        showToast("error", error.message)
        }
    }


  return (
    <div>
        <Card className="pt-5 max-w-screen-md mx-auto">
             <h1 className='text-2xl font-bold text-center mb-5'>Create your Account</h1>
             <CardContent>
             <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className='mb-3'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className='mb-3'>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
             </Form>
             </CardContent>
        </Card>

    </div>

    

    
  )
}

export default EditCategory
