"use client"

import axios from "axios"
import  * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Billboard, Category } from "@prisma/client"
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
import { 
  Select, 
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  billboardId: z.string().nonempty("billboardId is required"),
})


type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards
}) => {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const title = initialData ? "Edit Category" : "New Category"
  const description = initialData ? "Edit your category" : "Create a new category"
  const toastMessage = initialData ? "Category updated" : "Category created"
  const action = initialData ? "Save Changes" : "Create Category"

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  })

  const onSubmit = async ( data: CategoryFormValues ) => {
    try{
      setLoading(true)
      if(initialData){
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
      }else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.refresh()
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.refresh()
      router.push( `/${params.storeId}/categories`)
      toast.success("Category deleted")
    }catch(error){
      toast.error("Make sure you removed all products using this categories first.")
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
                  <Input disabled={loading} placeholder="Category name" {...field}/>
                </FormControl>
                <FormMessage />
                <FormDescription>

                </FormDescription>
              </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="billboardId"
            render={({field}) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <Select 
                  disabled={loading} 
                  onValueChange={field.onChange} 
                  value={field.value} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger >
                      <SelectValue 
                        defaultValue={field.value} 
                        placeholder="Select a billboard" 
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem 
                        key={billboard.id}
                        value={billboard.id}
                      >
                        {billboard.label}
                      </SelectItem>
                    )) }

                  </SelectContent>
                </Select>
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