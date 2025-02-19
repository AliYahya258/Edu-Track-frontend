'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SearchForm({ onSearch }) {
    const [search, setSearch] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(search) // Trigger the search function in the parent component
    }

    return (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
            <Input
                type="text"
                placeholder="Search books..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                Search
            </Button>
        </form>
    )
}
