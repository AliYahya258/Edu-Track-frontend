// 'use client'
//
// import { useState, useEffect } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
//
// export function BookList({ initialBooks = [] }) {
//     const [books, setBooks] = useState([])
//     const [filter, setFilter] = useState('all')
//
//     useEffect(() => {
//         setBooks(initialBooks)
//     }, [initialBooks])
//
//     const filteredBooks = books.filter(book =>
//         filter === 'all' || book.status === filter
//     )
//
//     return (
//         <div>
//             <div className="mb-4">
//                 <Select onValueChange={setFilter} defaultValue={filter}>
//                     <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by status"/>
//                     </SelectTrigger>
//                     <SelectContent className="bg-gray-800 text-white"> {/* Apply background color here */}
//                         <SelectItem value="all">All</SelectItem>
//                         <SelectItem value="Available">Available</SelectItem>
//                         <SelectItem value="Checked Out">Checked Out</SelectItem>
//                         <SelectItem value="Reserved">Reserved</SelectItem>
//                         <SelectItem value="Lost">Lost</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Title</TableHead>
//                         <TableHead>Author</TableHead>
//                         <TableHead>ISBN</TableHead>
//                         <TableHead>Publisher</TableHead>
//                         <TableHead>Status</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {filteredBooks.map((book) => (
//                         <TableRow key={book.id}>
//                             <TableCell>{book.title}</TableCell>
//                             <TableCell>{book.author}</TableCell>
//                             <TableCell>{book.isbn}</TableCell>
//                             <TableCell>{book.publisher}</TableCell>
//                             <TableCell>{book.status.replace('_', ' ')}</TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     )
// }


// BookList.js
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export function BookList({ books }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-gray-800/50 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Author</TableHead>
                    <TableHead className="text-gray-300">ISBN</TableHead>
                    <TableHead className="text-gray-300">Publisher</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {books.map((book) => (
                    <TableRow key={book.id} className="hover:bg-gray-800/30">
                        <TableCell className="font-medium text-gray-200">{book.title}</TableCell>
                        <TableCell className="text-gray-200">{book.author}</TableCell>
                        <TableCell className="text-gray-200">{book.isbn}</TableCell>
                        <TableCell className="text-gray-200">{book.publisher}</TableCell>
                        <TableCell>
                            <Badge
                                className={
                                    book.status === 'Available'
                                        ? 'bg-green-600'
                                        : book.status === 'Checked Out'
                                            ? 'bg-red-600'
                                            : 'bg-yellow-600'
                                }
                            >
                                {book.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
