import db from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params
}:{
  params: {
    billboardId: string
  }
}) => {

  const billboards = await db.billboard.findUnique({
    where: {
      id: params.billboardId
    }
  })

  // if( params.billboardId === 'new' ) return 
  // if(!billboard) return null

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm 
          initialData={billboards}
        />
      </div>
    </div>
  );
}
 
export default BillboardPage;