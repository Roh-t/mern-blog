import React, { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RouteBlog } from '@/helpers/RouteName'

const AddBlog = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    
    const {data: categoryData, loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`,{
      method:'get',
      credentials:'include'
    })
    const [filePreview,setPreview] = useState()
    const [file,setFile]  = useState()

    const formSchema = z.object({
        category: z.string().min(3,"Password must be atleast 3 character long"),
        title: z.string().min(3,"Title must be atleast 3 character long"),
        slug: z.string().min(3,"Slug must be atleast 3 character long"),
        blogContent: z.string().optional()
    })
    
   const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
        category:'',
        title:"",
        slug: "",
        blogContent:"",
        },
    })

    const handleEditorData = (event, editor) =>{
      const data = editor.getData()
      form.setValue('blogContent',data)
    }

    const blogTitle = form.watch('title')
    useEffect(()=> {
        
        if (blogTitle) {
            const slug = slugify(blogTitle, {lower:true})
            form.setValue('slug', slug)
        }
    },[blogTitle])

    async function onSubmit(values) {
      console.log(values)
        try{
        const newValues = { ...values, author: user.user._id}
        if (!file){
          showToast('error','Feature image required')
        }
        const formData  = new FormData()
        formData.append('file',file)
        formData.append('data',JSON.stringify(newValues))
        console.log(`${getEnv("VITE_API_BASE_URL")}/blog/add`);

        const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/blog/add`,{
            method: 'post',
            credentials:'include',
            body:formData
        })
        const data = await response.json()
        if(!response.ok){
            return showToast('error',data.message)
            
        }
        form.reset()
        setFile()
        setPreview()
        navigate(RouteBlog)
        showToast("success",data.message)
        }catch(error){
        showToast("error", error.message)
        }
    }
    let handleFileSelection = (files) =>{
      const file  = files[0]
      const preview = URL.createObjectURL(file)
      setFile(file)
      setPreview(preview)
    }


  return (
    <div>
      <Card className="pt-5">
             <h1 className='text-2xl font-bold text-center mb-5'>Create your Blog</h1>
             <CardContent>
             <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className='mb-3'>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData && categoryData.category.length > 0 && 
                            categoryData.category.map(category=><SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)}
                          
                          
                        </SelectContent>
                      </Select>                   
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className='mb-3'>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog Title" {...field} />
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
            <div className='mb-3'>
              <span className='mb-2 block'>Featured Image</span>
              <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
              
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                        <div className='flex justify-content items-center w-36 h-28 border-2 border-dashed rounded'>
                          <img src={filePreview}/>
                        </div>
                      
                    </div>
                 
                )}
              </Dropzone>
            </div>

            <div className='mb-3'>
            <FormField
              control={form.control}
              name="blogContent"
              render={({ field }) => (
                <FormItem className='w-200'>
                  <FormLabel>Blog Content</FormLabel>
                  <FormControl>
                     <Editor props={{initalData:'',onChange:handleEditorData}}/>
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

export default AddBlog
