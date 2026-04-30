import React, { useState } from 'react';
import {
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const columns = [
	{
		accessorKey: 'member',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-0 hover:bg-transparent text-slate-400 font-semibold uppercase text-xs h-auto py-1"
				>
					Politician
					{column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-3 w-3" /> : <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />}
				</Button>
			)
		},
		cell: ({ row }) => <div className="font-medium text-slate-100">{row.getValue('member') || 'N/A'}</div>,
	},
	{
		accessorKey: 'ticker',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-0 hover:bg-transparent text-slate-400 font-semibold uppercase text-xs h-auto py-1"
				>
					Ticker
					{column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-3 w-3" /> : <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />}
				</Button>
			)
		},
		cell: ({ row }) => (
			<span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs font-bold">
				{row.getValue('ticker') || 'N/A'}
			</span>
		),
	},
	{
		accessorKey: 'type',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-0 hover:bg-transparent text-slate-400 font-semibold uppercase text-xs h-auto py-1"
				>
					Type
					{column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-3 w-3" /> : <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />}
				</Button>
			)
		},
		cell: ({ row }) => {
			const type = row.getValue('type');
			return (
				<span className={type === 'Buy' ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
					{type || 'N/A'}
				</span>
			)
		},
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-0 hover:bg-transparent text-slate-400 font-semibold uppercase text-xs h-auto py-1"
				>
					Amount
					{column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-3 w-3" /> : <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />}
				</Button>
			)
		},
		cell: ({ row }) => <div className="text-slate-300">{row.getValue('amount') || 'N/A'}</div>,
		sortingFn: 'alphanumeric',
	},
	{
		accessorKey: 'date',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					className="px-0 hover:bg-transparent text-slate-400 font-semibold uppercase text-xs h-auto py-1"
				>
					Date
					{column.getIsSorted() === 'asc' ? <ArrowUp className="ml-2 h-3 w-3" /> : column.getIsSorted() === 'desc' ? <ArrowDown className="ml-2 h-3 w-3" /> : <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />}
				</Button>
			)
		},
		cell: ({ row }) => <div className="text-slate-500 text-sm">{row.getValue('date') || 'N/A'}</div>,
	},
];

export function TradesTable({ data }) {
	const [sorting, setSorting] = useState([{ id: 'date', desc: true }]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	return (
		<div className="w-full space-y-4">
			<div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
				<table className="w-full text-left border-collapse">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} className="border-b border-slate-800 bg-slate-800/50">
								{headerGroup.headers.map((header) => {
									return (
										<th key={header.id} className="p-4 text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody className="divide-y divide-slate-800">
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="hover:bg-slate-800/30 transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="p-4">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center text-slate-500 py-8">
									No trades found. Syncing data...
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			<div className="flex items-center justify-between px-2">
				<div className="text-sm text-slate-400">
					Showing <span className="font-medium text-slate-200">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="font-medium text-slate-200">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of <span className="font-medium text-slate-200">{table.getFilteredRowModel().rows.length}</span> results
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						className="text-xs bg-slate-900 border-slate-800 hover:bg-slate-800"
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						className="text-xs bg-slate-900 border-slate-800 hover:bg-slate-800"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
