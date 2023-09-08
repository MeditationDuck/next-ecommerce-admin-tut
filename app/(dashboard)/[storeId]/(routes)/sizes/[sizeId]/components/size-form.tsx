"use client"

import axios from "axios"
import  * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Size } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import { useParams,useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/iamge-upload"

const formSchema = z.object({
  name: z.string().nonempty("Size name is required"),
  value: z.string().nonempty("Size image is required"),
})


type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
  initialData: Size | null
}

export const SizeForm: React.FC<SizeFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Size" : "New Size"
  const description = initialData ? "Edit your size" : "Create a new size"
  const toastMessage = initialData ? "Size updated" : "Size created"
  const action = initialData ? "Save Changes" : "Create Size"

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  })

  const onSubmit = async ( data: SizeFormValues ) => {
    try{
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
      }else {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage)
    }catch( error ){
      toast.error("Something went wrong")
    }finally{
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try{
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      router.push( `/${params.storeId}/sizes`)
      toast.success("Size deleted")
    }catch(error){
      toast.error("Make sure you removed all products using this size first.")

    }finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => onDelete()}
        loading={loading}

      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={()=> setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>

        )}
       
      </div>
      <Separator />
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">       
          <div className="grid grid-cols-3 gap-8">
            <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Size name" {...field}/>
                </FormControl>
                <FormMessage />
                <FormDescription>

                </FormDescription>
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="value"
            render={({field}) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Size Value" {...field}/>
                </FormControl>
                <FormMessage />
                <FormDescription>

                </FormDescription>
              </FormItem>
            )}
            />
          </div>
          <Button 
            disabled={loading} 
            className="ml-auto" 
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}