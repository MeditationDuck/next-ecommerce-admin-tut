
import db from "@/lib/prismadb"
import { SizesClient } from "./components/client"
import { SizeColumn } from "./components/columns"
import { format } from "date-fns"



const SizesPage = async ({
  params
}:{
  params: { storeId: string }
}) => {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, "MMMM do, yyyy")
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes}/>
      </div>
    </div>
  )
}

export default SizesPage