import { Button } from "@/components/ui/button"

export default function Page() {
  const name: string = "hemn"
  return (
    <div className="flex min-h-svh p-6">
      <h1 className="text-purple-600">hemn software </h1>
      <Button variant={"outline"}>hi new prject {name}</Button>
    </div>
  )
}
