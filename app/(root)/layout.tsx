import db from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function SetupLayout({
  children 
}:{
  children: React.ReactNode
}) {
  const { userId } = auth()

  if(!userId) redirect('/sign-in')

  // const billboard = await db.billboard.findFirst({
  //   where: {
  //     userId,
  //   }
  // })

  const store = await db.store.findFirst({
    where: {
      userId,
    }
  })

  if(store) redirect(`/${store.id}`)

  return (
    <>
      {children}
    </>
  )
}