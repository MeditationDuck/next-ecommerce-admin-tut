import db from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const BillboardPage = async ({
  params
}:{
  params: {
    sizeId: string
  }
}) => {

  const size = await db.size.findUnique({
    where: {
      id: params.sizeId
    }
  })

  // if( params.billboardId === 'new' ) return 
  // if(!billboard) return null

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm 
          initialData={size}
        />
      </div>
    </div>
  );
}
 
export default BillboardPage;