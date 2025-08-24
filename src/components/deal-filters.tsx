"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListFilter, Search } from "lucide-react"

export default function DealFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:w-auto flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by address, city..."
          className="pl-10 w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10">
              <ListFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              For Sale
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>
              Off-Market
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem>
              Rental
            </DropdownMenuCheckboxItem>
             <DropdownMenuCheckboxItem>
              Flip
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
         <Button size="sm" className="h-10">
          Find Deals
        </Button>
      </div>
    </div>
  )
}
