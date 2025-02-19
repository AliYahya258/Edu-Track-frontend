'use client'

import React, { useState, useEffect } from 'react'
import StudentSidebar from '@/components/student/sidebar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

// Helper to get token from session storage
const getToken = () => {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  return userData?.accessToken || ''
}

// Fetch books from API
async function fetchBooks(query) {
  const token = getToken()
  const response = await fetch(`http://localhost:8081/api/library/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  return await response.json()
}

export default function ViewBooksPage() {
  const [books, setBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const fetchBooksWithStatus = async (query) => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await fetchBooks(query)
      const updatedBooks = data.map((book) => ({
        ...book,
        status:
            book.availabilityStatus === 'AVAILABLE'
                ? 'Available'
                : book.availabilityStatus === 'CHECKED_OUT'
                    ? 'Checked Out'
                    : book.availabilityStatus === 'RESERVED'
                        ? 'Reserved'
                        : 'Lost',
      }))
      setBooks(updatedBooks)
    } catch (error) {
      setErrorMessage('Error fetching books. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooksWithStatus('')
  }, [])

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
      <div className="min-h-screen bg-[#1a1f2e]">
        <div className="grid grid-cols-[auto_1fr]">
          <StudentSidebar />
          <main className="p-8">
            <div className="max-w-[1400px] mx-auto">
              {/* Page Header */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Books</h1>
                <p className="text-gray-400">Search and manage books below.</p>
              </header>

              {/* Error Message */}
              {errorMessage && (
                  <div className="bg-red-600/10 border border-red-600/20 text-red-500 p-3 rounded-md mb-4">
                    {errorMessage}
                  </div>
              )}

              {/* Search and Filter Card */}
              <Card className="bg-[#1c2237] rounded-lg p-6 mb-6">
                <CardHeader className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    {/* Search Input */}
                    <Input
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm"
                    />
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40 bg-gray-700/50 border-gray-600 text-gray-100 py-2 px-4 text-sm">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Checked Out">Checked Out</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:text-white"
                        onClick={() => fetchBooksWithStatus(searchTerm)}
                        disabled={loading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Books Table */}
              <div className="overflow-x-auto bg-[#1c2237] rounded-lg p-6">
                <table className="w-full border-collapse text-left">
                  <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="py-4 px-6 text-sm font-semibold text-gray-300">Title</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-300">Author</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-300">ISBN</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-300">Publisher</th>
                    <th className="py-4 px-6 text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                  </thead>
                  <tbody className="text-gray-300">
                  {filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
                          <tr
                              key={book.id}
                              className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors"
                          >
                            <td className="py-4 px-6 text-sm">{book.title}</td>
                            <td className="py-4 px-6 text-sm">{book.author}</td>
                            <td className="py-4 px-6 text-sm">{book.isbn}</td>
                            <td className="py-4 px-6 text-sm">{book.publisher}</td>
                            <td className="py-4 px-6 text-sm">{book.status}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400">
                          No books found.
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}
