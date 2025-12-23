import { QueryProvider } from "../QueryProvider/QueryProvider"
import { RouterProvider } from "../RouterProvider/RouterProvider"

import "@/app/styles/style.css"

export const RootProvider = () => {
  return (
    <QueryProvider>
        <RouterProvider />
    </QueryProvider>
  )
}